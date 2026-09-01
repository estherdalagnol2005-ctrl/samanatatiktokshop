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

        <a class="site-footer-cta" href="https://pay.kiwify.com.br/3U3ri1Z?utm_source=ig&utm_medium=social&utm_content=link_in_bio&fbclid=PAcGRvZgJleHRuA2FlbQIxMQBzcnRjBmFwcF9pZA85MzY2MTk3NDMzOTI0NTkAAaevJUkw0_uoPexeLpBD0uwAqbcykPEPqyIsY92jjdMazyQ3sDDuOGK9PuqByQ_aem_2snf6J8TOi97NbaW3-4PNw&utm_id=97760_v0_s00_e0_tv3O">
          QUERO ENTRAR PARA A MENTORIA <span aria-hidden="true">↗</span>
        </a>

        <div class="site-footer-bottom">
          <span>© 2026 Samanta Vidal. Todos os direitos reservados.</span>
          <a href="https://linkanext.vercel.app/" target="_blank" rel="noopener noreferrer">Desenvolvido pela Linka Digital</a>
        </div>
      </div>
    `;

    conversion.insertAdjacentElement("afterend", footer);
    return true;
  };

  const boot = () => {
    if (buildFooter()) return;

    const observer = new MutationObserver(() => {
      if (buildFooter()) observer.disconnect();
    });
    observer.observe(document.body, { childList: true, subtree: true });
    window.setTimeout(() => observer.disconnect(), 2500);
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot, { once: true });
  } else {
    boot();
  }

  window.addEventListener("pageshow", boot);
})();
