/* TODO: informar GOOGLE_ANALYTICS_ID e MICROSOFT_CLARITY_ID na Vercel.
 * TODO: conectar a CMP real a sunlixSetAnalyticsConsent(true/false).
 * Consentimento negado por padrão; checkbox de marketing do lead é independente.
 * Nenhum campo, e-mail, telefone, nome ou cupom é enviado aos rastreadores.
 */
(() => {
  const configNode = document.getElementById("sunlix-public-config");
  if (!configNode) return;
  const config = JSON.parse(configNode.textContent || "{}");
  let enabled = false;
  let loaded = false;
  const load = (src) => {
    const script = document.createElement("script");
    script.async = true;
    script.src = src;
    document.head.append(script);
  };
  window.sunlixSetAnalyticsConsent = (allowed) => {
    const previouslyEnabled = enabled;
    enabled = allowed === true && navigator.globalPrivacyControl !== true;
    if (config.gaId) window[`ga-disable-${config.gaId}`] = !enabled;
    if (!enabled) {
      window.gtag?.("consent", "update", { analytics_storage: "denied", ad_storage: "denied", ad_user_data: "denied", ad_personalization: "denied" });
      window.clarity?.("consentv2", { ad_Storage: "denied", analytics_Storage: "denied" });
      // A CMP deve persistir a revogação ANTES deste callback. Recarregar descarrega
      // scripts de sessão já carregados e mantém o modo padrão sem rastreadores.
      if (previouslyEnabled && loaded) window.location.reload();
      return;
    }
    if (loaded) return;
    loaded = true;
    if (config.gaId) {
      window.dataLayer = window.dataLayer || [];
      window.gtag = function () { window.dataLayer.push(arguments); };
      window.gtag("consent", "default", { analytics_storage: "granted", ad_storage: "denied", ad_user_data: "denied", ad_personalization: "denied" });
      window.gtag("js", new Date());
      // URL limpa: não enviar parâmetros arbitrários que possam conter dados pessoais.
      const campaign = {};
      const params = new URLSearchParams(window.location.search);
      for (const [utm, field] of Object.entries({ source: "source", medium: "medium", campaign: "name", id: "id", term: "term", content: "content" })) {
        const value = params.get(`utm_${utm}`);
        if (value && /^[\p{L}\p{N}_ .-]{1,120}$/u.test(value)) campaign[`campaign_${field}`] = value;
      }
      window.gtag("config", config.gaId, { ...campaign, page_location: `${config.siteUrl}/`, page_referrer: document.referrer ? new URL(document.referrer).origin : "", allow_google_signals: false, allow_ad_personalization_signals: false });
      load(`https://www.googletagmanager.com/gtag/js?id=${config.gaId}`);
    }
    if (config.clarityId) {
      window.clarity = window.clarity || function () { (window.clarity.q = window.clarity.q || []).push(arguments); };
      window.clarity("consentv2", { ad_Storage: "denied", analytics_Storage: "granted" });
      load(`https://www.clarity.ms/tag/${config.clarityId}`);
    }
  };
  document.addEventListener("sunlix:lead-saved", () => {
    if (!enabled) return;
    window.gtag?.("event", "generate_lead", { method: "exit_offer" });
    window.clarity?.("event", "lead_saved");
  });
  document.addEventListener("click", (event) => {
    const link = event.target instanceof Element ? event.target.closest("a[href]") : null;
    if (!enabled || !link || new URL(link.href).hostname !== "pay.kiwify.com.br") return;
    window.gtag?.("event", "click_checkout", { link_domain: "pay.kiwify.com.br" });
    window.clarity?.("event", "checkout_click");
  });
  // A CMP pode ouvir este evento para reaplicar uma escolha já registrada.
  document.dispatchEvent(new Event("sunlix:analytics-ready"));
})();
