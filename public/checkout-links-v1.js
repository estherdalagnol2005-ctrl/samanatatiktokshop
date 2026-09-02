(() => {
  const checkout = new URL("https://pay.kiwify.com.br/3U3ri1Z");
  const entry = new URLSearchParams(window.location.search);
  // Preservar somente UTMs desta visita; nunca reutilizar o fbclid de outra pessoa.
  ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "utm_id"].forEach(key => {
    const value = entry.get(key);
    if (value && /^[\\p{L}\\p{N}_ .-]{1,120}$/u.test(value)) checkout.searchParams.set(key, value);
  });
  const checkoutUrl = checkout.href;
  const selector = ".buy-button,.hero-primary-cta,.student-proof-cta,.community-cta,.method-timeline-cta,#inscricao a,.site-footer-cta,.dreams-showcase-cta,.dreams-cta,.home-story-cta,.method-sales-cta";
  const apply = () => document.querySelectorAll(selector).forEach(link => {
    if (link instanceof HTMLAnchorElement && link.href !== checkoutUrl) link.href = checkoutUrl;
  });
  document.addEventListener("click", event => {
    const link = event.target instanceof Element ? event.target.closest("a") : null;
    if (link?.matches(selector)) link.href = checkoutUrl;
  }, true);
  apply();
  const observer = new MutationObserver(apply);
  observer.observe(document.body, { childList: true, subtree: true });
  window.setTimeout(() => observer.disconnect(), 5000);
  window.addEventListener("pageshow", apply);
})();
