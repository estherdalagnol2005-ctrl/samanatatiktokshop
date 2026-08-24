(() => {
  const checkoutUrl =
    "https://pay.kiwify.com.br/3U3ri1Z?utm_source=ig&utm_medium=social&utm_content=link_in_bio&fbclid=PAcGRvZgJleHRuA2FlbQIxMQBzcnRjBmFwcF9pZA85MzY2MTk3NDMzOTI0NTkAAaevJUkw0_uoPexeLpBD0uwAqbcykPEPqyIsY92jjdMazyQ3sDDuOGK9PuqByQ_aem_2snf6J8TOi97NbaW3-4PNw&utm_id=97760_v0_s00_e0_tv3O";

  const orbitItems = [
    {
      src: "/assets/dreams-2026/creator-summit.webp",
      alt: "Samanta reunida com outras criadoras no Creator Summit",
      type: "photo",
    },
    {
      src: "/assets/samanta-luana.webp",
      alt: "Samanta e Luana juntas em um encontro da comunidade",
      type: "photo",
    },
    {
      src: "/testimonials/2026-08/itamires-motivacao.webp",
      alt: "Itámires conta como as mulheres da comunidade ajudam, motivam e inspiram",
      type: "proof",
    },
    {
      src: "/testimonials/2026-08/bruna-comunidade.webp",
      alt: "Bruna celebra o orgulho de fazer parte da comunidade",
      type: "proof",
    },
    {
      src: "/testimonials/2026-08/jana-networking.webp",
      alt: "Jana explica como o networking ajuda o grupo a manter a motivação e testar novas estratégias",
      type: "proof",
    },
  ];

  const buildOrbit = (section) => {
    const stage = section.querySelector(".community-orbit");
    const focus = section.querySelector(".community-orbit-focus");
    const focusImage = section.querySelector(".community-orbit-focus img");
    const cards = Array.from(
      section.querySelectorAll("[data-community-orbit-index]"),
    );
    const dots = Array.from(
      section.querySelectorAll("[data-community-orbit-dot]"),
    );
    const previous = section.querySelector(".community-orbit-arrow--prev");
    const next = section.querySelector(".community-orbit-arrow--next");

    if (!stage || !focus || !focusImage || !cards.length) return;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    let activeIndex = 0;
    let phase = -Math.PI / 2;
    let lastFrame = 0;
    let frame = 0;
    let paused = false;
    let pointerStartX = null;
    let ignoreClickUntil = 0;

    const setActive = (nextIndex) => {
      activeIndex =
        (nextIndex + orbitItems.length) % orbitItems.length;
      const item = orbitItems[activeIndex];

      focus.style.setProperty(
        "--community-focus-image",
        `url("${item.src}")`,
      );
      focusImage.src = item.src;
      focusImage.alt = item.alt;
      focusImage.className =
        item.type === "photo" ? "is-photo" : "is-proof";

      cards.forEach((card, index) => {
        const isActive = index === activeIndex;
        card.classList.toggle("is-active", isActive);
        card.setAttribute("aria-pressed", String(isActive));
      });

      dots.forEach((dot, index) => {
        const isActive = index === activeIndex;
        dot.classList.toggle("is-active", isActive);
        dot.setAttribute("aria-current", isActive ? "true" : "false");
      });
    };

    const positionCards = (time = 0) => {
      const width = stage.clientWidth;
      const height = stage.clientHeight;
      if (!width || !height) {
        frame = window.requestAnimationFrame(positionCards);
        return;
      }

      if (!paused && !reducedMotion && lastFrame) {
        phase += Math.min(time - lastFrame, 48) * 0.000075;
      }
      lastFrame = time;

      const radiusX = width * (width <= 520 ? 0.41 : 0.42);
      const radiusY = height * (width <= 520 ? 0.405 : 0.415);

      cards.forEach((card, index) => {
        const angle = phase + (index / cards.length) * Math.PI * 2;
        const x = Math.cos(angle) * radiusX;
        const y = Math.sin(angle) * radiusY;
        const depth = (Math.sin(angle) + 1) / 2;
        const scale = 0.78 + depth * 0.2;

        card.style.transform =
          `translate3d(calc(-50% + ${x.toFixed(2)}px), ` +
          `calc(-50% + ${y.toFixed(2)}px), 0) scale(${scale.toFixed(3)})`;
        card.style.opacity = String(0.58 + depth * 0.4);
        card.style.zIndex = String(5 + Math.round(depth * 7));
      });

      if (!reducedMotion) frame = window.requestAnimationFrame(positionCards);
    };

    cards.forEach((card, index) => {
      card.addEventListener("click", () => {
        if (Date.now() < ignoreClickUntil) return;
        setActive(index);
      });
    });

    dots.forEach((dot, index) => {
      dot.addEventListener("click", () => setActive(index));
    });

    previous?.addEventListener("click", () => setActive(activeIndex - 1));
    next?.addEventListener("click", () => setActive(activeIndex + 1));

    stage.addEventListener("keydown", (event) => {
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        setActive(activeIndex - 1);
      }
      if (event.key === "ArrowRight") {
        event.preventDefault();
        setActive(activeIndex + 1);
      }
    });

    stage.addEventListener("pointerdown", (event) => {
      pointerStartX = event.clientX;
    });

    stage.addEventListener("pointerup", (event) => {
      if (pointerStartX === null) return;
      const distance = event.clientX - pointerStartX;
      pointerStartX = null;
      if (Math.abs(distance) < 42) return;
      ignoreClickUntil = Date.now() + 320;
      setActive(activeIndex + (distance < 0 ? 1 : -1));
    });

    stage.addEventListener("pointercancel", () => {
      pointerStartX = null;
    });

    stage.addEventListener("pointerenter", () => {
      paused = true;
    });
    stage.addEventListener("pointerleave", () => {
      paused = false;
      pointerStartX = null;
    });
    stage.addEventListener("focusin", () => {
      paused = true;
    });
    stage.addEventListener("focusout", () => {
      paused = false;
    });

    const autoAdvance = reducedMotion
      ? 0
      : window.setInterval(() => {
          if (!paused && !document.hidden) setActive(activeIndex + 1);
        }, 5600);

    setActive(0);
    positionCards();

    window.addEventListener(
      "pagehide",
      () => {
        if (frame) window.cancelAnimationFrame(frame);
        if (autoAdvance) window.clearInterval(autoAdvance);
      },
      { once: true },
    );
  };

  const buildCommunitySection = () => {
    if (document.querySelector("#comunidade")) return true;

    const methodSection = document.querySelector(".method-section");
    if (!methodSection) return false;

    const section = document.createElement("section");
    section.className = "community-section";
    section.id = "comunidade";
    section.setAttribute("aria-labelledby", "community-title");

    const orbitCards = orbitItems
      .map(
        (item, index) => `
          <button class="community-orbit-card community-orbit-card--${item.type}" type="button"
            data-community-orbit-index="${index}" aria-label="Exibir imagem ${index + 1} da comunidade"
            aria-pressed="${index === 0 ? "true" : "false"}">
            <img src="${item.src}" alt="" aria-hidden="true" loading="lazy" decoding="async" draggable="false">
          </button>`,
      )
      .join("");

    const orbitDots = orbitItems
      .map(
        (_, index) => `
          <button type="button" data-community-orbit-dot="${index}"
            aria-label="Ir para imagem ${index + 1}" aria-current="${index === 0 ? "true" : "false"}"></button>`,
      )
      .join("");

    section.innerHTML = `
      <div class="community-shell">
        <div class="community-copy">
          <span class="community-eyebrow">Uma comunidade real, ativa e próxima</span>
          <h2 id="community-title">Sua jornada <strong>não precisa ser solitária.</strong></h2>
          <p>Você não entra apenas para aprender. Entra em um ambiente com outras mulheres que vivem os mesmos desafios, compartilham o que funciona e crescem junto com você.</p>

          <a class="community-cta" href="${checkoutUrl}" target="_blank" rel="noopener noreferrer">
            QUERO FAZER PARTE DESSA COMUNIDADE
            <span aria-hidden="true">↗</span>
          </a>
          <small class="community-note">Conhecimento abre o caminho. Uma comunidade faz você continuar nele.</small>
        </div>

        <div class="community-visual">
          <p class="community-gallery-message">
            <strong>Uma rede que vibra por cada conquista.</strong>
            <span>Troca diária, apoio real e mulheres que crescem juntas.</span>
          </p>

          <div class="community-orbit" tabindex="0" aria-label="Galeria em órbita com momentos e resultados da comunidade">
            <div class="community-orbit-ring" aria-hidden="true"></div>
            <div class="community-orbit-focus" aria-live="polite">
              <img src="${orbitItems[0].src}" alt="${orbitItems[0].alt}" loading="lazy" decoding="async">
            </div>
            ${orbitCards}
            <button class="community-orbit-arrow community-orbit-arrow--prev" type="button" aria-label="Ver imagem anterior">←</button>
            <button class="community-orbit-arrow community-orbit-arrow--next" type="button" aria-label="Ver próxima imagem">→</button>
            <div class="community-orbit-dots">${orbitDots}</div>
          </div>
        </div>
      </div>
    `;

    methodSection.insertAdjacentElement("beforebegin", section);
    buildOrbit(section);
    return true;
  };

  const scheduleBuild = () => {
    window.setTimeout(buildCommunitySection, 1150);
  };

  if (document.readyState === "complete") {
    scheduleBuild();
  } else {
    window.addEventListener("load", scheduleBuild, { once: true });
  }

  window.addEventListener("pageshow", scheduleBuild);
})();
