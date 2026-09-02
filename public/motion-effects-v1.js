(() => {
  const GSAP_VERSION = "3.15.0";
  const GSAP_CDN = `https://cdn.jsdelivr.net/npm/gsap@${GSAP_VERSION}/dist`;

  const loadScript = (src, globalName) =>
    new Promise((resolve, reject) => {
      if (globalName && window[globalName]) {
        resolve(window[globalName]);
        return;
      }

      const existing = document.querySelector(`script[src="${src}"]`);
      if (existing) {
        existing.addEventListener("load", () => resolve(window[globalName]), { once: true });
        existing.addEventListener("error", reject, { once: true });
        return;
      }

      const script = document.createElement("script");
      script.src = src;
      script.async = false;
      script.crossOrigin = "anonymous";
      script.addEventListener("load", () => resolve(window[globalName]), { once: true });
      script.addEventListener("error", reject, { once: true });
      document.head.appendChild(script);
    });

  const bootMotion = async () => {
    await loadScript(`${GSAP_CDN}/gsap.min.js`, "gsap");
    await Promise.all([
      loadScript(`${GSAP_CDN}/ScrollTrigger.min.js`, "ScrollTrigger"),
      loadScript(`${GSAP_CDN}/SplitText.min.js`, "SplitText"),
    ]);

    const { gsap, ScrollTrigger, SplitText } = window;
    if (!gsap || !ScrollTrigger || !SplitText) {
      document.documentElement.classList.add("hero-motion-ready");
      return;
    }

    gsap.registerPlugin(ScrollTrigger, SplitText);
    window.dispatchEvent(new Event("sunlix:motion-ready"));

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const heroState = { timer: null, started: false, splits: [] };
    let refreshTimer = 0;

    const animateHeroTitle = () => {
      if (heroState.started || reducedMotion) {
        document.documentElement.classList.add("hero-motion-ready");
        return false;
      }

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

      heroState.splits = titleParts.map((part) =>
        SplitText.create(part, {
          type: "chars",
          smartWrap: true,
          tag: "span",
          charsClass: "hero-split-char",
          aria: "auto",
        }),
      );

      const chars = heroState.splits.flatMap((split) => split.chars);
      if (!chars.length) {
        document.documentElement.classList.add("hero-motion-ready");
        return false;
      }

      gsap.killTweensOf(chars);
      document.documentElement.classList.add("hero-motion-ready");

      gsap.from(chars, {
        yPercent: 62,
        autoAlpha: 0,
        duration: 0.56,
        stagger: {
          each: 0.016,
          from: "start",
        },
        ease: "power3.out",
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

    const foldRevealConfigs = [
      {
        trigger: "#depoimentos",
        targets: ".student-proof-copy, .student-proof-video-stage",
      },
      {
        trigger: "#resultados",
        targets:
          ".dreams-heading > *, .dreams-coverflow, .dreams-body > p, .dreams-results > div",
      },
      {
        trigger: "#comunidade",
        targets:
          ".community-uniform-copy > *, .community-uniform-stage, .community-uniform-nav",
      },
      {
        trigger: "#jornada",
        targets:
          ".method-sales-intro > *, .method-sales-timeline, .method-sales-closing > p",
      },
      {
        trigger: "#inscricao",
        targets:
          ".conversion-copy > *, .conversion-photo, .conversion-trigger, .conversion-action > small",
      },
      {
        trigger: ".site-footer",
        targets: ".site-footer-brand, .site-footer-nav, .site-footer-bottom",
      },
    ];

    const scheduleRefresh = () => {
      window.clearTimeout(refreshTimer);
      refreshTimer = window.setTimeout(() => ScrollTrigger.refresh(), 40);
    };

    const registerCurrentFoldReveals = () => {
      if (reducedMotion) return false;
      let registered = false;

      foldRevealConfigs.forEach(({ trigger, targets }) => {
        const triggerElement = document.querySelector(trigger);
        if (!triggerElement) return;

        const elements = [...triggerElement.querySelectorAll(targets)].filter(
          (element) => element.dataset.sunlixSubtleReveal !== "true",
        );
        if (!elements.length) return;

        elements.forEach((element) => {
          element.dataset.sunlixSubtleReveal = "true";
        });

        gsap.from(elements, {
          scrollTrigger: {
            trigger: triggerElement,
            start: "top 84%",
            once: true,
          },
          y: 44,
          scale: 0.97,
          autoAlpha: 0,
          duration: 0.85,
          stagger: 0.14,
          ease: "power3.out",
          clearProps: "transform,opacity,visibility",
        });

        registered = true;
      });

      if (registered) scheduleRefresh();
      return registered;
    };

    const initialize = () => {
      if (reducedMotion) {
        document.documentElement.classList.add("hero-motion-ready");
        return;
      }

      const scheduleHeroAnimation = () => {
        window.clearTimeout(heroState.timer);
        heroState.timer = window.setTimeout(animateHeroTitle, 8);
      };

      const fontReady = document.fonts?.ready || Promise.resolve();
      const fastStart = new Promise((resolve) => window.setTimeout(resolve, 60));
      Promise.race([fontReady, fastStart]).then(scheduleHeroAnimation);

      registerCurrentFoldReveals();

      const observer = new MutationObserver(() => registerCurrentFoldReveals());
      observer.observe(document.body, { childList: true, subtree: true });

      window.addEventListener("pageshow", () => {
        registerCurrentFoldReveals();
        scheduleRefresh();
      });

      window.addEventListener("resize", scheduleRefresh, { passive: true });

      window.setTimeout(() => {
        if (!heroState.started) animateHeroTitle();
        document.documentElement.classList.add("hero-motion-ready");
        registerCurrentFoldReveals();
      }, 700);
    };

    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", initialize, { once: true });
    } else {
      initialize();
    }
  };

  const fallbackTimer = window.setTimeout(() => {
    document.documentElement.classList.add("hero-motion-ready");
  }, 1400);

  bootMotion()
    .catch(() => {
      document.documentElement.classList.add("hero-motion-ready");
    })
    .finally(() => window.clearTimeout(fallbackTimer));
})();
