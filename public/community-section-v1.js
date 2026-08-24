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
            <img src="/testimonials/karol-comissoes-2600.webp" alt="Resultado compartilhado por uma participante da comunidade" loading="lazy" decoding="async">
            <figcaption>
              <strong>Troca de experiências</strong>
              <span>Aprendizados reais entre mulheres que estão fazendo acontecer.</span>
            </figcaption>
          </figure>

          <figure class="community-card community-card--proof-two">
            <img src="/testimonials/leticia-pix-31634.webp" alt="Conquista compartilhada por uma aluna da comunidade" loading="lazy" decoding="async">
            <figcaption>
              <strong>Suporte e conexões</strong>
              <span>Orientação e incentivo para não caminhar sozinha.</span>
            </figcaption>
          </figure>

          <figure class="community-card community-card--proof-three">
            <img src="/testimonials/nay-pagamentos-tres-perfis.webp" alt="Resultados de diferentes perfis compartilhados na comunidade" loading="lazy" decoding="async">
            <figcaption>
              <strong>Crescimento em conjunto</strong>
              <span>Mulheres evoluindo e celebrando cada avanço lado a lado.</span>
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
