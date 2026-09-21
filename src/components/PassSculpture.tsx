"use client";

import { useEffect, useId, useRef, useState } from "react";
import type * as Three from "three";

/** A decorative, demand-rendered sculpture. No information depends on WebGL. */
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
      renderer.toneMappingExposure = 1.15;
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
      camera.position.set(5.4, 3.3, 9.3);
      camera.lookAt(0, -0.12, 0.2);

      // A local studio reflection map gives the metal and glass broad highlights.
      const studio = document.createElement("canvas");
      studio.width = 512;
      studio.height = 256;
      const context = studio.getContext("2d");
      if (context) {
        const wash = context.createLinearGradient(0, 0, 0, 256);
        wash.addColorStop(0, "#e7e9e3");
        wash.addColorStop(0.45, "#a9b2a3");
        wash.addColorStop(0.7, "#7a8477");
        wash.addColorStop(1, "#dfd7c4");
        context.fillStyle = wash;
        context.fillRect(0, 0, 512, 256);
        for (const [x, y, width, height] of [
          [65, 20, 74, 135],
          [285, 30, 115, 85],
          [460, 70, 35, 125],
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
          scene.environmentIntensity = 0.9;
        } finally {
          pmrem.dispose();
        }
      }

      scene.add(new THREE.HemisphereLight(0xfffbef, 0x435749, 2.3));
      const key = new THREE.DirectionalLight(0xfff4dd, 3.2);
      key.position.set(-4, 7, 5);
      scene.add(key);
      const fill = new THREE.DirectionalLight(0xe0edeb, 2.2);
      fill.position.set(4, 2, -3);
      scene.add(fill);

      function material<T extends Three.Material>(value: T): T {
        materials.add(value);
        return value;
      }

      function geometry<T extends Three.BufferGeometry>(value: T): T {
        geometries.add(value);
        return value;
      }

      const forest = material(
        new THREE.MeshPhysicalMaterial({
          color: 0x214536,
          roughness: 0.35,
          metalness: 0.22,
          clearcoat: 0.35,
          clearcoatRoughness: 0.3,
        }),
      );
      const brass = material(
        new THREE.MeshStandardMaterial({
          color: 0xb9a477,
          metalness: 0.87,
          roughness: 0.28,
        }),
      );
      const glass = material(
        new THREE.MeshPhysicalMaterial({
          color: 0xd6e2d3,
          roughness: 0.13,
          metalness: 0,
          transmission: 0.87,
          thickness: 0.65,
          ior: 1.46,
          attenuationColor: new THREE.Color(0xb5c6a7),
          attenuationDistance: 2.6,
          clearcoat: 1,
          clearcoatRoughness: 0.1,
        }),
      );
      const stone = material(
        new THREE.MeshStandardMaterial({
          color: 0xe2dece,
          roughness: 0.75,
          metalness: 0.03,
        }),
      );

      const sculpture = new THREE.Group();
      const restingX = -0.015;
      const restingY = -0.18;
      sculpture.rotation.set(restingX, restingY, 0.025);
      scene.add(sculpture);

      function arch(
        width: number,
        height: number,
        band: number,
        depth: number,
        surface: Three.Material,
        bevel = 0.045,
      ) {
        const outer = width / 2;
        const inner = outer - band;
        const bottom = -height / 2;
        const shoulder = height / 2 - outer;
        const shape = new THREE.Shape();
        shape.moveTo(-outer, bottom);
        shape.lineTo(-outer, shoulder);
        shape.absarc(0, shoulder, outer, Math.PI, 0, true);
        shape.lineTo(outer, bottom);
        shape.lineTo(inner, bottom);
        shape.lineTo(inner, shoulder);
        shape.absarc(0, shoulder, inner, 0, Math.PI, false);
        shape.lineTo(-inner, bottom);
        shape.closePath();
        const solid = geometry(
          new THREE.ExtrudeGeometry(shape, {
            depth,
            bevelEnabled: bevel > 0,
            bevelSegments: 3,
            steps: 1,
            bevelSize: bevel,
            bevelThickness: bevel,
            curveSegments: 56,
          }),
        );
        solid.translate(0, 0, -depth / 2);
        return new THREE.Mesh(solid, surface);
      }

      const outerArch = arch(3.1, 3.6, 0.47, 0.66, forest);
      outerArch.position.z = -0.35;
      sculpture.add(outerArch);

      const inlay = arch(3.05, 3.57, 0.025, 0.018, brass, 0.005);
      inlay.position.set(0, -0.015, 0.026);
      sculpture.add(inlay);

      const glassArch = arch(2.13, 3.05, 0.27, 0.37, glass, 0.035);
      glassArch.position.set(0.02, -0.275, 0.47);
      glassArch.rotation.y = 0.13;
      sculpture.add(glassArch);

      const innerArch = arch(1.39, 2.42, 0.14, 0.24, brass, 0.025);
      innerArch.position.set(-0.055, -0.59, 1.04);
      innerArch.rotation.y = -0.14;
      sculpture.add(innerArch);

      const plinth = new THREE.Mesh(
        geometry(new THREE.CylinderGeometry(2.08, 2.12, 0.12, 96)),
        stone,
      );
      plinth.scale.z = 0.82;
      plinth.position.set(0, -1.88, 0.2);
      sculpture.add(plinth);

      const plinthEdge = new THREE.Mesh(
        geometry(new THREE.CylinderGeometry(2.105, 2.105, 0.018, 96)),
        brass,
      );
      plinthEdge.scale.z = 0.82;
      plinthEdge.position.set(0, -1.954, 0.2);
      sculpture.add(plinthEdge);

      // A finite contact shadow grounds the plinth without extra shadow passes.
      const shadowCanvas = document.createElement("canvas");
      shadowCanvas.width = 256;
      shadowCanvas.height = 256;
      const shadowContext = shadowCanvas.getContext("2d");
      if (shadowContext) {
        const falloff = shadowContext.createRadialGradient(128, 128, 20, 128, 128, 126);
        falloff.addColorStop(0, "rgba(34, 49, 38, 0.26)");
        falloff.addColorStop(0.4, "rgba(34, 49, 38, 0.2)");
        falloff.addColorStop(0.7, "rgba(34, 49, 38, 0.08)");
        falloff.addColorStop(1, "rgba(34, 49, 38, 0)");
        shadowContext.fillStyle = falloff;
        shadowContext.fillRect(0, 0, 256, 256);
        const contactTexture = new THREE.CanvasTexture(shadowCanvas);
        contactTexture.colorSpace = THREE.SRGBColorSpace;
        textures.add(contactTexture);
        const contactShadow = new THREE.Mesh(
          geometry(new THREE.PlaneGeometry(6.2, 4.8)),
          material(new THREE.MeshBasicMaterial({
            map: contactTexture,
            transparent: true,
            depthWrite: false,
            toneMapped: false,
          })),
        );
        contactShadow.rotation.x = -Math.PI / 2;
        contactShadow.position.set(0, -2.04, 0.25);
        scene.add(contactShadow);
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
        const viewHeight = Math.max(5.35, 4.8 / aspect);
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
        targetY = restingY + x * 0.17;
        targetX = restingX + y * 0.065;
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
        viewBox="0 0 600 560"
        focusable="false"
        style={{ width: "100%", height: "100%", display: "block", visibility: ready ? "hidden" : "visible" }}
      >
        <defs>
          <linearGradient id={`${id}-forest`} x1="0" y1="0" x2="1" y2="0.8">
            <stop stopColor="#527260" />
            <stop offset="0.42" stopColor="#254b3b" />
            <stop offset="1" stopColor="#112f25" />
          </linearGradient>
          <linearGradient id={`${id}-brass`} x1="0" y1="0" x2="1" y2="0.4">
            <stop stopColor="#d9c69d" />
            <stop offset="0.5" stopColor="#a99062" />
            <stop offset="0.73" stopColor="#e3d3ad" />
            <stop offset="1" stopColor="#aa956b" />
          </linearGradient>
          <linearGradient id={`${id}-glass`} x1="0" y1="0" x2="1" y2="0.6">
            <stop stopColor="#e2e9de" stopOpacity="0.9" />
            <stop offset="0.5" stopColor="#acbca7" stopOpacity="0.38" />
            <stop offset="1" stopColor="#c6d1bd" stopOpacity="0.76" />
          </linearGradient>
          <radialGradient id={`${id}-shadow`}>
            <stop stopColor="#23382c" stopOpacity="0.16" />
            <stop offset="1" stopColor="#23382c" stopOpacity="0" />
          </radialGradient>
        </defs>
        <ellipse cx="308" cy="466" rx="226" ry="45" fill={`url(#${id}-shadow)`} />
        <path d="M105 423 A196 49 0 0 0 497 423 L497 433 A196 49 0 0 1 105 433Z" fill="#c5c0ac" />
        <ellipse cx="301" cy="423" rx="196" ry="49" fill="#e4e0d3" />
        <path d="M177 415V228 A136 136 0 0 1 449 228V415L410 425V228 A97 97 0 0 0 216 228V425Z" fill="#14372b" />
        <path d="M150 405V215 A136 136 0 0 1 422 215V405H379V215 A93 93 0 0 0 193 215V405Z" fill={`url(#${id}-forest)`} />
        <path d="M156 401V215 A130 130 0 0 1 416 215V401" fill="none" stroke={`url(#${id}-brass)`} strokeWidth="2" />
        <path d="M207 423V262 A104 104 0 0 1 415 262V423H387V262 A76 76 0 0 0 235 262V423Z" fill={`url(#${id}-glass)`} stroke="#f6f7eb" strokeOpacity="0.62" />
        <path d="M261 435V304 A70 70 0 0 1 401 304V435H385V304 A54 54 0 0 0 277 304V435Z" fill={`url(#${id}-brass)`} />
      </svg>
    </div>
  );
}
