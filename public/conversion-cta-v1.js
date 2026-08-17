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
          <h2 id="conversion-title">PARE DE POSTAR<br><strong>NO ESCURO.</strong><em>VENDA COM DIREÇÃO.</em></h2>
          <p>Na mentoria, Samanta e Luana mostram como escolher produtos com demanda, criar conteúdo com intenção e repetir o que realmente gera venda no TikTok Shop.</p>
          <div class="conversion-chips" aria-label="O que a mentoria organiza">
            <span>Produto com demanda</span>
            <span>Conteúdo com intenção</span>
            <span>Leitura para repetir</span>
          </div>
        </div>

        <figure class="conversion-photo">
          <img src="/assets/samanta-cta.webp" alt="Samanta trabalhando em seu notebook" loading="lazy" decoding="async">
          <figcaption><span>Samanta Vidal</span><strong>Estratégia aplicada.</strong></figcaption>
        </figure>

        <aside class="conversion-trigger">
          <small>ENQUANTO VOCÊ ADIA...</small>
          <strong>OUTRAS CRIADORAS TESTAM, APRENDEM E OCUPAM ESPAÇO.</strong>
          <p>Você não precisa de mais tentativa. Precisa de um processo que mostre o que fazer — e por quê.</p>
        </aside>

        <div class="conversion-action">
          <a href="#jornada">QUERO ENTRAR PARA A MENTORIA <span aria-hidden="true">↗</span></a>
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
