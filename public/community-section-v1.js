(() => {
  const checkoutUrl =
    "https://pay.kiwify.com.br/3U3ri1Z?utm_source=ig&utm_medium=social&utm_content=link_in_bio&fbclid=PAcGRvZgJleHRuA2FlbQIxMQBzcnRjBmFwcF9pZA85MzY2MTk3NDMzOTI0NTkAAaevJUkw0_uoPexeLpBD0uwAqbcykPEPqyIsY92jjdMazyQ3sDDuOGK9PuqByQ_aem_2snf6J8TOi97NbaW3-4PNw&utm_id=97760_v0_s00_e0_tv3O";

  const carouselItems = [
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

  const buildMagneticCarousel = (section) => {
    const carousel = section.querySelector(".community-magnetic");
    const track = section.querySelector(".community-magnetic-track");
    const backdrop = section.querySelector(".community-magnetic-backdrop");
    const cards = Array.from(
      section.querySelectorAll("[data-community-magnetic-index]"),
    );

    if (!carousel || !track || !backdrop || !cards.length) return;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const finePointer = window.matchMedia(
      "(hover: hover) and (pointer: fine)",
    ).matches;
    let openIndex = null;
    let targetFactors = cards.map(() => 0);
    let currentFactors = cards.map(() => 0);
    let animationFrame = 0;
    let pointerStartX = null;
    let ignoreClickUntil = 0;

    const getMetrics = () => {
      const width = track.clientWidth;
      const height = track.clientHeight;
      const mobile = width <= 520;
      const gap = mobile ? 6 : Math.min(14, width * 0.018);
      const collapsedWidth = mobile
        ? Math.min(44, (width - gap * (cards.length - 1)) / cards.length)
        : Math.min(92, (width - gap * (cards.length - 1)) / cards.length);
      const hoverWidth = mobile
        ? collapsedWidth
        : Math.min(196, collapsedWidth * 2.2);
      const collapsedHeight = Math.min(
        mobile ? 335 : 430,
        height * (mobile ? 0.7 : 0.74),
      );
      const hoverHeight = mobile
        ? collapsedHeight
        : Math.min(collapsedHeight + 58, height * 0.84);
      const openWidth = Math.min(
        mobile ? 310 : 520,
        width * (mobile ? 0.79 : 0.67),
      );
      const openHeight = Math.min(
        mobile ? 410 : 535,
        height * (mobile ? 0.86 : 0.88),
      );

      return {
        width,
        height,
        mobile,
        gap,
        collapsedWidth,
        hoverWidth,
        collapsedHeight,
        hoverHeight,
        openWidth,
        openHeight,
      };
    };

    const applySizes = () => {
      const metrics = getMetrics();
      track.style.gap = `${metrics.gap}px`;

      cards.forEach((card, index) => {
        let width;
        let height;

        if (openIndex !== null) {
          if (index === openIndex) {
            width = metrics.openWidth;
            height = metrics.openHeight;
          } else {
            width = Math.max(
              metrics.mobile ? 10 : 34,
              (metrics.width -
                metrics.openWidth -
                metrics.gap * (cards.length - 1)) /
                (cards.length - 1),
            );
            height = metrics.collapsedHeight;
          }
        } else {
          const factor = currentFactors[index] || 0;
          width =
            metrics.collapsedWidth +
            (metrics.hoverWidth - metrics.collapsedWidth) * factor;
          height =
            metrics.collapsedHeight +
            (metrics.hoverHeight - metrics.collapsedHeight) * factor;
        }

        card.style.width = `${Math.max(1, width).toFixed(2)}px`;
        card.style.height = `${Math.max(1, height).toFixed(2)}px`;
      });
    };

    const animateTowardTargets = () => {
      let moving = false;
      currentFactors = currentFactors.map((current, index) => {
        const target = targetFactors[index] || 0;
        const distance = target - current;
        if (Math.abs(distance) <= 0.002) return target;
        moving = true;
        return current + distance * (reducedMotion ? 1 : 0.22);
      });
      applySizes();
      animationFrame = moving
        ? window.requestAnimationFrame(animateTowardTargets)
        : 0;
    };

    const startAnimation = () => {
      if (!animationFrame) {
        animationFrame = window.requestAnimationFrame(animateTowardTargets);
      }
    };

    const resetMagnification = () => {
      targetFactors = cards.map(() => 0);
      startAnimation();
    };

    const closeCard = () => {
      openIndex = null;
      carousel.classList.remove("has-open-card");
      backdrop.hidden = true;
      cards.forEach((card) => {
        card.classList.remove("is-open", "is-blurred");
        card.setAttribute("aria-expanded", "false");
      });
      resetMagnification();
    };

    const openCard = (index) => {
      openIndex = (index + cards.length) % cards.length;
      currentFactors = cards.map(() => 0);
      targetFactors = cards.map(() => 0);
      carousel.classList.add("has-open-card");
      backdrop.hidden = false;
      cards.forEach((card, cardIndex) => {
        const isOpen = cardIndex === openIndex;
        card.classList.toggle("is-open", isOpen);
        card.classList.toggle("is-blurred", !isOpen);
        card.setAttribute("aria-expanded", String(isOpen));
      });
      applySizes();
    };

    const setTargetsFromPointer = (clientX) => {
      if (!finePointer || openIndex !== null) return;
      const metrics = getMetrics();
      const rect = track.getBoundingClientRect();
      const pointerX = clientX - rect.left;
      const totalBase =
        cards.length * metrics.collapsedWidth +
        (cards.length - 1) * metrics.gap;
      const startX = (metrics.width - totalBase) / 2;
      const influence = Math.max(170, metrics.collapsedWidth * 2.35);

      targetFactors = cards.map((_, index) => {
        const center =
          startX +
          index * (metrics.collapsedWidth + metrics.gap) +
          metrics.collapsedWidth / 2;
        const normalized = Math.max(
          0,
          1 - Math.abs(pointerX - center) / influence,
        );
        return normalized * normalized * (3 - 2 * normalized);
      });
      startAnimation();
    };

    track.addEventListener("pointermove", (event) => {
      setTargetsFromPointer(event.clientX);
    });
    track.addEventListener("pointerleave", () => {
      if (openIndex === null) resetMagnification();
      pointerStartX = null;
    });

    cards.forEach((card, index) => {
      card.addEventListener("click", (event) => {
        event.stopPropagation();
        if (Date.now() < ignoreClickUntil) return;
        if (openIndex === index) closeCard();
        else openCard(index);
      });

      card.addEventListener("keydown", (event) => {
        if (event.key === "ArrowLeft") {
          event.preventDefault();
          openCard((openIndex ?? index) - 1);
        }
        if (event.key === "ArrowRight") {
          event.preventDefault();
          openCard((openIndex ?? index) + 1);
        }
        if (event.key === "Escape") {
          event.preventDefault();
          closeCard();
        }
      });
    });

    backdrop.addEventListener("click", closeCard);

    carousel.addEventListener("pointerdown", (event) => {
      pointerStartX = event.clientX;
    });
    carousel.addEventListener("pointerup", (event) => {
      if (pointerStartX === null) return;
      const distance = event.clientX - pointerStartX;
      pointerStartX = null;
      if (Math.abs(distance) < 44) return;
      ignoreClickUntil = Date.now() + 320;
      const direction = distance < 0 ? 1 : -1;
      openCard((openIndex ?? 0) + direction);
    });
    carousel.addEventListener("pointercancel", () => {
      pointerStartX = null;
    });

    window.addEventListener("resize", applySizes, { passive: true });
    window.addEventListener(
      "pagehide",
      () => {
        if (animationFrame) window.cancelAnimationFrame(animationFrame);
      },
      { once: true },
    );

    applySizes();
    if (window.matchMedia("(width <= 640px)").matches) openCard(2);
  };

  const buildCommunitySection = () => {
    if (document.querySelector("#comunidade")) return true;

    const methodSection = document.querySelector(".method-section");
    if (!methodSection) return false;

    const section = document.createElement("section");
    section.className = "community-section";
    section.id = "comunidade";
    section.setAttribute("aria-labelledby", "community-title");

    const magneticCards = carouselItems
      .map(
        (item, index) => `
          <button class="community-magnetic-card community-magnetic-card--${item.type}" type="button"
            data-community-magnetic-index="${index}" aria-label="Abrir imagem ${index + 1} da comunidade"
            aria-expanded="false" style="--community-magnetic-image: url('${item.src}')">
            <img src="${item.src}" alt="${item.alt}" loading="lazy" decoding="async" draggable="false">
          </button>`,
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

          <div class="community-magnetic" aria-label="Carrossel magnético com momentos e resultados da comunidade">
            <button class="community-magnetic-backdrop" type="button" aria-label="Fechar imagem ampliada" hidden></button>
            <div class="community-magnetic-track">${magneticCards}</div>
          </div>
        </div>
      </div>
    `;

    methodSection.insertAdjacentElement("beforebegin", section);
    buildMagneticCarousel(section);
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
