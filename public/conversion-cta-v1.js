(() => {
  const buildConversionSection = () => {
    if (document.querySelector("#inscricao")) return true;

    const method = document.querySelector(".method-section");
    if (!method) return false;

    const section = document.createElement("section");
    section.className = "conversion-section";
    section.id = "inscricao";
    section.setAttribute("aria-labelledby", "conversion-title");

    section.innerHTML = `
      <div class="conversion-shell">
        <img class="conversion-icon conversion-icon-heart" src="/brand/icon-heart.webp" alt="" aria-hidden="true">
        <img class="conversion-icon conversion-icon-bolt" src="/brand/icon-bolt.webp" alt="" aria-hidden="true">

        <div class="conversion-copy">
          <span class="conversion-eyebrow">✦ A DECISÃO QUE MUDA O PRÓXIMO RESULTADO</span>
          <h2 id="conversion-title">TE ENSINO A ESCALAR VENDAS<br><strong>COM MÉTODO</strong><em>E ESTRATÉGIA.</em></h2>
        </div>

        <figure class="conversion-photo">
          <img src="/assets/samanta-cta.webp" alt="Samanta trabalhando em seu notebook" loading="lazy" decoding="async">
          <figcaption><span>Samanta Vidal</span><strong>Estratégia aplicada.</strong></figcaption>
        </figure>

        <aside class="conversion-trigger">
          <small>ENQUANTO VOCÊ PROCRASTINA...</small>
          <strong>OUTRAS MULHERES ESTÃO REALIZANDO SEUS SONHOS COM O TIKTOK SHOP.</strong>
          <p>Você pode ser a próxima.</p>
        </aside>

        <div class="conversion-action">
          <a href="https://pay.kiwify.com.br/3U3ri1Z?utm_source=ig&utm_medium=social&utm_content=link_in_bio&fbclid=PAcGRvZgJleHRuA2FlbQIxMQBzcnRjBmFwcF9pZA85MzY2MTk3NDMzOTI0NTkAAaevJUkw0_uoPexeLpBD0uwAqbcykPEPqyIsY92jjdMazyQ3sDDuOGK9PuqByQ_aem_2snf6J8TOi97NbaW3-4PNw&utm_id=97760_v0_s00_e0_tv3O">QUERO ENTRAR PARA A MENTORIA <span aria-hidden="true">↗</span></a>
          <small>Turmas pensadas para acompanhamento próximo. Inscrições sujeitas à disponibilidade.</small>
        </div>
      </div>
    `;

    method.insertAdjacentElement("afterend", section);
    return true;
  };

  const scheduleBuild = () => window.setTimeout(buildConversionSection, 1050);

  if (document.readyState === "complete") {
    scheduleBuild();
  } else {
    window.addEventListener("load", scheduleBuild, { once: true });
  }

  window.addEventListener("pageshow", scheduleBuild);
})();
