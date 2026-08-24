(() => {
  const checkoutUrl =
    "https://pay.kiwify.com.br/3U3ri1Z?utm_source=ig&utm_medium=social&utm_content=link_in_bio&fbclid=PAcGRvZgJleHRuA2FlbQIxMQBzcnRjBmFwcF9pZA85MzY2MTk3NDMzOTI0NTkAAaevJUkw0_uoPexeLpBD0uwAqbcykPEPqyIsY92jjdMazyQ3sDDuOGK9PuqByQ_aem_2snf6J8TOi97NbaW3-4PNw&utm_id=97760_v0_s00_e0_tv3O";

  const carouselItems = [
    {
      src: "/testimonials/2026-08/itamires-motivacao.webp",
      alt: "Itámires conta como as mulheres da comunidade ajudam, motivam e inspiram",
      type: "proof",
    },
    {
      src: "/testimonials/2026-08/itamires-ajuda.webp",
      alt: "Itámires celebra o apoio recebido para validar produtos e aprender a escalar",
      type: "proof",
    },
    {
      src: "/testimonials/2026-08/bruna-comunidade.webp",
      alt: "Bruna celebra o orgulho de fazer parte da comunidade",
      type: "proof",
    },
    {
      src: "/testimonials/2026-08/leticia-pix-20681.webp",
      alt: "Letícia compartilha um resultado real conquistado com o TikTok Shop",
      type: "proof",
    },
  ];

  const buildBlurCarousel = (section) => {
    const carousel = section.querySelector(".community-blur-carousel");
    const frame = section.querySelector(".community-blur-frame");
    const slides = Array.from(section.querySelectorAll(".community-blur-slide"));
    const previous = section.querySelector('[data-community-blur-direction="-1"]');
    const next = section.querySelector('[data-community-blur-direction="1"]');
    const status = section.querySelector(".community-blur-status");

    if (!carousel || !frame || !slides.length || !previous || !next) return;

    let index = 0;
    let swipeStartY = null;
    let swipeStartX = null;

    const update = () => {
      slides.forEach((slide, slideIndex) => {
        const active = slideIndex === index;
        slide.classList.toggle("is-active", active);
        slide.setAttribute("aria-hidden", String(!active));
      });
      if (status) status.textContent = `Imagem ${index + 1} de ${slides.length}`;
    };

    const go = (direction) => {
      index = (index + direction + slides.length) % slides.length;
      update();
    };

    const setHover = (direction) => {
      frame.classList.toggle("is-hovering-previous", direction === -1);
      frame.classList.toggle("is-hovering-next", direction === 1);
    };

    const setPressed = (direction) => {
      frame.classList.toggle("is-pressing-previous", direction === -1);
      frame.classList.toggle("is-pressing-next", direction === 1);
    };

    const clearPressed = () => setPressed(0);

    [previous, next].forEach((button) => {
      const direction = Number(button.dataset.communityBlurDirection);

      button.addEventListener("pointerenter", () => setHover(direction));
      button.addEventListener("pointerleave", () => {
        setHover(0);
        clearPressed();
      });
      button.addEventListener("pointerdown", (event) => {
        event.stopPropagation();
        button.setPointerCapture?.(event.pointerId);
        setHover(direction);
        setPressed(direction);
      });
      button.addEventListener("pointerup", (event) => {
        event.stopPropagation();
        button.releasePointerCapture?.(event.pointerId);
        clearPressed();
      });
      button.addEventListener("pointercancel", clearPressed);
      button.addEventListener("click", () => go(direction));
    });

    carousel.addEventListener("pointerdown", (event) => {
      if (event.target.closest(".community-blur-arrow")) return;
      swipeStartY = event.clientY;
      swipeStartX = event.clientX;
    });

    carousel.addEventListener("pointerup", (event) => {
      if (swipeStartY === null || swipeStartX === null) return;
      const distanceY = event.clientY - swipeStartY;
      const distanceX = event.clientX - swipeStartX;
      swipeStartY = null;
      swipeStartX = null;
      if (Math.abs(distanceY) < 48 || Math.abs(distanceY) < Math.abs(distanceX)) {
        return;
      }
      go(distanceY < 0 ? 1 : -1);
    });

    carousel.addEventListener("pointercancel", () => {
      swipeStartY = null;
      swipeStartX = null;
      clearPressed();
    });

    carousel.addEventListener("keydown", (event) => {
      if (event.key === "ArrowUp") {
        event.preventDefault();
        go(-1);
      }
      if (event.key === "ArrowDown") {
        event.preventDefault();
        go(1);
      }
    });

    update();
  };

  const buildCommunitySection = () => {
    if (document.querySelector("#comunidade")) return true;

    const methodSection = document.querySelector(".method-section");
    if (!methodSection) return false;

    const section = document.createElement("section");
    section.className = "community-section";
    section.id = "comunidade";
    section.setAttribute("aria-labelledby", "community-title");

    const slides = carouselItems
      .map(
        (item, index) => `
          <figure class="community-blur-slide community-blur-slide--${item.type}"
            aria-hidden="${index !== 0}" style="--community-blur-image: url('${item.src}')">
            <img src="${item.src}" alt="${item.alt}" loading="${index === 0 ? "eager" : "lazy"}"
              decoding="async" draggable="false">
          </figure>`,
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

          <div class="community-blur-carousel" tabindex="0" role="group"
            aria-roledescription="carrossel" aria-label="Momentos e resultados da comunidade">
            <div class="community-blur-frame">
              <div class="community-blur-slides">${slides}</div>
              <div class="community-blur-edge community-blur-edge--previous" aria-hidden="true"></div>
              <div class="community-blur-edge community-blur-edge--next" aria-hidden="true"></div>

              <button class="community-blur-arrow community-blur-arrow--previous" type="button"
                data-community-blur-direction="-1" aria-label="Ver imagem anterior">
                <svg viewBox="0 0 24 24" aria-hidden="true"><polyline points="6 15 12 9 18 15"></polyline></svg>
              </button>
              <button class="community-blur-arrow community-blur-arrow--next" type="button"
                data-community-blur-direction="1" aria-label="Ver próxima imagem">
                <svg viewBox="0 0 24 24" aria-hidden="true"><polyline points="6 9 12 15 18 9"></polyline></svg>
              </button>
              <span class="community-blur-status" aria-live="polite"></span>
            </div>
          </div>
        </div>
      </div>
    `;

    methodSection.insertAdjacentElement("beforebegin", section);
    buildBlurCarousel(section);
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
