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

          <div class="community-topics" aria-label="O que você encontra na comunidade">
            <span>Networking</span><i aria-hidden="true">•</i>
            <span>Troca de experiências</span><i aria-hidden="true">•</i>
            <span>Suporte</span><i aria-hidden="true">•</i>
            <span>Conexões</span><i aria-hidden="true">•</i>
            <span>Crescimento em conjunto</span>
          </div>

          <a class="community-cta" href="${checkoutUrl}" target="_blank" rel="noopener noreferrer">
            QUERO FAZER PARTE DESSA COMUNIDADE
            <span aria-hidden="true">↗</span>
          </a>
          <small class="community-note">Conhecimento abre o caminho. Uma comunidade faz você continuar nele.</small>
        </div>

        <div class="community-gallery" aria-label="Momentos e resultados reais da Comunidade Sangue">
          <figure class="community-card community-card--lead">
            <img src="/assets/samanta-luana.webp" alt="Samanta e Luana, líderes da Comunidade Sangue" loading="lazy" decoding="async">
            <figcaption>
              <strong>Juntas desde o começo</strong>
              <span>Duas sócias e uma comunidade inteira crescendo.</span>
            </figcaption>
          </figure>

          <figure class="community-card community-card--proof-one">
            <img src="/testimonials/karol-comissoes-2600.webp" alt="Resultado compartilhado por uma participante da comunidade" loading="lazy" decoding="async">
            <figcaption>
              <strong>Vitórias compartilhadas</strong>
              <span>Cada avanço inspira o próximo.</span>
            </figcaption>
          </figure>

          <figure class="community-card community-card--proof-two">
            <img src="/testimonials/leticia-pix-31634.webp" alt="Conquista compartilhada por uma aluna da comunidade" loading="lazy" decoding="async">
            <figcaption>
              <strong>Troca que movimenta</strong>
              <span>Experiências reais, sem caminhar sozinha.</span>
            </figcaption>
          </figure>

          <figure class="community-card community-card--proof-three">
            <img src="/testimonials/nay-pagamentos-tres-perfis.webp" alt="Resultados de diferentes perfis compartilhados na comunidade" loading="lazy" decoding="async">
            <figcaption>
              <strong>Crescimento em conjunto</strong>
              <span>Mulheres construindo e evoluindo lado a lado.</span>
            </figcaption>
          </figure>

          <div class="community-gallery-badge" aria-hidden="true">
            <strong>COMUNIDADE SANGUE</strong>
            <span>troca • suporte • conexão</span>
          </div>
        </div>
      </div>
    `;

    methodSection.insertAdjacentElement("beforebegin", section);
    return true;
  };

  const initialize = () => {
    buildCommunitySection();

    const root = document.querySelector(".page-shell") || document.body;
    const observer = new MutationObserver(() => {
      buildCommunitySection();
    });

    observer.observe(root, { childList: true, subtree: true });

    window.setTimeout(() => {
      buildCommunitySection();
      observer.disconnect();
    }, 3000);
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initialize, { once: true });
  } else {
    initialize();
  }

  window.addEventListener("pageshow", buildCommunitySection);
})();
