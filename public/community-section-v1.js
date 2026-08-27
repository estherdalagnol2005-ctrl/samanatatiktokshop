(() => {
  const checkoutUrl =
    "https://pay.kiwify.com.br/3U3ri1Z?utm_source=ig&utm_medium=social&utm_content=link_in_bio&fbclid=PAcGRvZgJleHRuA2FlbQIxMQBzcnRjBmFwcF9pZA85MzY2MTk3NDMzOTI0NTkAAaevJUkw0_uoPexeLpBD0uwAqbcykPEPqyIsY92jjdMazyQ3sDDuOGK9PuqByQ_aem_2snf6J8TOi97NbaW3-4PNw&utm_id=97760_v0_s00_e0_tv3O";

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
      src: "/testimonials/2026-08/bruna-comunidade.webp",
      alt: "Bruna celebra o orgulho de fazer parte da comunidade",
    },
    {
      src: "data:image/webp;base64,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",
      alt: "Karol Souza compartilha novo recorde com R$ 2,6 mil em comissões",
    },
  ];

  const setupCarousel = (section) => {
    const viewport = section.querySelector(".community-uniform-carousel");
    const cards = [...section.querySelectorAll(".community-uniform-card")];
    const dots = [...section.querySelectorAll(".community-uniform-dot")];
    const previous = section.querySelector('[data-community-direction="-1"]');
    const next = section.querySelector('[data-community-direction="1"]');
    if (!viewport || !cards.length || !previous || !next) return;

    let activeIndex = 0;
    let scrollFrame = 0;

    const updateState = (index) => {
      activeIndex = Math.max(0, Math.min(cards.length - 1, index));
      cards.forEach((card, cardIndex) => {
        const active = cardIndex === activeIndex;
        card.classList.toggle("is-active", active);
        card.toggleAttribute("aria-current", active);
      });
      dots.forEach((dot, dotIndex) => {
        const active = dotIndex === activeIndex;
        dot.classList.toggle("is-active", active);
        if (active) dot.setAttribute("aria-current", "true");
        else dot.removeAttribute("aria-current");
      });
    };

    const centerCard = (index, behavior = "smooth") => {
      const normalized = (index + cards.length) % cards.length;
      const card = cards[normalized];
      const left = card.offsetLeft - (viewport.clientWidth - card.clientWidth) / 2;
      viewport.scrollTo({ left, behavior });
      updateState(normalized);
    };

    const updateFromScroll = () => {
      window.cancelAnimationFrame(scrollFrame);
      scrollFrame = window.requestAnimationFrame(() => {
        const viewportCenter = viewport.scrollLeft + viewport.clientWidth / 2;
        let closest = 0;
        let distance = Number.POSITIVE_INFINITY;
        cards.forEach((card, index) => {
          const center = card.offsetLeft + card.clientWidth / 2;
          const currentDistance = Math.abs(center - viewportCenter);
          if (currentDistance < distance) {
            distance = currentDistance;
            closest = index;
          }
        });
        updateState(closest);
      });
    };

    previous.addEventListener("click", () => centerCard(activeIndex - 1));
    next.addEventListener("click", () => centerCard(activeIndex + 1));
    dots.forEach((dot, index) => dot.addEventListener("click", () => centerCard(index)));
    viewport.addEventListener("scroll", updateFromScroll, { passive: true });
    viewport.addEventListener("keydown", (event) => {
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        centerCard(activeIndex - 1);
      }
      if (event.key === "ArrowRight") {
        event.preventDefault();
        centerCard(activeIndex + 1);
      }
    });
    window.addEventListener("resize", () => centerCard(activeIndex, "auto"), { passive: true });

    centerCard(0, "auto");
  };

  const buildCommunitySection = () => {
    if (document.querySelector("#comunidade")) return true;

    const methodSection = document.querySelector(".method-section");
    if (!methodSection) return false;

    const section = document.createElement("section");
    section.className = "community-section community-uniform-section";
    section.id = "comunidade";
    section.setAttribute("aria-labelledby", "community-title");

    const cards = carouselItems
      .map(
        (item, index) => `
          <figure class="community-uniform-card${index === 0 ? " is-active" : ""}"${index === 0 ? ' aria-current="true"' : ""}>
            <img src="${item.src}" alt="${item.alt}" loading="${index === 0 ? "eager" : "lazy"}" decoding="async" draggable="false">
          </figure>`,
      )
      .join("");

    const dots = carouselItems
      .map(
        (_, index) => `<button class="community-uniform-dot${index === 0 ? " is-active" : ""}" type="button" aria-label="Ver imagem ${index + 1}"${index === 0 ? ' aria-current="true"' : ""}></button>`,
      )
      .join("");

    section.innerHTML = `
      <div class="community-shell community-uniform-shell">
        <header class="community-copy community-uniform-copy">
          <h2 id="community-title">Sua jornada <strong>não precisa ser solitária.</strong></h2>
          <p>Eu sei que você tenta resolver tudo sozinha. Mas você não precisa continuar assim. A Sunlix existe por um propósito: transformar alunas em uma família.</p>
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

  const scheduleBuild = () => window.setTimeout(buildCommunitySection, 1150);

  if (document.readyState === "complete") scheduleBuild();
  else window.addEventListener("load", scheduleBuild, { once: true });

  window.addEventListener("pageshow", scheduleBuild);
})();
