(() => {
  const checkoutUrl =
    "https://pay.kiwify.com.br/3U3ri1Z?utm_source=ig&utm_medium=social&utm_content=link_in_bio&fbclid=PAcGRvZgJleHRuA2FlbQIxMQBzcnRjBmFwcF9pZA85MzY2MTk3NDMzOTI0NTkAAaevJUkw0_uoPexeLpBD0uwAqbcykPEPqyIsY92jjdMazyQ3sDDuOGK9PuqByQ_aem_2snf6J8TOi97NbaW3-4PNw&utm_id=97760_v0_s00_e0_tv3O";

  // Replace only these entries when the final assets are available.
  // The "today" entry accepts "image" or "video" without any layout changes.
  const HOME_STORY_MEDIA = {
    before: {
      type: "placeholder",
      src: "",
      alt: "Placeholder para a imagem da casa onde Samanta morava antes.",
      placeholder: "IMAGEM DA CASA ONDE TUDO COMEÇOU",
    },
    today: {
      type: "placeholder",
      src: "",
      alt: "Placeholder para a mídia da casa onde Samanta mora hoje.",
      placeholder: "FOTO OU VÍDEO DA CASA ATUAL",
    },
  };

  const renderMedia = (media, variant) => {
    if (media.type === "video" && media.src) {
      return `<video muted playsinline loop autoplay preload="metadata" aria-label="${media.alt}"><source src="${media.src}"></video>`;
    }

    if (media.type === "image" && media.src) {
      return `<img src="${media.src}" alt="${media.alt}" loading="lazy" decoding="async">`;
    }

    return `<div class="home-story-placeholder home-story-placeholder--${variant}" role="img" aria-label="${media.alt}"><span>${media.placeholder}</span></div>`;
  };

  const buildHomeStorySection = () => {
    if (document.querySelector("#minha-historia")) return true;

    const dreams = document.querySelector(".dreams-section");
    const method = document.querySelector(".method-section");
    if (!dreams || !method) return false;

    const section = document.createElement("section");
    section.className = "home-story-section";
    section.id = "minha-historia";
    section.setAttribute("aria-labelledby", "home-story-title");
    section.innerHTML = `
      <div class="home-story-shell">
        <header class="home-story-heading">
          <h2 id="home-story-title">Mudar a minha mentalidade <strong>mudou minha realidade</strong><em>Foi sobre descobrir que eu podia conquistar tudo que eu quisesse.</em></h2>
          <p>De onde eu comecei para onde eu vivo hoje, cada detalhe me lembra que liberdade não é apenas um número na tela. É poder escolher o lugar onde a sua história continua.</p>
        </header>

        <div class="home-story-media-grid">
          <figure class="home-story-card home-story-card--before">
            <div class="home-story-media">${renderMedia(HOME_STORY_MEDIA.before, "before")}</div>
            <figcaption><b>ANTES</b><span>ONDE TUDO COMEÇOU</span></figcaption>
          </figure>

          <figure class="home-story-card home-story-card--today">
            <div class="home-story-media">${renderMedia(HOME_STORY_MEDIA.today, "today")}</div>
            <figcaption><b>HOJE</b><span>A VIDA QUE EU CONSEGUI CONSTRUIR</span></figcaption>
          </figure>
        </div>

        <div class="home-story-reflection">
          <p>Essas duas imagens não mostram apenas duas casas. Mostram o que pode acontecer quando uma mulher percebe que é capaz de construir uma realidade diferente.</p>
          <a class="home-story-cta" href="${checkoutUrl}">QUERO CONSTRUIR MINHA PRÓPRIA HISTÓRIA <span aria-hidden="true">↗</span></a>
        </div>
      </div>
    `;

    method.insertAdjacentElement("beforebegin", section);
    return true;
  };

  const scheduleBuild = () => window.setTimeout(buildHomeStorySection, 1000);

  if (document.readyState === "complete") {
    scheduleBuild();
  } else {
    window.addEventListener("load", scheduleBuild, { once: true });
  }

  window.addEventListener("pageshow", scheduleBuild);
})();
