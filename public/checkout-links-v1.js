(() => {
  const checkoutUrl =
    "https://pay.kiwify.com.br/3U3ri1Z?utm_source=ig&utm_medium=social&utm_content=link_in_bio&fbclid=PAcGRvZgJleHRuA2FlbQIxMQBzcnRjBmFwcF9pZA85MzY2MTk3NDMzOTI0NTkAAaevJUkw0_uoPexeLpBD0uwAqbcykPEPqyIsY92jjdMazyQ3sDDuOGK9PuqByQ_aem_2snf6J8TOi97NbaW3-4PNw&utm_id=97760_v0_s00_e0_tv3O";

  const commercialCtaSelector = [
    ".buy-button",
    ".hero-primary-cta",
    ".student-proof-cta",
    ".community-cta",
    ".method-timeline-cta",
    "#inscricao a",
    ".site-footer-cta",
    ".dreams-showcase-cta",
    ".dreams-cta",
  ].join(",");

  const applyCheckoutUrl = () => {
    document.querySelectorAll(commercialCtaSelector).forEach((link) => {
      if (link instanceof HTMLAnchorElement) {
        link.setAttribute("href", checkoutUrl);
      }
    });
  };

  document.addEventListener(
    "click",
    (event) => {
      if (!(event.target instanceof Element)) return;

      const link = event.target.closest("a");
      if (!link || !link.matches(commercialCtaSelector)) return;

      link.setAttribute("href", checkoutUrl);
    },
    true,
  );

  const scheduleNormalization = () => {
    window.setTimeout(() => {
      applyCheckoutUrl();

      const root = document.querySelector(".page-shell") || document.body;
      const observer = new MutationObserver(applyCheckoutUrl);
      observer.observe(root, { childList: true, subtree: true });

      window.setTimeout(() => {
        applyCheckoutUrl();
        observer.disconnect();
      }, 5000);
    }, 1200);
  };

  if (document.readyState === "complete") {
    scheduleNormalization();
  } else {
    window.addEventListener("load", scheduleNormalization, { once: true });
  }

  window.addEventListener("pageshow", scheduleNormalization);
})();
