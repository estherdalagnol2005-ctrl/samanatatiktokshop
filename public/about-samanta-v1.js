(() => {
  const buildAboutSamantaSection = () => {
    if (document.querySelector("#samanta")) return true;

    const results = document.querySelector("#resultados");
    if (!results) return false;

    const section = document.createElement("section");
    section.className = "about-samanta-section";
    section.id = "samanta";
    section.setAttribute("aria-labelledby", "about-samanta-title");

    section.innerHTML = `
      <div class="about-samanta-shell">
        <figure class="about-samanta-photo">
          <img
            src="/assets/dreams-2026/evento-criadores.webp"
            alt="Samanta Vidal sorrindo durante um evento de criadores"
            loading="lazy"
            decoding="async"
            width="490"
            height="632"
          >
        </figure>

        <div class="about-samanta-copy">
          <span class="about-samanta-eyebrow">QUEM ESTÁ POR TRÁS DA SUNLIX</span>
          <h2 id="about-samanta-title">Prazer, eu sou a <strong>Samanta.</strong></h2>
          <p>Eu saí do CLT e encontrei no TikTok Shop um caminho para transformar conteúdo em liberdade. O que começou como uma nova possibilidade mudou completamente a minha realidade.</p>
          <p>Em um ano, faturei mais de R$ 6 milhões sendo eu mesma, com a minha personalidade e uma estratégia prática que realmente funciona.</p>
          <p class="about-samanta-purpose">Hoje, meu propósito é ensinar outras mulheres a saírem da média, largarem o CLT e conquistarem sua liberdade financeira.</p>
        </div>
      </div>
    `;

    results.insertAdjacentElement("afterend", section);
    return true;
  };

  const boot = () => {
    if (buildAboutSamantaSection()) return;

    const observer = new MutationObserver(() => {
      if (buildAboutSamantaSection()) observer.disconnect();
    });
    observer.observe(document.documentElement, { childList: true, subtree: true });
    window.setTimeout(() => observer.disconnect(), 2500);
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot, { once: true });
  } else {
    boot();
  }

  window.addEventListener("pageshow", boot);
})();
