import { t as gsap } from "/assets/gsap-BEsEDAKg.js";
import { t as ScrollTrigger } from "/assets/ScrollTrigger-CcUORopz.js";

gsap.registerPlugin(ScrollTrigger);

(() => {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const heroState = { timer: null, started: false };
  let revealStarted = false;

  const animateHeroTitle = () => {
    if (heroState.started) return false;

    const title = document.querySelector("#hero-title");
    if (!title) {
      document.documentElement.classList.add("hero-motion-ready");
      return false;
    }

    const titleParts = [...title.children].filter(
      (element) => element.tagName === "SPAN" || element.tagName === "STRONG",
    );

    if (!titleParts.length) {
      document.documentElement.classList.add("hero-motion-ready");
      return false;
    }

    heroState.started = true;
    const isDesktop = window.matchMedia("(min-width: 1180px)").matches;
    const headerItems = isDesktop
      ? [
          document.querySelector(".site-header .brand"),
          document.querySelector(".site-header .desktop-nav"),
          document.querySelector(".site-header .buy-button"),
        ].filter(Boolean)
      : [document.querySelector(".site-header .brand")].filter(Boolean);

    gsap.killTweensOf(titleParts);
    gsap.set(titleParts, {
      y: 18,
      scale: 0.985,
      autoAlpha: 0,
      transformOrigin: "50% 100%",
    });

    document.documentElement.classList.add("hero-motion-ready");

    gsap.to(titleParts, {
      y: 0,
      scale: 1,
      autoAlpha: 1,
      duration: 0.62,
      stagger: 0.08,
      ease: "power2.out",
      clearProps: "transform,opacity,visibility",
    });

    if (headerItems.length) {
      gsap.from(headerItems, {
        y: -10,
        autoAlpha: 0,
        duration: isDesktop ? 0.4 : 0.46,
        stagger: isDesktop ? 0.035 : 0.05,
        delay: 0,
        ease: "power3.out",
        clearProps: "transform,opacity,visibility",
      });
    }

    return true;
  };

  const revealGroup = ({ trigger, targets, y = 38, scale = 0.97, stagger = 0.1 }) => {
    const triggerElement = document.querySelector(trigger);
    const elements = [...document.querySelectorAll(targets)].filter(
      (element) => !element.dataset.motionRevealed,
    );

    if (!triggerElement || !elements.length) return;

    elements.forEach((element) => {
      element.dataset.motionRevealed = "true";
    });

    gsap.from(elements, {
      scrollTrigger: {
        trigger: triggerElement,
        start: "top 84%",
        once: true,
      },
      y,
      scale,
      autoAlpha: 0,
      duration: 0.85,
      stagger,
      ease: "power3.out",
      clearProps: "transform,opacity,visibility",
    });
  };

  const revealTextCards = () => {
    const cards = [
      ...document.querySelectorAll(
        ".student-proof-card, .method-proof-card, .method-timeline-steps article > div, .dreams-results > div, .conversion-trigger",
      ),
    ];
    const isMobile = window.matchMedia("(max-width: 640px)").matches;

    cards.forEach((card, index) => {
      if (card.dataset.textCardMotion) return;

      card.dataset.textCardMotion = "true";
      card.classList.add("motion-text-card");

      const direction = index % 2 === 0 ? -1 : 1;
      const textElements = card.matches(".student-proof-card")
        ? [...card.querySelectorAll(".student-proof-caption > *")]
        : [
            ...card.querySelectorAll(
              ":scope > small, :scope > strong, :scope > span, :scope > h3, :scope > p",
            ),
          ];

      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: card,
          start: "top 89%",
          once: true,
        },
      });

      timeline.fromTo(
        card,
        {
          x: direction * (isMobile ? 30 : 74),
          y: isMobile ? 24 : 34,
          rotate: direction * (isMobile ? 1.6 : 3),
          scale: isMobile ? 0.94 : 0.9,
          autoAlpha: 0,
          clipPath: "inset(0% 0% 24% 0% round 28px)",
        },
        {
          x: 0,
          y: 0,
          rotate: 0,
          scale: 1,
          autoAlpha: 1,
          clipPath: "inset(0% 0% 0% 0% round 28px)",
          duration: isMobile ? 0.88 : 1.02,
          ease: "expo.out",
          clearProps: "transform,opacity,visibility,clipPath",
        },
      );

      if (textElements.length) {
        timeline.from(
          textElements,
          {
            y: 17,
            autoAlpha: 0,
            duration: 0.5,
            stagger: 0.055,
            ease: "power2.out",
            clearProps: "transform,opacity,visibility",
          },
          "-=0.55",
        );
      }
    });
  };

  const setupScrollReveals = () => {
    if (revealStarted) return false;

    const requiredSections = ["#depoimentos", "#resultados", "#jornada", "#inscricao"];
    if (!requiredSections.every((selector) => document.querySelector(selector))) {
      return false;
    }

    revealStarted = true;

    [
      {
        trigger: "#depoimentos",
        targets: ".student-proof-copy, .student-proof-number",
        y: 34,
        stagger: 0.16,
      },
      {
        trigger: ".student-proof-cta",
        targets: ".student-proof-cta",
        y: 26,
        scale: 0.96,
      },
      {
        trigger: "#resultados",
        targets: ".dreams-heading > *, .dreams-coverflow",
        y: 44,
        stagger: 0.14,
      },
      {
        trigger: ".dreams-results",
        targets: ".dreams-cta-wrap",
        y: 36,
        scale: 0.95,
        stagger: 0.12,
      },
      {
        trigger: "#jornada",
        targets: ".method-partners-intro > *",
        y: 46,
        scale: 0.96,
        stagger: 0.13,
      },
      {
        trigger: ".method-timeline-steps",
        targets: ".method-timeline-cta",
        y: 28,
      },
      {
        trigger: "#inscricao",
        targets: ".conversion-copy > *, .conversion-photo, .conversion-action",
        y: 48,
        scale: 0.96,
        stagger: 0.11,
      },
      {
        trigger: ".site-footer",
        targets: ".site-footer-brand, .site-footer-nav, .site-footer-cta, .site-footer-bottom",
        y: 30,
        stagger: 0.1,
      },
    ].forEach(revealGroup);

    revealTextCards();

    const decorativeIcons = [
      ...document.querySelectorAll(
        ".student-proof-slot img, .dreams-brand-icon, .method-brand-icon, .conversion-icon",
      ),
    ];

    decorativeIcons.forEach((icon) => {
      gsap.from(icon, {
        scrollTrigger: {
          trigger: icon.closest("section") || icon,
          start: "top 82%",
          once: true,
        },
        scale: 0.55,
        rotate: -16,
        autoAlpha: 0,
        duration: 0.9,
        ease: "back.out(1.7)",
        clearProps: "transform,opacity,visibility",
      });
    });

    ScrollTrigger.refresh();
    return true;
  };

  const initialize = () => {
    const scheduleHeroAnimation = () => {
      window.clearTimeout(heroState.timer);
      heroState.timer = window.setTimeout(animateHeroTitle, 8);
    };

    const observer = new MutationObserver(() => {
      if (setupScrollReveals()) observer.disconnect();
    });

    observer.observe(document.documentElement, { childList: true, subtree: true });

    const fontReady = document.fonts?.ready || Promise.resolve();
    const fastStart = new Promise((resolve) => window.setTimeout(resolve, 40));
    Promise.race([fontReady, fastStart]).then(scheduleHeroAnimation);

    let attempts = 0;
    const retry = window.setInterval(() => {
      attempts += 1;
      if (setupScrollReveals() || attempts >= 20) {
        window.clearInterval(retry);
        if (revealStarted) observer.disconnect();
      }
    }, 180);

    window.setTimeout(() => {
      if (!heroState.started) animateHeroTitle();
      document.documentElement.classList.add("hero-motion-ready");
    }, 500);
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initialize, { once: true });
  } else {
    initialize();
  }
})();
