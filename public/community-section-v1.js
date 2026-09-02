(() => {
  const checkoutUrl =
    "https://pay.kiwify.com.br/3U3ri1Z?utm_source=ig&utm_medium=social&utm_content=link_in_bio&fbclid=PAcGRvZgJleHRuA2FlbQIxMQBzcnRjBmFwcF9pZA85MzY2MTk3NDMzOTI0NTkAAaevJUkw0_uoPexeLpBD0uwAqbcykPEPqyIsY92jjdMazyQ3sDDuOGK9PuqByQ_aem_2snf6J8TOi97NbaW3-4PNw&utm_id=97760_v0_s00_e0_tv3O";
  const initialIndex = 2;

  const carouselItems = [
    {
      src: "/testimonials/2026-08/itamires-motivacao.webp",
      alt: "Itámires conta como as mulheres da comunidade ajudam, motivam e inspiram",
    },
    {
      src: "/testimonials/2026-08/itamires-ajuda.webp",
      alt: "Itámires compartilha como a ajuda da comunidade fez diferença na jornada",
    },
    {
      src: "/testimonials/2026-08/leticia-pix-20681-original.jpg",
      alt: "Letícia compartilha um Pix de mais de vinte mil reais recebido do TikTok Shop",
    },
    {
      src: "/testimonials/2026-08/bruna-comunidade.webp",
      alt: "Bruna celebra o orgulho de fazer parte da comunidade",
    },
    {
      src: "/testimonials/sarah-pagamento-7714.webp",
      alt: "Sarah compartilha um resultado real de pagamento",
    },
  ];

  const setupCarousel = (section) => {
    if (section.dataset.carouselReady === "true") return;
    const viewport = section.querySelector(".community-uniform-carousel");
    const cards = [...section.querySelectorAll(".community-uniform-card")];
    const dots = [...section.querySelectorAll(".community-uniform-dot")];
    const previous = section.querySelector('[data-community-direction="-1"]');
    const next = section.querySelector('[data-community-direction="1"]');
    if (!viewport || !cards.length || !previous || !next) return;
    section.dataset.carouselReady = "true";

    let activeIndex = initialIndex;
    let gestureStart = null;

    const updateState = (index) => {
      activeIndex = (index + cards.length) % cards.length;
      const previousIndex = (activeIndex - 1 + cards.length) % cards.length;
      const nextIndex = (activeIndex + 1) % cards.length;

      cards.forEach((card, cardIndex) => {
        const active = cardIndex === activeIndex;
        const previousCard = cardIndex === previousIndex;
        const nextCard = cardIndex === nextIndex;
        const near = previousCard || nextCard;

        card.dataset.slot = active
          ? "active"
          : previousCard
            ? "previous"
            : nextCard
              ? "next"
              : "hidden";
        card.classList.toggle("is-active", active);
        card.classList.toggle("is-near", near);
        card.classList.toggle("is-distant", !active && !near);
        card.toggleAttribute("aria-current", active);
      });
      dots.forEach((dot, dotIndex) => {
        const active = dotIndex === activeIndex;
        dot.classList.toggle("is-active", active);
        if (active) dot.setAttribute("aria-current", "true");
        else dot.removeAttribute("aria-current");
      });
    };

    previous.addEventListener("click", () => updateState(activeIndex - 1));
    next.addEventListener("click", () => updateState(activeIndex + 1));
    dots.forEach((dot, index) => dot.addEventListener("click", () => updateState(index)));
    viewport.addEventListener("keydown", (event) => {
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        updateState(activeIndex - 1);
      }
      if (event.key === "ArrowRight") {
        event.preventDefault();
        updateState(activeIndex + 1);
      }
    });

    viewport.addEventListener("pointerdown", (event) => {
      if (event.pointerType === "mouse" && event.button !== 0) return;
      gestureStart = { x: event.clientX, y: event.clientY };
      viewport.classList.add("is-dragging");
    });

    viewport.addEventListener("pointerup", (event) => {
      if (!gestureStart) return;
      const deltaX = event.clientX - gestureStart.x;
      const deltaY = event.clientY - gestureStart.y;
      gestureStart = null;
      viewport.classList.remove("is-dragging");

      if (Math.abs(deltaX) < 42 || Math.abs(deltaX) <= Math.abs(deltaY)) return;
      updateState(activeIndex + (deltaX < 0 ? 1 : -1));
    });

    viewport.addEventListener("pointercancel", () => {
      gestureStart = null;
      viewport.classList.remove("is-dragging");
    });

    updateState(initialIndex);
  };

  const buildCommunitySection = () => {
    const existing = document.querySelector("#comunidade");
    if (existing) { setupCarousel(existing); return true; }

    const methodSection = document.querySelector(".method-section");
    if (!methodSection) return false;

    const section = document.createElement("section");
    section.className = "community-section community-uniform-section";
    section.id = "comunidade";
    section.setAttribute("aria-labelledby", "community-title");

    const cards = carouselItems
      .map(
        (item, index) => `
          <figure class="community-uniform-card${index === initialIndex ? " is-active" : ""}"${index === initialIndex ? ' aria-current="true"' : ""}>
            <img src="${item.src}" alt="${item.alt}" loading="lazy" decoding="async" draggable="false">
          </figure>`,
      )
      .join("");

    const dots = carouselItems
      .map(
        (_, index) => `<button class="community-uniform-dot${index === initialIndex ? " is-active" : ""}" type="button" aria-label="Ver imagem ${index + 1}"${index === initialIndex ? ' aria-current="true"' : ""}></button>`,
      )
      .join("");

    section.innerHTML = `
      <div class="community-shell community-uniform-shell">
        <header class="community-copy community-uniform-copy">
          <h2 id="community-title">Sua jornada <strong>não precisa ser solitária.</strong></h2>
          <p>A Sunlix foi criada com o propósito de unir diferentes mulheres com o mesmo objetivo: mudar a própria realidade através do TikTok Shop. Todas as mulheres dessa comunidade estão comprometidas a trilhar uma jornada juntas, até fazer dar certo!</p>
        </header>

        <div class="community-uniform-stage">
          <button class="community-uniform-arrow community-uniform-arrow--prev" type="button" data-community-direction="-1" aria-label="Ver imagem anterior">←</button>
          <div class="community-uniform-carousel" tabindex="0" role="group" aria-roledescription="carrossel" aria-label="Depoimentos reais da comunidade">
            <div class="community-uniform-track">${cards}</div>
          </div>
          <button class="community-uniform-arrow community-uniform-arrow--next" type="button" data-community-direction="1" aria-label="Ver próxima imagem">→</button>
        </div>

        <div class="community-uniform-nav">
          <span>ARRASTE PARA VER MAIS</span>
          <div class="community-uniform-dots">${dots}</div>
        </div>

        <a class="community-cta community-uniform-cta" href="${checkoutUrl}" target="_blank" rel="noopener noreferrer">
          QUERO FAZER PARTE DESSA COMUNIDADE
          <span aria-hidden="true">↗</span>
        </a>
      </div>
    `;

    methodSection.insertAdjacentElement("beforebegin", section);
    setupCarousel(section);
    return true;
  };

  const boot = () => {
    if (buildCommunitySection()) return;

    const observer = new MutationObserver(() => {
      if (buildCommunitySection()) observer.disconnect();
    });
    observer.observe(document.documentElement, { childList: true, subtree: true });
    window.setTimeout(() => observer.disconnect(), 2500);
  };

  boot();
  window.addEventListener("pageshow", boot);
})();
