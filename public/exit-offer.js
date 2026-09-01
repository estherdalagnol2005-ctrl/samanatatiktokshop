(() => {
  const SUPPRESSION_KEY = "sunlix-exit-offer-until-v2";
  const SESSION_KEY = "sunlix-exit-offer-seen-v2";
  const DEFAULT_SUPPRESSION_DAYS = 7;
  const AUTO_SHOW_MS = 100_000;
  const DESKTOP_EXIT_INTENT_MIN_MS = 20_000;
  const startedAt = Date.now();
  const desktopPointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  let opened = false;
  let opener = null;
  let modal = null;
  let sessionReady = false;
  let autoShowTimer = 0;

  const isSuppressed = () => {
    try {
      return sessionStorage.getItem(SESSION_KEY) === "1" || Number(localStorage.getItem(SUPPRESSION_KEY) || 0) > Date.now();
    } catch {
      return opened;
    }
  };

  const suppress = (days = DEFAULT_SUPPRESSION_DAYS) => {
    try {
      sessionStorage.setItem(SESSION_KEY, "1");
      localStorage.setItem(SUPPRESSION_KEY, String(Date.now() + days * 86_400_000));
    } catch {
      // Browser storage only improves display frequency; server-side checks protect the offer.
    }
  };

  const setModalState = (isOpen) => {
    document.dispatchEvent(new CustomEvent("site:modal", { detail: { open: isOpen } }));
  };

  const close = () => {
    if (!modal || modal.hidden) return;
    suppress();
    modal.hidden = true;
    setModalState(false);
    opener?.focus?.();
  };

  const createModal = () => {
    if (modal) return modal;
    modal = document.createElement("section");
    modal.className = "exit-offer";
    modal.hidden = true;
    modal.setAttribute("aria-label", "Oferta especial de 10% OFF");
    modal.innerHTML = `
      <div class="exit-offer__backdrop" data-exit-offer-close></div>
      <div class="exit-offer__dialog" role="dialog" aria-modal="true" aria-labelledby="exit-offer-title">
        <button class="exit-offer__close" type="button" aria-label="Fechar oferta" data-exit-offer-close>×</button>
        <div class="exit-offer__content">
          <p class="exit-offer__eyebrow">CONDIÇÃO ESPECIAL</p>
          <h2 id="exit-offer-title">Você acabou de ganhar uma condição especial pra mudar sua realidade através do TikTok Shop!</h2>
          <p class="exit-offer__copy">Preencha seus dados e libere sua condição especial.</p>
          <form class="exit-offer__form" novalidate>
            <label class="exit-offer__field">NOME<input name="name" type="text" autocomplete="name" maxlength="80" required></label>
            <label class="exit-offer__field">E-MAIL<input name="email" type="email" autocomplete="email" maxlength="254" required></label>
            <label class="exit-offer__field">WHATSAPP<input name="whatsapp" type="tel" autocomplete="tel" inputmode="tel" maxlength="24" required></label>
            <label class="exit-offer__honeypot" aria-hidden="true">Não preencha este campo<input name="website" type="text" tabindex="-1" autocomplete="off"></label>
            <p class="exit-offer__error" aria-live="polite"></p>
            <button class="exit-offer__submit" type="submit" disabled>LIBERAR MEU 10% OFF</button>
          </form>
        </div>
      </div>`;
    modal.addEventListener("click", (event) => {
      if (event.target instanceof Element && event.target.closest("[data-exit-offer-close]")) close();
    });
    modal.querySelector("form")?.addEventListener("submit", submitLead);
    document.body.append(modal);
    return modal;
  };

  const prepareSession = async () => {
    try {
      const response = await fetch("/api/exit-offer/session", { method: "POST", credentials: "same-origin" });
      if (!response.ok) throw new Error("session");
      sessionReady = true;
      modal?.querySelector(".exit-offer__submit")?.removeAttribute("disabled");
    } catch {
      const error = modal?.querySelector(".exit-offer__error");
      if (error) error.textContent = "Não foi possível preparar a oferta agora.";
    }
  };

  const show = () => {
    if (opened || isSuppressed()) return;
    opened = true;
    window.clearTimeout(autoShowTimer);
    opener = document.activeElement;
    const node = createModal();
    node.hidden = false;
    setModalState(true);
    node.querySelector("input[name='name']")?.focus();
    void prepareSession();
  };

  const validClientInput = (form) => {
    const name = String(form.elements.name.value || "").trim();
    const email = String(form.elements.email.value || "").trim();
    const phone = String(form.elements.whatsapp.value || "").replace(/\D/g, "");
    return name.length >= 2 && name.length <= 80 && /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/u.test(email) && phone.length >= 10 && phone.length <= 13;
  };

  async function submitLead(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const error = form.querySelector(".exit-offer__error");
    const button = form.querySelector("button[type='submit']");
    if (!sessionReady) {
      error.textContent = "Aguarde um instante e tente novamente.";
      return;
    }
    if (!validClientInput(form)) {
      error.textContent = "Confira nome, e-mail e WhatsApp.";
      return;
    }
    error.textContent = "";
    button.disabled = true;
    button.textContent = "LIBERANDO…";
    const data = new FormData(form);
    try {
      const response = await fetch("/api/exit-offer", {
        method: "POST",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.get("name"), email: data.get("email"), whatsapp: data.get("whatsapp"), website: data.get("website"),
        }),
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok || !result.success) throw new Error(result.error || "Não foi possível liberar a condição agora.");
      suppress(Number.isInteger(result.suppressionDays) ? result.suppressionDays : DEFAULT_SUPPRESSION_DAYS);
      renderSuccess(result);
    } catch (exception) {
      error.textContent = exception instanceof Error ? exception.message : "Não foi possível liberar a condição agora.";
      button.disabled = false;
      button.textContent = "LIBERAR MEU 10% OFF";
    }
  }

  const renderSuccess = (result) => {
    const content = modal?.querySelector(".exit-offer__content");
    if (!content) return;
    content.replaceChildren();
    const success = document.createElement("div");
    success.className = "exit-offer__success";
    success.innerHTML = "<div class=\"exit-offer__success-mark\" aria-hidden=\"true\">✓</div><p class=\"exit-offer__eyebrow\">CONDIÇÃO LIBERADA</p><h2>Pronto!<strong>Sua condição foi registrada.</strong></h2>";
    if (typeof result.couponCode === "string" && result.couponCode) {
      const note = document.createElement("p");
      note.className = "exit-offer__copy";
      note.textContent = "Use este código no checkout:";
      const code = document.createElement("div");
      code.className = "exit-offer__coupon";
      code.textContent = result.couponCode;
      success.append(note, code);
    }
    const continueCta = createContinueCta(result);
    if (continueCta) success.append(continueCta);
    content.append(success);
    modal?.querySelector(".exit-offer__close")?.focus();
  };

  const createContinueCta = (result) => {
    if (typeof result.discountCheckoutUrl === "string" && /^https:\/\//i.test(result.discountCheckoutUrl)) {
      const link = document.createElement("a");
      link.className = "exit-offer__continue";
      link.href = result.discountCheckoutUrl;
      link.textContent = "CONTINUAR PARA A COMPRA";
      return link;
    }
    if (typeof result.couponCode === "string" && result.couponCode) {
      const button = document.createElement("button");
      button.className = "exit-offer__continue";
      button.type = "button";
      button.textContent = "CONTINUAR PARA A COMPRA";
      button.addEventListener("click", () => {
        const checkout = document.querySelector(".buy-button[href^='http']");
        if (checkout instanceof HTMLAnchorElement) window.location.assign(checkout.href);
        else close();
      });
      return button;
    }
    const button = document.createElement("button");
    button.className = "exit-offer__continue";
    button.type = "button";
    button.textContent = "VOLTAR AO SITE";
    button.addEventListener("click", close);
    return button;
  };

  document.addEventListener("keydown", (event) => { if (event.key === "Escape") close(); });

  autoShowTimer = window.setTimeout(show, AUTO_SHOW_MS);

  if (desktopPointer) {
    document.addEventListener("mouseout", (event) => {
      if (Date.now() - startedAt < DESKTOP_EXIT_INTENT_MIN_MS || event.relatedTarget || event.clientY > 4) return;
      show();
    });
  }
})();
