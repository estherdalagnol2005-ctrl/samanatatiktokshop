import { t as gsap } from "/assets/gsap-BEsEDAKg.js";
import { t as ScrollTrigger } from "/assets/ScrollTrigger-CcUORopz.js";

gsap.registerPlugin(ScrollTrigger);

(() => {
  const mobileQuery = window.matchMedia("(pointer: coarse), (max-width: 800px)");
  if (!mobileQuery.matches) return;

  const root = document.documentElement;
  root.classList.add("native-mobile-scroll");

  const ensureMeta = (name, content) => {
    let meta = document.head.querySelector(`meta[name="${name}"]`);
    if (!meta) {
      meta = document.createElement("meta");
      meta.setAttribute("name", name);
      document.head.append(meta);
    }
    meta.setAttribute("content", content);
  };

  const ensureBrowserChromeColor = () => {
    ensureMeta("theme-color", "#fa2095");
    ensureMeta("apple-mobile-web-app-capable", "yes");
    ensureMeta("apple-mobile-web-app-status-bar-style", "black-translucent");
  };

  const headObserver = new MutationObserver(ensureBrowserChromeColor);
  headObserver.observe(document.head, { childList: true });
  window.setTimeout(() => headObserver.disconnect(), 5000);

  const releaseTouchScroll = () => {
    root.classList.add("native-mobile-scroll");
    ensureBrowserChromeColor();
    ScrollTrigger.normalizeScroll(false);

    const globals = gsap.core.globals?.() || {};
    const ScrollSmoother = globals.ScrollSmoother || gsap.plugins?.ScrollSmoother;
    const smoother = ScrollSmoother?.get?.();

    if (smoother) smoother.kill();

    window.requestAnimationFrame(() => ScrollTrigger.refresh());
    return Boolean(smoother);
  };

  releaseTouchScroll();

  let attempts = 0;
  const retry = window.setInterval(() => {
    attempts += 1;
    if (releaseTouchScroll() || attempts >= 14) window.clearInterval(retry);
  }, 140);

  window.addEventListener("pageshow", releaseTouchScroll);
})();
