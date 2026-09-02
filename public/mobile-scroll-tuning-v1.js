// Reutiliza a instância de GSAP das animações; sem segundo download ou polling.
(() => {
  if (!window.matchMedia("(pointer: coarse), (max-width: 800px)").matches) return;
  document.documentElement.classList.add("native-mobile-scroll");
  const releaseTouchScroll = () => {
    const { gsap, ScrollTrigger } = window;
    if (!gsap || !ScrollTrigger) return;
    ScrollTrigger.normalizeScroll(false);
    gsap.core.globals()?.ScrollSmoother?.get?.()?.kill();
    window.requestAnimationFrame(() => ScrollTrigger.refresh());
  };
  window.addEventListener("sunlix:motion-ready", releaseTouchScroll, { once: true });
  window.addEventListener("pageshow", releaseTouchScroll);
  releaseTouchScroll();
})();
