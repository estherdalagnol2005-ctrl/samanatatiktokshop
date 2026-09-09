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
          <h2 id="about-samanta-title">Prazer, eu sou a <strong>Samanta.</strong></h2>
          <p>Vim de uma família simples do Rio Grande do Sul e comecei a trabalhar ainda muito nova, com 12 anos. Já trabalhei em fábrica de calçados, loja de shopping e vivi por muito tempo a rotina da CLT.</p>
          <p>Aos 20 anos, mudei de estado para transformar minha realidade. Naquela época, eu não imaginava que encontraria algo que realmente gostasse de fazer no digital.</p>
          <p>Mas, o TikTok Shop mudou completamente a minha realidade. Hoje, trabalho com algo que faço com leveza, prazer e que me permitiu transformar não só a minha vida, mas também a da minha família. Já recebi mais de 150 mil em um mês e tive mais de 8 milhões faturados. Talvez seja justamente por saber de onde eu vim que eu acredito tanto que outras mulheres também podem mudar a própria história.</p>
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
