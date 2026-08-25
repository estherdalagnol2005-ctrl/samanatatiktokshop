(() => {
  const selectors = [
    ".buy-button",
    ".hero-primary-cta",
    ".method-timeline-cta",
    ".student-proof-cta",
    ".dreams-showcase-cta",
    ".dreams-cta",
    ".home-story-cta",
    ".community-cta",
    ".method-sales-cta",
    ".conversion-action > a",
    ".mobile-menu-cta",
    ".exit-offer__submit",
    ".exit-offer__continue",
  ];

  const selector = selectors.join(",");

  const normalizeLabel = (text) => {
    const trimmed = text.replace(/\s+/g, " ").trim();
    if (!trimmed) return text;

    const lower = trimmed.toLocaleLowerCase("pt-BR");
    let normalized = lower.charAt(0).toLocaleUpperCase("pt-BR") + lower.slice(1);

    normalized = normalized
      .replace(/\bsunlix\b/gi, "Sunlix")
      .replace(/\btiktok shop\b/gi, "TikTok Shop")
      .replace(/\btiktok\b/gi, "TikTok")
      .replace(/\bkiwify\b/gi, "Kiwify");

    return normalized;
  };

  const normalizeButton = (button) => {
    if (!(button instanceof HTMLElement)) return;

    const label = button.querySelector(":scope > .sunlix-fx-label");
    if (label instanceof HTMLElement) {
      label.textContent = normalizeLabel(label.textContent || "");
      return;
    }

    const textNodes = [];
    const walker = document.createTreeWalker(button, NodeFilter.SHOW_TEXT, {
      acceptNode(node) {
        if (!node.textContent?.trim()) return NodeFilter.FILTER_REJECT;
        const parent = node.parentElement;
        if (!parent) return NodeFilter.FILTER_REJECT;
        if (parent.closest("[aria-hidden='true'], b, i, svg")) return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      },
    });

    let node;
    while ((node = walker.nextNode())) textNodes.push(node);

    textNodes.forEach((textNode) => {
      const original = textNode.textContent || "";
      const leading = original.match(/^\s*/)?.[0] || "";
      const trailing = original.match(/\s*$/)?.[0] || "";
      textNode.textContent = `${leading}${normalizeLabel(original)}${trailing}`;
    });
  };

  const scan = (root = document) => {
    root.querySelectorAll?.(selector).forEach(normalizeButton);
    if (root instanceof HTMLElement && root.matches(selector)) normalizeButton(root);
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
