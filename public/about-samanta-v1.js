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
          <p>Vim de uma família simples do Rio Grande do Sul e comecei a trabalhar ainda muito nova, com <strong>12 anos</strong>. Já trabalhei em fábrica de calçados, loja de shopping e vivi por muito tempo a rotina da <strong>CLT</strong>. Aos <strong>20 anos</strong>, mudei de estado para transformar minha realidade. Naquela época, eu não imaginava que encontraria algo que realmente gostasse de fazer no digital.</p>
          <div class="about-samanta-collapsible">
            <p>Mas, o <strong>TikTok Shop</strong> mudou completamente a minha realidade. Hoje, trabalho com algo que faço com leveza, prazer e que me permitiu transformar não só a minha vida, mas também a da minha família. Já recebi mais de <strong>150 mil</strong> em um mês e tive mais de <strong>8 milhões</strong> faturados. Talvez seja justamente por saber de onde eu vim que eu acredito tanto que outras mulheres também podem mudar a própria história.</p>
            <button class="about-samanta-read-more" type="button" aria-expanded="false">Continuar lendo</button>
          </div>
        </div>
      </div>
    `;

    results.insertAdjacentElement("afterend", section);
    return true;
  };

  const boot = () => {
    if (buildAboutSamantaSection()) {
      const section = document.querySelector("#samanta");
      const button = section?.querySelector(".about-samanta-read-more");
      button?.addEventListener("click", () => {
        section.classList.add("is-expanded");
        button.setAttribute("aria-expanded", "true");
      }, { once: true });
      return;
    }

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
