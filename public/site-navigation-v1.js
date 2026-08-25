(() => {
  const sectionLinks = [
    { href: "#jornada", label: "Método" },
    { href: "#depoimentos", label: "Depoimentos" },
    { href: "#resultados", label: "Conquistas" },
  ];

  const buildNavigation = () => {
    const header = document.querySelector(".site-header");
    const desktopNav = header?.querySelector(".desktop-nav");
    const buyButton = header?.querySelector(".buy-button");

    if (!header || !desktopNav || header.dataset.fullNavigationReady === "true") {
      return Boolean(header);
    }

    header.dataset.fullNavigationReady = "true";
    desktopNav.replaceChildren(
      ...sectionLinks.map(({ href, label }) => {
        const link = document.createElement("a");
        link.href = href;
        link.textContent = label;
        return link;
      }),
    );
    desktopNav.style.gridTemplateColumns = `repeat(${sectionLinks.length}, minmax(0, 1fr))`;
    desktopNav.style.width = "min(100%, 640px)";
    desktopNav.style.gap = "0";

    if (buyButton) buyButton.href = "#inscricao";

    const toggle = document.createElement("button");
    toggle.className = "mobile-menu-toggle";
    toggle.type = "button";
    toggle.setAttribute("aria-label", "Abrir menu");
    toggle.setAttribute("aria-controls", "mobile-site-menu");
    toggle.setAttribute("aria-expanded", "false");
    toggle.innerHTML = '<span aria-hidden="true"><i></i><i></i><i></i></span>';
    header.append(toggle);

    const layer = document.createElement("div");
    layer.className = "mobile-menu-layer";
    layer.id = "mobile-site-menu";
    layer.setAttribute("aria-hidden", "true");
    layer.inert = true;
    layer.innerHTML = `
      <button class="mobile-menu-backdrop" type="button" aria-label="Fechar menu"></button>
      <aside class="mobile-menu-panel" aria-label="Menu do site">
        <header class="mobile-menu-topbar">
          <a class="mobile-menu-brand" href="#top" aria-label="Sunlix, início">
            <img src="/brand/sunlix-logo-night.svg" alt="Sunlix" />
          </a>
          <button class="mobile-menu-close" type="button" aria-label="Fechar menu">
            <i aria-hidden="true"></i>
          </button>
        </header>
        <div class="mobile-menu-content">
          <span class="mobile-menu-kicker">NAVEGAÇÃO</span>
          <nav class="mobile-menu-links" aria-label="Navegação no celular">
            ${[{ href: "#top", label: "Início" }, ...sectionLinks]
              .map(
                ({ href, label }) => `
                  <a href="${href}">
                    <span>${label}</span>
                  </a>`,
              )
              .join("")}
          </nav>
          <a class="mobile-menu-cta" href="#inscricao">
            <span>QUERO FAZER PARTE DA SUNLIX</span>
            <b aria-hidden="true"></b>
          </a>
        </div>
        <p class="mobile-menu-signature">Conteúdo com direção. Venda com intenção.</p>
      </aside>`;
    document.body.append(layer);

    const closeButton = layer.querySelector(".mobile-menu-close");
    const backdrop = layer.querySelector(".mobile-menu-backdrop");
    const menuLinks = [
      ...layer.querySelectorAll(".mobile-menu-links a, .mobile-menu-cta, .mobile-menu-brand"),
    ];
    let restoreFocus = null;

    const openMenu = () => {
      restoreFocus = document.activeElement;
      layer.inert = false;
      layer.setAttribute("aria-hidden", "false");
      toggle.setAttribute("aria-expanded", "true");
      toggle.setAttribute("aria-label", "Fechar menu");
      document.body.classList.add("is-mobile-menu-open");
      window.requestAnimationFrame(() => {
        layer.classList.add("is-open");
        closeButton?.focus({ preventScroll: true });
      });
    };

    const closeMenu = ({ returnFocus = true } = {}) => {
      layer.classList.remove("is-open");
      layer.setAttribute("aria-hidden", "true");
      toggle.setAttribute("aria-expanded", "false");
      toggle.setAttribute("aria-label", "Abrir menu");
      document.body.classList.remove("is-mobile-menu-open");

      window.setTimeout(() => {
        if (!layer.classList.contains("is-open")) layer.inert = true;
      }, 360);

      if (returnFocus && restoreFocus instanceof HTMLElement) {
        restoreFocus.focus({ preventScroll: true });
      }
    };

    toggle.addEventListener("click", () => {
      if (layer.classList.contains("is-open")) closeMenu();
      else openMenu();
    });
    closeButton?.addEventListener("click", () => closeMenu());
    backdrop?.addEventListener("click", () => closeMenu());
    menuLinks.forEach((link) => {
      link.addEventListener("click", () => closeMenu({ returnFocus: false }));
    });

    document.addEventListener("keydown", (event) => {
      if (!layer.classList.contains("is-open")) return;

      if (event.key === "Escape") {
        event.preventDefault();
        closeMenu();
        return;
      }

      if (event.key !== "Tab") return;
      const focusable = [closeButton, ...menuLinks].filter(Boolean);
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    });

    const desktopQuery = window.matchMedia("(min-width: 1180px)");
    desktopQuery.addEventListener("change", ({ matches }) => {
      if (matches && layer.classList.contains("is-open")) {
        closeMenu({ returnFocus: false });
      }
    });

    return true;
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", buildNavigation, { once: true });
  } else {
    buildNavigation();
  }

  window.addEventListener("pageshow", buildNavigation);
})();
