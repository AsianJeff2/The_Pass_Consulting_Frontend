"use client";

import { useEffect, useId, useRef, useState } from "react";
import type * as Three from "three";

/** A decorative, demand-rendered place setting. No information depends on WebGL. */
export default function PassSculpture() {
  const hostRef = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);
  const id = useId().replace(/:/g, "");

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    let cancelled = false;
    let disposeScene: (() => void) | undefined;

    async function initialize() {
      const THREE = await import("three");
      if (cancelled || !host) return;

      const canvas = document.createElement("canvas");
      let webgl: WebGL2RenderingContext | null;
      try {
        webgl = canvas.getContext("webgl2", {
          alpha: true,
          antialias: true,
          powerPreference: "low-power",
        });
      } catch {
        return;
      }
      if (!webgl) return;

      let renderer: Three.WebGLRenderer;
      try {
        renderer = new THREE.WebGLRenderer({
          canvas,
          context: webgl,
          alpha: true,
          antialias: true,
          powerPreference: "low-power",
        });
      } catch {
        webgl.getExtension("WEBGL_lose_context")?.loseContext();
        return;
      }

      const geometries = new Set<Three.BufferGeometry>();
      const materials = new Set<Three.Material>();
      const textures = new Set<Three.Texture>();
      let environment: Three.WebGLRenderTarget | undefined;
      let frame = 0;
      const observers: {
        resize?: ResizeObserver;
        intersection?: IntersectionObserver;
      } = {};
      let removeListeners = () => {};

      disposeScene = () => {
        cancelAnimationFrame(frame);
        observers.resize?.disconnect();
        observers.intersection?.disconnect();
        removeListeners();
        geometries.forEach((geometry) => geometry.dispose());
        materials.forEach((material) => material.dispose());
        textures.forEach((texture) => texture.dispose());
        environment?.dispose();
        renderer.renderLists.dispose();
        renderer.dispose();
        renderer.forceContextLoss();
        renderer.domElement.remove();
      };

      renderer.setClearColor(0x000000, 0);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 0.9;
      renderer.shadowMap.enabled = false;
      renderer.domElement.setAttribute("aria-hidden", "true");
      Object.assign(renderer.domElement.style, {
        position: "absolute",
        inset: "0",
        width: "100%",
        height: "100%",
        pointerEvents: "none",
      });

      const scene = new THREE.Scene();
      const camera = new THREE.OrthographicCamera(-3, 3, 3, -3, 0.1, 40);
      camera.position.set(0.3, 7.2, 7.4);
      camera.lookAt(0, 0.12, -0.12);

      // A local studio reflection map gives the metal and glass broad highlights.
      const studio = document.createElement("canvas");
      studio.width = 512;
      studio.height = 256;
      const context = studio.getContext("2d");
      if (context) {
        const wash = context.createLinearGradient(0, 0, 0, 256);
        wash.addColorStop(0, "#77786a");
        wash.addColorStop(0.4, "#404d3f");
        wash.addColorStop(0.65, "#132d22");
        wash.addColorStop(1, "#0d211a");
        context.fillStyle = wash;
        context.fillRect(0, 0, 512, 256);
        for (const [x, y, width, height] of [
          [45, 12, 94, 115],
          [302, 30, 22, 130],
          [452, 44, 10, 130],
        ]) {
          context.fillStyle = "#fffdf4";
          context.fillRect(x, y, width, height);
        }
        const studioTexture = new THREE.CanvasTexture(studio);
        studioTexture.colorSpace = THREE.SRGBColorSpace;
        studioTexture.mapping = THREE.EquirectangularReflectionMapping;
        textures.add(studioTexture);
        const pmrem = new THREE.PMREMGenerator(renderer);
        try {
          environment = pmrem.fromEquirectangular(studioTexture);
          scene.environment = environment.texture;
          scene.environmentIntensity = 0.65;
        } finally {
          pmrem.dispose();
        }
      }

      scene.add(new THREE.HemisphereLight(0xfffae8, 0x132d24, 0.55));
      const key = new THREE.DirectionalLight(0xfff5e6, 2.45);
      key.position.set(-5, 4, 2);
      scene.add(key);
      const fill = new THREE.DirectionalLight(0xdeeadf, 0.4);
      fill.position.set(4, 3, -4);
      scene.add(fill);

      function material<T extends Three.Material>(value: T): T {
        materials.add(value);
        return value;
      }

      function geometry<T extends Three.BufferGeometry>(value: T): T {
        geometries.add(value);
        return value;
      }

      const ceramic = material(
        new THREE.MeshPhysicalMaterial({
          color: 0xe8dfcb,
          roughness: 0.36,
          metalness: 0,
          clearcoat: 0.28,
          clearcoatRoughness: 0.27,
        }),
      );
      const brass = material(
        new THREE.MeshStandardMaterial({
          color: 0xbba272,
          metalness: 0.9,
          roughness: 0.21,
        }),
      );
      const glass = material(
        new THREE.MeshPhysicalMaterial({
          color: 0xc8dac9,
          roughness: 0.12,
          metalness: 0.05,
          transparent: true,
          opacity: 0.18,
          side: THREE.DoubleSide,
          depthWrite: false,
          clearcoat: 1,
          clearcoatRoughness: 0.12,
        }),
      );
      const glassEdge = material(
        new THREE.MeshPhysicalMaterial({
          color: 0xe2e8d6,
          roughness: 0.16,
          metalness: 0.2,
          transparent: true,
          opacity: 0.5,
          depthWrite: false,
          clearcoat: 1,
        }),
      );

      const sculpture = new THREE.Group();
      const restingX = 0;
      const restingY = -0.28;
      sculpture.rotation.set(restingX, restingY, 0);
      scene.add(sculpture);

      function turned(profile: number[][], surface: Three.Material, segments = 96) {
        return new THREE.Mesh(
          geometry(new THREE.LatheGeometry(profile.map(([radius, height]) => new THREE.Vector2(radius, height)), segments)),
          surface,
        );
      }

      function ring(radius: number, tube: number, height: number, surface: Three.Material, parent: Three.Group) {
        const mesh = new THREE.Mesh(geometry(new THREE.TorusGeometry(radius, tube, 8, 96)), surface);
        mesh.rotation.x = Math.PI / 2;
        mesh.position.y = height;
        parent.add(mesh);
      }

      // Concentric details belong to one continuous surface, avoiding intersecting rings.
      const plate = new THREE.Group();
      plate.position.set(-0.12, 0, 0.35);
      plate.add(turned([
        [0, 0.025], [0.7, 0.025], [0.76, 0.045], [0.92, 0.06],
        [1.13, 0.09], [1.47, 0.23], [1.78, 0.33], [1.84, 0.348],
        [1.858, 0.366], [1.86, 0.384], [1.847, 0.402], [1.823, 0.411],
        [1.8, 0.405], [1.783, 0.392], [1.755, 0.384], [1.713, 0.375],
        [1.69, 0.377], [1.672, 0.368], [1.657, 0.352], [1.61, 0.331],
        [1.47, 0.264], [1.31, 0.176], [1.23, 0.133], [1.18, 0.111],
        [1.15, 0.105], [1.13, 0.097], [1.11, 0.092], [1.07, 0.09],
        [0.78, 0.087], [0, 0.087],
      ], ceramic, 128));
      sculpture.add(plate);

      function flatware(shape: Three.Shape, depth = 0.025) {
        const mesh = new THREE.Mesh(geometry(new THREE.ExtrudeGeometry(shape, {
          depth, steps: 1, bevelEnabled: true, bevelSegments: 3,
          bevelSize: 0.014, bevelThickness: 0.012, curveSegments: 14,
        })), brass);
        mesh.rotation.x = -Math.PI / 2;
        return mesh;
      }

      const fork = new THREE.Group();
      fork.position.set(-2.25, 0.06, 0.43);
      function handle() {
        const mesh = turned([
          [0, -1.2], [0.039, -1.2], [0.064, -1.185], [0.07, -1.15],
          [0.065, -0.86], [0.054, -0.42], [0.044, 0.04], [0.045, 0.26], [0, 0.27],
        ], brass, 24);
        mesh.rotation.x = -Math.PI / 2;
        mesh.scale.z = 0.48;
        mesh.position.y = 0.019;
        return mesh;
      }
      fork.add(handle());
      const forkBody = new THREE.Shape();
      forkBody.moveTo(-0.041, 0.12);
      forkBody.lineTo(-0.046, 0.21);
      forkBody.bezierCurveTo(-0.053, 0.34, -0.18, 0.34, -0.18, 0.48);
      forkBody.lineTo(-0.18, 0.69);
      forkBody.lineTo(0.18, 0.69);
      forkBody.lineTo(0.18, 0.48);
      forkBody.bezierCurveTo(0.18, 0.34, 0.053, 0.34, 0.046, 0.21);
      forkBody.lineTo(0.041, 0.12);
      forkBody.closePath();
      fork.add(flatware(forkBody));
      for (const x of [-0.148, -0.05, 0.05, 0.148]) {
        const tine = new THREE.Shape();
        tine.moveTo(x - 0.024, 0.64);
        tine.lineTo(x - 0.018, 1.16);
        tine.quadraticCurveTo(x, 1.21, x + 0.018, 1.16);
        tine.lineTo(x + 0.024, 0.64);
        tine.closePath();
        fork.add(flatware(tine, 0.018));
      }
      sculpture.add(fork);

      const knifeShape = new THREE.Shape();
      knifeShape.moveTo(-0.04, 0.1);
      knifeShape.lineTo(-0.052, 0.98);
      knifeShape.quadraticCurveTo(-0.05, 1.2, 0.015, 1.23);
      knifeShape.bezierCurveTo(0.16, 1.17, 0.2, 0.81, 0.185, 0.41);
      knifeShape.quadraticCurveTo(0.18, 0.22, 0.058, 0.15);
      knifeShape.lineTo(0.04, 0.1);
      knifeShape.closePath();
      const knife = new THREE.Group();
      knife.add(flatware(knifeShape), handle());
      knife.position.set(2.12, 0.06, 0.44);
      sculpture.add(knife);

      const tumbler = new THREE.Group();
      tumbler.position.set(1.14, 0.015, -1.69);
      tumbler.add(turned([
        [0, 0.025], [0.35, 0.025], [0.4, 0.045], [0.412, 0.09],
        [0.449, 0.86], [0.448, 0.89], [0.432, 0.903], [0.415, 0.889],
        [0.413, 0.86], [0.376, 0.15], [0.35, 0.116], [0, 0.116],
      ], glass));
      ring(0.432, 0.015, 0.891, glassEdge, tumbler);
      ring(0.393, 0.014, 0.068, glassEdge, tumbler);
      ring(0.357, 0.008, 0.12, glassEdge, tumbler);
      const fluteGeometry = geometry(new THREE.CylinderGeometry(0.009, 0.009, 0.69, 6));
      for (let i = 0; i < 20; i += 1) {
        const angle = i * Math.PI / 10;
        const flute = new THREE.Mesh(fluteGeometry, glass);
        flute.position.set(Math.sin(angle) * 0.417, 0.48, Math.cos(angle) * 0.417);
        flute.rotation.z = -Math.sin(angle) * 0.045;
        flute.rotation.x = Math.cos(angle) * 0.045;
        tumbler.add(flute);
      }
      sculpture.add(tumbler);

      // Soft contact shadows blend into the CSS surface without a rectangular ground.
      const shadowCanvas = document.createElement("canvas");
      shadowCanvas.width = 256;
      shadowCanvas.height = 256;
      const shadowContext = shadowCanvas.getContext("2d");
      if (shadowContext) {
        const falloff = shadowContext.createRadialGradient(128, 128, 12, 128, 128, 125);
        falloff.addColorStop(0, "rgba(0, 12, 7, 0.48)");
        falloff.addColorStop(0.5, "rgba(0, 12, 7, 0.3)");
        falloff.addColorStop(0.78, "rgba(0, 12, 7, 0.11)");
        falloff.addColorStop(1, "rgba(0, 12, 7, 0)");
        shadowContext.fillStyle = falloff;
        shadowContext.fillRect(0, 0, 256, 256);
        const contactTexture = new THREE.CanvasTexture(shadowCanvas);
        contactTexture.colorSpace = THREE.SRGBColorSpace;
        textures.add(contactTexture);
        const shadowMaterial = material(new THREE.MeshBasicMaterial({
          map: contactTexture, transparent: true, depthWrite: false, toneMapped: false,
        }));
        const shadowGeometry = geometry(new THREE.PlaneGeometry(1, 1));
        for (const [x, z, width, depth] of [
          [-0.04, 0.48, 4.7, 4.55], [1.25, -1.56, 1.25, 1.28],
          [-2.22, 0.48, 0.35, 2.7], [2.16, 0.5, 0.38, 2.7],
        ]) {
          const shadow = new THREE.Mesh(shadowGeometry, shadowMaterial);
          shadow.rotation.x = -Math.PI / 2;
          shadow.position.set(x, -0.02, z);
          shadow.scale.set(width, depth, 1);
          sculpture.add(shadow);
        }
      }

      const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
      let reduceMotion = reducedMotion.matches;
      let targetX = restingX;
      let targetY = restingY;
      let visible = true;
      let failed = false;
      let firstFrame = true;
      let previousTime = 0;

      function draw(time: number) {
        frame = 0;
        if (cancelled || failed || !visible || document.hidden) return;
        const elapsed = previousTime ? Math.min(time - previousTime, 50) : 16;
        previousTime = time;
        const ease = reduceMotion ? 1 : 1 - Math.exp(-elapsed / 105);
        sculpture.rotation.x += (targetX - sculpture.rotation.x) * ease;
        sculpture.rotation.y += (targetY - sculpture.rotation.y) * ease;
        try {
          renderer.render(scene, camera);
          if (firstFrame) {
            firstFrame = false;
            setReady(true);
          }
        } catch {
          failed = true;
          renderer.domElement.style.display = "none";
          setReady(false);
          return;
        }
        const distance =
          Math.abs(targetX - sculpture.rotation.x) +
          Math.abs(targetY - sculpture.rotation.y);
        if (!reduceMotion && distance > 0.0001) requestDraw();
      }

      function requestDraw() {
        if (!cancelled && !failed && visible && !document.hidden && !frame) {
          frame = requestAnimationFrame(draw);
        }
      }

      function resize() {
        if (!host || cancelled) return;
        const { width, height } = host.getBoundingClientRect();
        if (!width || !height) return;
        const aspect = width / height;
        const viewHeight = Math.max(4.75, 5.65 / aspect);
        camera.left = (-viewHeight * aspect) / 2;
        camera.right = (viewHeight * aspect) / 2;
        camera.top = viewHeight / 2;
        camera.bottom = -viewHeight / 2;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height, false);
        requestDraw();
      }

      function pointerMove(event: PointerEvent) {
        if (reduceMotion || event.pointerType === "touch" || !host) return;
        const bounds = host.getBoundingClientRect();
        if (!bounds.width || !bounds.height) return;
        const x = Math.max(-1, Math.min(1, ((event.clientX - bounds.left) / bounds.width - 0.5) * 2));
        const y = Math.max(-1, Math.min(1, ((event.clientY - bounds.top) / bounds.height - 0.5) * 2));
        targetY = restingY + x * 0.075;
        targetX = restingX + y * 0.035;
        requestDraw();
      }

      function resetPosition() {
        targetX = restingX;
        targetY = restingY;
        requestDraw();
      }

      function motionChanged(event: MediaQueryListEvent) {
        reduceMotion = event.matches;
        if (reduceMotion) {
          sculpture.rotation.x = restingX;
          sculpture.rotation.y = restingY;
        }
        resetPosition();
      }

      function visibilityChanged() {
        if (document.hidden) {
          cancelAnimationFrame(frame);
          frame = 0;
        } else {
          previousTime = 0;
          requestDraw();
        }
      }

      function contextLost(event: Event) {
        event.preventDefault();
        failed = true;
        cancelAnimationFrame(frame);
        frame = 0;
        renderer.domElement.style.display = "none";
        setReady(false);
      }

      removeListeners = () => {
        host.removeEventListener("pointermove", pointerMove);
        host.removeEventListener("pointerleave", resetPosition);
        reducedMotion.removeEventListener("change", motionChanged);
        document.removeEventListener("visibilitychange", visibilityChanged);
        renderer.domElement.removeEventListener("webglcontextlost", contextLost);
      };
      host.addEventListener("pointermove", pointerMove, { passive: true });
      host.addEventListener("pointerleave", resetPosition, { passive: true });
      reducedMotion.addEventListener("change", motionChanged);
      document.addEventListener("visibilitychange", visibilityChanged);
      renderer.domElement.addEventListener("webglcontextlost", contextLost);

      observers.resize = new ResizeObserver(resize);
      observers.resize.observe(host);
      observers.intersection = new IntersectionObserver(
        ([entry]) => {
          visible = entry.isIntersecting;
          if (!visible) {
            cancelAnimationFrame(frame);
            frame = 0;
          } else {
            previousTime = 0;
            requestDraw();
          }
        },
        { threshold: 0.01 },
      );
      observers.intersection.observe(host);
      host.appendChild(renderer.domElement);
      resize();
    }

    void initialize().catch((error: unknown) => {
      if (process.env.NODE_ENV === "development") {
        console.warn("The Pass sculpture could not initialize; showing the static artwork.", error);
      }
      disposeScene?.();
      disposeScene = undefined;
      if (!cancelled) setReady(false);
    });

    return () => {
      cancelled = true;
      disposeScene?.();
    };
  }, []);

  return (
    <div
      ref={hostRef}
      className="pass-sculpture"
      aria-hidden="true"
      style={{ position: "relative", width: "100%", height: "100%", isolation: "isolate" }}
    >
      <svg
        viewBox="0 0 600 640"
        focusable="false"
        style={{ width: "100%", height: "100%", display: "block", visibility: ready ? "hidden" : "visible" }}
      >
        <defs>
          <linearGradient id={`${id}-ceramic`} x1="0" y1="0" x2="0.8" y2="1">
            <stop stopColor="#fffdf0" />
            <stop offset="0.42" stopColor="#eee8d7" />
            <stop offset="0.83" stopColor="#ddd6c4" />
            <stop offset="1" stopColor="#c8c3b0" />
          </linearGradient>
          <radialGradient id={`${id}-well`} cx="0.34" cy="0.28" r="0.8">
            <stop stopColor="#f3eddf" />
            <stop offset="0.8" stopColor="#e8e2d2" />
            <stop offset="1" stopColor="#dbd4c1" />
          </radialGradient>
          <linearGradient id={`${id}-brass`} x1="0" y1="0" x2="1" y2="0.1">
            <stop stopColor="#81724d" />
            <stop offset="0.3" stopColor="#c8b280" />
            <stop offset="0.54" stopColor="#e1cca0" />
            <stop offset="0.7" stopColor="#ad986b" />
            <stop offset="1" stopColor="#7e704e" />
          </linearGradient>
          <linearGradient id={`${id}-glass`} x1="0" y1="0" x2="1" y2="0">
            <stop stopColor="#dce7d6" stopOpacity="0.24" />
            <stop offset="0.19" stopColor="#f5f3dd" stopOpacity="0.4" />
            <stop offset="0.4" stopColor="#aec5ad" stopOpacity="0.06" />
            <stop offset="0.8" stopColor="#b9c9af" stopOpacity="0.12" />
            <stop offset="1" stopColor="#e4e8d1" stopOpacity="0.45" />
          </linearGradient>
          <radialGradient id={`${id}-shadow`}>
            <stop stopColor="#071e14" stopOpacity="0.6" />
            <stop offset="0.6" stopColor="#071e14" stopOpacity="0.3" />
            <stop offset="1" stopColor="#071e14" stopOpacity="0" />
          </radialGradient>
        </defs>
        <g transform="rotate(-14 300 325)">
          <ellipse cx="298" cy="376" rx="227" ry="180" fill={`url(#${id}-shadow)`} />
          <ellipse cx="291" cy="349" rx="190" ry="153" fill="#bbb9a5" />
          <ellipse cx="289" cy="339" rx="190" ry="153" fill={`url(#${id}-ceramic)`} />
          <ellipse cx="289" cy="338" rx="183" ry="147" fill="none" stroke="#fffbea" strokeWidth="1.8" opacity="0.72" />
          <ellipse cx="289" cy="338" rx="175" ry="140" fill="none" stroke="#c9c2ad" strokeWidth="0.8" />
          <ellipse cx="289" cy="338" rx="171" ry="137" fill="none" stroke="#fff9e7" strokeWidth="1" opacity="0.8" />
          <ellipse cx="289" cy="342" rx="120" ry="96" fill={`url(#${id}-well)`} stroke="#d7cfba" strokeWidth="1.5" />
          <ellipse cx="289" cy="343" rx="116" ry="92" fill="none" stroke="#f6f0df" strokeWidth="1.2" />

          <path d="M64 466C59 465 60 449 62 424L65 350C65 343 50 341 50 327V273Q50 268 54 270L57 309H60L62 268Q65 265 67 268L69 309H73L75 268Q78 265 80 268L82 309H86L88 270Q91 268 92 273V327C92 340 77 343 77 350L80 424C82 450 84 465 79 466Z" fill={`url(#${id}-brass)`} />
          <path d="M509 467C505 467 506 446 507 425L509 274Q510 265 516 269C530 282 531 305 531 328Q531 342 519 347L520 425C522 446 523 467 519 467Z" fill={`url(#${id}-brass)`} />

          <ellipse cx="422" cy="204" rx="63" ry="41" fill={`url(#${id}-shadow)`} />
          <path d="M376 131L382 208C383 228 455 228 456 208L462 131Z" fill={`url(#${id}-glass)`} stroke="#c3d0b7" strokeOpacity="0.22" strokeWidth="1.2" />
          <ellipse cx="419" cy="131" rx="43" ry="29" fill="#bdd1bc" fillOpacity="0.04" stroke="#e4e5ce" strokeOpacity="0.65" strokeWidth="2" />
          <ellipse cx="419" cy="132" rx="39" ry="25" fill="none" stroke="#d9e4cf" strokeOpacity="0.2" />
          <ellipse cx="419" cy="206" rx="36" ry="24" fill="#d2dec3" fillOpacity="0.08" stroke="#ced9bd" strokeOpacity="0.5" strokeWidth="1.5" />
          <path d="M384 145L389 207M393 154L397 218M405 159L407 226M419 161V229M433 159L431 225M446 152L442 218M455 143L449 207" fill="none" stroke="#e0e7ce" strokeOpacity="0.18" strokeWidth="1.4" />
          <path d="M389 150L393 199" fill="none" stroke="#fff9df" strokeOpacity="0.47" strokeWidth="2.5" strokeLinecap="round" />
        </g>
      </svg>
    </div>
  );
}
