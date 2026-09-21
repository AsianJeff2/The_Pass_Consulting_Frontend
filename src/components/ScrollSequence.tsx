"use client";

import { useEffect } from "react";

/** Enhances the server-rendered document without taking ownership of scrolling. */
export default function ScrollSequence() {
  useEffect(() => {
    const root = document.querySelector<HTMLElement>(".home-page");
    if (!root) return;
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const compact = window.matchMedia("(max-width: 800px), (max-height: 600px)");
    const hero = root.querySelector<HTMLElement>(".hero");
    const art = root.querySelector<HTMLElement>(".hero-art");
    const steps = Array.from(root.querySelectorAll<HTMLElement>("[data-step]"));
    const current = root.querySelector<HTMLElement>(".process-current");
    const progress = root.querySelector<HTMLElement>(".process-progress i");
    const animations = new Set<Animation>();
    const seen = new WeakSet<Element>();
    let frame = 0;
    let disposed = false;

    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting || seen.has(entry.target)) continue;
        seen.add(entry.target);
        observer.unobserve(entry.target);
        if (preference.matches) continue;
        const target = entry.target as HTMLElement;
        const lines = target.querySelectorAll<HTMLElement>(".reveal-line > span");
        const pieces = lines.length ? Array.from(lines) : [target];
        pieces.forEach((piece, i) => {
          const rule = piece.hasAttribute("data-rule");
          const animation = piece.animate(rule
            ? [{ transform: "scaleX(0)" }, { transform: "scaleX(1)" }]
            : [{ transform: `translateY(${lines.length ? "105%" : "18px"})`, opacity: 0 }, { transform: "translateY(0)", opacity: 1 }],
          { duration: rule ? 800 : 650, delay: i * 100, easing: "cubic-bezier(.22,1,.36,1)", fill: "backwards" });
          animations.add(animation);
          animation.onfinish = () => animations.delete(animation);
        });
      }
    }, { threshold: 0.12 });

    root.querySelectorAll("[data-reveal], [data-rule]").forEach((element) => observer.observe(element));

    function draw() {
      frame = 0;
      if (disposed) return;
      const height = window.innerHeight;
      // Read geometry before writing styles. Nothing loops while the page is idle.
      const heroBox = hero?.getBoundingClientRect();
      const positions = steps.map((step) => step.getBoundingClientRect().top);
      let active = 0;
      positions.forEach((top, i) => { if (top < height * 0.55) active = i; });
      if (current) current.textContent = `0${active + 1}`;
      if (progress && steps.length) progress.style.transform = `scaleX(${(active + 1) / steps.length})`;
      steps.forEach((step, i) => step.toggleAttribute("data-active", i === active));
      if (art) {
        const amount = !preference.matches && !compact.matches && heroBox
          ? Math.max(0, Math.min(-heroBox.top * 0.14, height * 0.13)) : 0;
        art.style.transform = amount ? `translate3d(0,${amount}px,0)` : "none";
      }
    }

    function schedule() {
      if (!frame && !document.hidden) frame = requestAnimationFrame(draw);
    }
    function changePreference() {
      if (preference.matches) {
        animations.forEach((animation) => animation.cancel());
        animations.clear();
      }
      schedule();
    }
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    document.addEventListener("visibilitychange", schedule);
    preference.addEventListener("change", changePreference);
    compact.addEventListener("change", schedule);
    schedule();
    return () => {
      disposed = true;
      observer.disconnect();
      cancelAnimationFrame(frame);
      animations.forEach((animation) => animation.cancel());
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      document.removeEventListener("visibilitychange", schedule);
      preference.removeEventListener("change", changePreference);
      compact.removeEventListener("change", schedule);
      art?.style.removeProperty("transform");
    };
  }, []);
  return null;
}
