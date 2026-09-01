(() => {
  const selectors = [
    ".buy-button",
    ".hero-primary-cta",
    ".student-proof-cta",
    ".dreams-showcase-cta",
    ".dreams-cta",
    ".community-cta",
    ".method-sales-cta",
    ".conversion-action > a",
    ".mobile-menu-cta",
    ".exit-offer__submit",
    ".exit-offer__continue",
  ];

  const selector = selectors.join(",");

  const isArrowNode = (node) => {
    if (!(node instanceof HTMLElement)) return false;
    if (node.matches("b, i")) return true;
    const text = (node.textContent || "").trim();
    return node.tagName === "SPAN" && /^(↗|→|↘|←|↑|↓)$/.test(text);
  };

  const markLabel = (button, arrow) => {
    const directTextNodes = [...button.childNodes].filter(
      (node) => node.nodeType === Node.TEXT_NODE && node.textContent?.trim(),
    );

    if (directTextNodes.length) {
      const label = document.createElement("span");
      label.className = "sunlix-fx-label";
      const first = directTextNodes[0];
      button.insertBefore(label, first);
      directTextNodes.forEach((node) => label.append(node));
      return;
    }

    const candidates = [...button.children].filter(
      (child) => child !== arrow && !child.classList.contains("sunlix-fx-orbit"),
    );
    const label = candidates.find((child) => child.tagName === "SPAN");
    if (label instanceof HTMLElement) label.classList.add("sunlix-fx-label");
  };

  const enhanceButton = (button) => {
    if (!(button instanceof HTMLElement) || button.dataset.sunlixFxReady === "true") return;
    button.dataset.sunlixFxReady = "true";
    button.classList.add("sunlix-fx-button");

    const arrow = [...button.children].find(isArrowNode);
    if (arrow instanceof HTMLElement) arrow.classList.add("sunlix-fx-arrow");
    markLabel(button, arrow);

    const orbit = document.createElement("span");
    orbit.className = "sunlix-fx-orbit";
    orbit.setAttribute("aria-hidden", "true");
    button.append(orbit);

    let releaseTimer = 0;
    const release = () => {
      window.clearTimeout(releaseTimer);
      button.classList.remove("is-sunlix-fx-pressed");
      button.classList.remove("is-sunlix-fx-releasing");
      void button.offsetWidth;
      button.classList.add("is-sunlix-fx-releasing");
      releaseTimer = window.setTimeout(() => {
        button.classList.remove("is-sunlix-fx-releasing");
      }, 440);
    };

    button.addEventListener("pointerdown", () => {
      window.clearTimeout(releaseTimer);
      button.classList.remove("is-sunlix-fx-releasing");
      button.classList.add("is-sunlix-fx-pressed");
    });
    button.addEventListener("pointerup", release);
    button.addEventListener("pointercancel", release);
    button.addEventListener("pointerleave", () => {
      if (button.classList.contains("is-sunlix-fx-pressed")) release();
    });
  };

  const scan = (root = document) => {
    root.querySelectorAll?.(selector).forEach(enhanceButton);
    if (root instanceof HTMLElement && root.matches(selector)) enhanceButton(root);
  };

  const start = () => {
    scan();
    const observer = new MutationObserver((records) => {
      records.forEach((record) => {
        record.addedNodes.forEach((node) => {
          if (node instanceof HTMLElement) scan(node);
        });
      });
    });
    observer.observe(document.body, { childList: true, subtree: true });
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start, { once: true });
  } else {
    start();
  }
})();
