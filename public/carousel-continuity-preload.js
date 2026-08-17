import { t as gsap } from "./assets/gsap-BEsEDAKg.js";

const nativeTickerAdd = gsap.ticker.add.bind(gsap.ticker);

gsap.ticker.add = (callback, once, prioritize) => {
  const source = Function.prototype.toString.call(callback);

  if (
    source.includes("is-site-scrolling") &&
    source.includes("a-e<40")
  ) {
    return callback;
  }

  return nativeTickerAdd(callback, once, prioritize);
};

const initializeContinuousOrbit = () => {
  const orbit = document.querySelector(".dreams-orbit");
  const cards = [...document.querySelectorAll(".dreams-orbit-card")];

  if (!orbit || cards.length === 0) {
    return false;
  }

  const degreesPerCard = 360 / cards.length;
  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;
  let angle = 90;
  let isVisible = true;
  let wasInterrupted = false;
  let lastFrame = performance.now();

  const deriveAngleFromFirstCard = () => {
    const left = Number.parseFloat(cards[0].style.left);
    const top = Number.parseFloat(cards[0].style.top);

    if (!Number.isFinite(left) || !Number.isFinite(top)) {
      return angle;
    }

    return (
      Math.atan2((top - 54) / 33, (left - 50) / 43) *
      (180 / Math.PI)
    );
  };

  const render = () => {
    cards.forEach((card, index) => {
      const radians = ((angle + index * degreesPerCard) * Math.PI) / 180;
      const cosine = Math.cos(radians);
      const sine = Math.sin(radians);
      const depth = (sine + 1) / 2;
      const scale = 0.52 + depth * 0.52;
      const saturation = 0.72 + depth * 0.28;
      const brightness = 0.8 + depth * 0.2;
      const blur = (1 - depth) * 0.35;

      card.style.left = `${50 + cosine * 43}%`;
      card.style.top = `${54 + sine * 33}%`;
      card.style.opacity = `${0.34 + depth * 0.66}`;
      card.style.zIndex = `${Math.round(20 + depth * 80)}`;
      card.style.filter = `saturate(${saturation}) brightness(${brightness}) blur(${blur}px)`;
      card.style.transform = `translate3d(-50%, -50%, 0) scale(${scale}) rotateY(${cosine * -13}deg)`;
    });

    const activeIndex =
      ((Math.round((90 - angle) / degreesPerCard) % cards.length) +
        cards.length) %
      cards.length;
    const activeLabel = cards[activeIndex]?.querySelector("span")?.textContent;
    const guideLabel = orbit.querySelector(".dreams-orbit-guide strong");

    if (guideLabel && activeLabel) {
      guideLabel.textContent = activeLabel;
    }
  };

  const observer = new IntersectionObserver(
    ([entry]) => {
      isVisible = entry?.isIntersecting ?? true;
      lastFrame = performance.now();
    },
    { rootMargin: "0px" },
  );
  observer.observe(orbit);

  const tick = (now) => {
    window.requestAnimationFrame(tick);

    if (reducedMotion || !isVisible || now - lastFrame < 40) {
      return;
    }

    const isInterrupted =
      orbit.classList.contains("is-dragging") ||
      Boolean(document.querySelector(".dreams-lightbox"));

    if (isInterrupted) {
      wasInterrupted = true;
      lastFrame = now;
      return;
    }

    if (wasInterrupted) {
      angle = deriveAngleFromFirstCard();
      wasInterrupted = false;
    }

    const elapsed = Math.min(34, now - lastFrame);
    lastFrame = now;
    angle += 0.018 * elapsed;
    render();
  };

  angle = deriveAngleFromFirstCard();
  window.requestAnimationFrame(tick);
  return true;
};

if (!initializeContinuousOrbit()) {
  const observer = new MutationObserver(() => {
    if (initializeContinuousOrbit()) {
      observer.disconnect();
    }
  });

  observer.observe(document.documentElement, { childList: true, subtree: true });
}
