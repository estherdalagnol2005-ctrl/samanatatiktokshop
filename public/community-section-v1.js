(() => {
  const checkoutUrl =
    "https://pay.kiwify.com.br/3U3ri1Z?utm_source=ig&utm_medium=social&utm_content=link_in_bio&fbclid=PAcGRvZgJleHRuA2FlbQIxMQBzcnRjBmFwcF9pZA85MzY2MTk3NDMzOTI0NTkAAaevJUkw0_uoPexeLpBD0uwAqbcykPEPqyIsY92jjdMazyQ3sDDuOGK9PuqByQ_aem_2snf6J8TOi97NbaW3-4PNw&utm_id=97760_v0_s00_e0_tv3O";

  const buildCommunitySection = () => {
    if (document.querySelector("#comunidade")) return true;

    const methodSection = document.querySelector(".method-section");
    if (!methodSection) return false;

    const section = document.createElement("section");
    section.className = "community-section";
    section.id = "comunidade";
    section.setAttribute("aria-labelledby", "community-title");

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

        <div class="community-gallery" aria-label="Momentos e resultados reais da comunidade">
          <figure class="community-card community-card--lead">
            <img src="/assets/samanta-luana.webp" alt="Samanta e Luana juntas em um encontro da comunidade" loading="lazy" decoding="async">
            <figcaption>
              <strong>Networking</strong>
              <span>Conexões reais que abrem novos caminhos.</span>
            </figcaption>
          </figure>

          <figure class="community-card community-card--proof-one">
            <img src="/testimonials/2026-08/itamires-motivacao.webp" alt="Itámires conta como as pessoas da comunidade ajudam, motivam e inspiram" loading="lazy" decoding="async">
            <figcaption>
              <strong>Troca de experiências</strong>
              <span>Pessoas que ajudam, motivam e inspiram umas às outras.</span>
            </figcaption>
          </figure>

          <figure class="community-card community-card--proof-two">
            <img src="/testimonials/2026-08/bruna-comunidade.webp" alt="Bruna celebra o orgulho de fazer parte da comunidade" loading="lazy" decoding="async">
            <figcaption>
              <strong>Pertencimento</strong>
              <span>Uma comunidade que celebra cada avanço.</span>
            </figcaption>
          </figure>

          <figure class="community-card community-card--proof-three">
            <img src="/testimonials/2026-08/jana-networking.webp" alt="Jana explica como o networking ajuda a manter a motivação e testar novas estratégias" loading="lazy" decoding="async">
            <figcaption>
              <strong>Crescimento em conjunto</strong>
              <span>Networking para manter o foco, testar e não desistir.</span>
            </figcaption>
          </figure>
        </div>
      </div>
    `;

    methodSection.insertAdjacentElement("beforebegin", section);
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
