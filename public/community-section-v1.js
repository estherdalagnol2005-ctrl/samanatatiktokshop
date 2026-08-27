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
      src: "https://samanatatiktokshop.vercel.app/testimonials/sarah-pagamento-7714.webp",
      alt: "Sarah compartilha um resultado real de pagamento",
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
