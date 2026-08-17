(() => {
  const buildFooter = () => {
    if (document.querySelector(".site-footer")) return true;

    const conversion = document.querySelector(".conversion-section");
    if (!conversion) return false;

    const footer = document.createElement("footer");
    footer.className = "site-footer";
    footer.setAttribute("aria-label", "Rodapé");
    footer.innerHTML = `
      <div class="site-footer-shell">
        <div class="site-footer-brand">
          <a href="#top" aria-label="Sunlix, voltar ao início">
            <img src="/brand/sunlix-logo-night.svg" alt="Sunlix">
          </a>
          <p>Conteúdo com direção. Venda com intenção.</p>
        </div>

        <nav class="site-footer-nav" aria-label="Navegação do rodapé">
          <a href="#top">Início</a>
          <a href="#depoimentos">Depoimentos</a>
          <a href="#resultados">Resultados</a>
          <a href="#jornada">Método</a>
        </nav>

        <a class="site-footer-cta" href="#inscricao">
          QUERO ENTRAR PARA A MENTORIA <span aria-hidden="true">↗</span>
        </a>

        <div class="site-footer-bottom">
          <span>© 2026 Samanta Vidal. Todos os direitos reservados.</span>
          <span>Samanta + Luana · Comunidade Sangue</span>
        </div>
      </div>
    `;

    conversion.insertAdjacentElement("afterend", footer);
    return true;
  };

  const scheduleBuild = () => window.setTimeout(buildFooter, 1120);

  if (document.readyState === "complete") {
    scheduleBuild();
  } else {
    window.addEventListener("load", scheduleBuild, { once: true });
  }

  window.addEventListener("pageshow", scheduleBuild);
})();
