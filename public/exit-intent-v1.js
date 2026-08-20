(function () {
  "use strict";

  var STORAGE_KEY = "samanta_exit_offer_state_v1";
  var COOKIE_KEY = "samanta_exit_offer_v1";
  var SESSION_SHOWN_KEY = "samanta_exit_offer_shown_v1";
  var SESSION_ID_KEY = "samanta_exit_offer_session_v1";
  var DAY = 24 * 60 * 60 * 1000;
  var pageStartedAt = Date.now();
  var shown = false;
  var submitted = false;
  var modalOpenedAt = 0;
  var previousOverflow = "";

  function safeStorage(storage, action, key, value) {
    try {
      if (action === "get") return storage.getItem(key);
      if (action === "set") storage.setItem(key, value);
    } catch (_) {
      return null;
    }
    return null;
  }

  function readState() {
    if (document.cookie.split(";").some(function (item) {
      return item.trim().indexOf(COOKIE_KEY + "=") === 0;
    })) return true;

    var raw = safeStorage(window.localStorage, "get", STORAGE_KEY);
    if (!raw) return false;
    try {
      var state = JSON.parse(raw);
      if (state && Number(state.expiresAt) > Date.now()) return true;
      window.localStorage.removeItem(STORAGE_KEY);
    } catch (_) {
      window.localStorage.removeItem(STORAGE_KEY);
    }
    return false;
  }

  function rememberState(state, days) {
    var expiresAt = Date.now() + days * DAY;
    safeStorage(window.localStorage, "set", STORAGE_KEY, JSON.stringify({
      state: state,
      expiresAt: expiresAt
    }));
    var secure = location.protocol === "https:" ? "; Secure" : "";
    document.cookie = COOKIE_KEY + "=" + encodeURIComponent(state) +
      "; Max-Age=" + Math.floor(days * DAY / 1000) + "; Path=/; SameSite=Lax" + secure;
  }

  function sessionWasShown() {
    return safeStorage(window.sessionStorage, "get", SESSION_SHOWN_KEY) === "1";
  }

  function markSessionShown() {
    safeStorage(window.sessionStorage, "set", SESSION_SHOWN_KEY, "1");
  }

  function randomSessionId() {
    var existing = safeStorage(window.sessionStorage, "get", SESSION_ID_KEY);
    if (existing) return existing;
    var id;
    if (window.crypto && typeof window.crypto.randomUUID === "function") {
      id = window.crypto.randomUUID().replace(/-/g, "_");
    } else {
      id = "session_" + Date.now().toString(36) + "_" + Math.random().toString(36).slice(2) +
        Math.random().toString(36).slice(2);
    }
    safeStorage(window.sessionStorage, "set", SESSION_ID_KEY, id);
    return id;
  }

  function buildModal() {
    var root = document.createElement("div");
    root.className = "seio-root";
    root.hidden = true;
    root.innerHTML = [
      '<div class="seio-backdrop" data-seio-close></div>',
      '<section class="seio-dialog" role="dialog" aria-modal="true" aria-labelledby="seio-title" aria-describedby="seio-description">',
        '<button class="seio-close" type="button" aria-label="Fechar oferta" data-seio-close>',
          '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>',
        '</button>',
        '<div class="seio-offer-panel">',
          '<p class="seio-kicker"><span></span> CONDIÇÃO ESPECIAL</p>',
          '<div class="seio-discount"><strong>10%</strong><span>OFF</span></div>',
          '<h2 id="seio-title">Espera!<br>Antes de ir…</h2>',
          '<p>Uma condição para você dar o próximo passo acompanhada.</p>',
          '<div class="seio-benefits" aria-label="Benefícios da comunidade">',
            '<span>Networking</span><span>Suporte</span><span>Crescimento</span>',
          '</div>',
        '</div>',
        '<div class="seio-form-panel">',
          '<div class="seio-form-copy">',
            '<p class="seio-mobile-kicker">ANTES DE SAIR…</p>',
            '<h3>Garanta <em>10% OFF</em> para entrar hoje.</h3>',
            '<p id="seio-description">Preencha seus dados e desbloqueie sua condição especial.</p>',
          '</div>',
          '<form class="seio-form" novalidate>',
            '<div class="seio-honeypot" aria-hidden="true">',
              '<label for="seio-company">Empresa</label>',
              '<input id="seio-company" name="company" type="text" tabindex="-1" autocomplete="off">',
            '</div>',
            '<label class="seio-field"><span>Nome</span>',
              '<input name="name" type="text" autocomplete="name" minlength="2" maxlength="80" placeholder="Seu nome" required>',
            '</label>',
            '<label class="seio-field"><span>E-mail</span>',
              '<input name="email" type="email" autocomplete="email" maxlength="160" placeholder="voce@email.com" required>',
            '</label>',
            '<label class="seio-field"><span>WhatsApp</span>',
              '<input name="whatsapp" type="tel" autocomplete="tel" inputmode="tel" maxlength="24" placeholder="(00) 00000-0000" required>',
            '</label>',
            '<p class="seio-status" role="status" aria-live="polite"></p>',
            '<button class="seio-submit" type="submit"><span>DESBLOQUEAR MEUS 10% OFF</span><b aria-hidden="true">→</b></button>',
            '<p class="seio-privacy">Seus dados são usados somente para validar esta solicitação.</p>',
          '</form>',
          '<div class="seio-success" hidden aria-live="polite"></div>',
        '</div>',
      '</section>'
    ].join("");
    document.body.appendChild(root);
    return root;
  }

  function createElement(tag, className, text) {
    var element = document.createElement(tag);
    if (className) element.className = className;
    if (typeof text === "string") element.textContent = text;
    return element;
  }

  function renderSuccess(root, data) {
    submitted = true;
    rememberState("offered", 30);
    var panel = root.querySelector(".seio-form-panel");
    var formCopy = root.querySelector(".seio-form-copy");
    var form = root.querySelector(".seio-form");
    var success = root.querySelector(".seio-success");
    formCopy.hidden = true;
    form.hidden = true;
    success.hidden = false;
    success.textContent = "";

    var seal = createElement("div", "seio-success-seal", "10% OFF");
    var title = createElement("h3", "", "Condição especial reservada.");
    var message = createElement("p", "seio-success-message", "");
    var benefit = data && data.benefit ? data.benefit : { kind: "pending" };
    var action;

    if (benefit.kind === "coupon" && benefit.couponCode) {
      message.textContent = "Use o código abaixo quando o checkout oficial solicitar o cupom.";
      var code = createElement("strong", "seio-coupon", String(benefit.couponCode));
      action = createElement("button", "seio-submit", "COPIAR CÓDIGO");
      action.type = "button";
      action.addEventListener("click", function () {
        navigator.clipboard.writeText(String(benefit.couponCode)).then(function () {
          action.textContent = "CÓDIGO COPIADO";
        }).catch(function () {
          action.textContent = "COPIE O CÓDIGO ACIMA";
        });
      });
      success.append(seal, title, message, code, action);
    } else if (benefit.kind === "checkout" && benefit.checkoutUrl) {
      message.textContent = "Tudo certo. Continue para o checkout oficial com a condição configurada.";
      try {
        var url = new URL(String(benefit.checkoutUrl), location.origin);
        if (url.protocol !== "https:") throw new Error("invalid protocol");
        action = createElement("a", "seio-submit seio-success-link", "CONTINUAR COM 10% OFF");
        action.href = url.toString();
        action.rel = "noopener noreferrer";
        success.append(seal, title, message, action);
      } catch (_) {
        benefit.kind = "pending";
      }
    }

    if (benefit.kind === "pending") {
      message.textContent = "Sua solicitação foi validada. A ativação oficial na Kiwify ainda está sendo configurada — nenhum desconto ou link foi inventado.";
      action = createElement("button", "seio-submit", "CONTINUAR NO SITE");
      action.type = "button";
      action.addEventListener("click", function () { closeModal(root, false); });
      success.append(seal, title, message, action);
      var note = createElement("small", "seio-pending-note", "O checkout promocional será habilitado somente com o método oficial.");
      success.appendChild(note);
    }

    panel.scrollTop = 0;
    var close = root.querySelector(".seio-close");
    if (close) close.focus();
  }

  function closeModal(root, remember) {
    if (root.hidden) return;
    root.classList.remove("is-open");
    window.setTimeout(function () { root.hidden = true; }, 190);
    document.body.style.overflow = previousOverflow;
    if (remember && !submitted) rememberState("closed", 7);
  }

  function openModal(root) {
    if (shown || readState() || sessionWasShown()) return;
    shown = true;
    modalOpenedAt = Date.now();
    markSessionShown();
    previousOverflow = document.body.style.overflow;
    root.hidden = false;
    document.body.style.overflow = "hidden";
    window.requestAnimationFrame(function () {
      root.classList.add("is-open");
      var firstInput = root.querySelector('input[name="name"]');
      if (firstInput && window.matchMedia("(min-width: 769px)").matches) firstInput.focus();
    });
  }

  function bindForm(root) {
    var form = root.querySelector(".seio-form");
    var status = root.querySelector(".seio-status");
    var submit = root.querySelector(".seio-submit");

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      status.textContent = "";
      status.classList.remove("is-error");

      var formData = new FormData(form);
      var phone = String(formData.get("whatsapp") || "").replace(/\D/g, "");
      if (!form.checkValidity() || phone.length < 10 || phone.length > 15) {
        status.textContent = "Confira nome, e-mail e WhatsApp antes de continuar.";
        status.classList.add("is-error");
        form.reportValidity();
        return;
      }

      submit.disabled = true;
      submit.classList.add("is-loading");
      submit.querySelector("span").textContent = "VALIDANDO COM SEGURANÇA…";

      fetch("/api/exit-intent", {
        method: "POST",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: String(formData.get("name") || ""),
          email: String(formData.get("email") || ""),
          whatsapp: String(formData.get("whatsapp") || ""),
          company: String(formData.get("company") || ""),
          sessionId: randomSessionId(),
          startedAt: modalOpenedAt
        })
      }).then(function (response) {
        return response.json().catch(function () { return {}; }).then(function (data) {
          if (!response.ok || !data.ok) {
            var error = new Error(data.message || "Não foi possível validar agora. Tente novamente.");
            error.status = response.status;
            throw error;
          }
          return data;
        });
      }).then(function (data) {
        rememberState("submitted", 30);
        renderSuccess(root, data);
      }).catch(function (error) {
        status.textContent = error && error.message ? error.message : "Não foi possível validar agora. Tente novamente.";
        status.classList.add("is-error");
        submit.disabled = false;
        submit.classList.remove("is-loading");
        submit.querySelector("span").textContent = "DESBLOQUEAR MEUS 10% OFF";
      });
    });
  }

  function bindClose(root) {
    root.querySelectorAll("[data-seio-close]").forEach(function (element) {
      element.addEventListener("click", function () { closeModal(root, true); });
    });
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && !root.hidden) closeModal(root, true);
    });
  }

  function bindExitSignals(root) {
    var isDesktop = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    var engaged = false;
    var upwardUntil = 0;
    var lastY = null;
    var lastMoveAt = 0;
    var maxScrollRatio = 0;
    var hiddenAt = 0;

    function markEngaged() { engaged = true; }
    window.addEventListener("pointerdown", markEngaged, { passive: true, once: true });
    window.addEventListener("keydown", markEngaged, { once: true });
    window.addEventListener("scroll", function () {
      engaged = true;
      var available = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      maxScrollRatio = Math.max(maxScrollRatio, window.scrollY / available);
    }, { passive: true });

    if (isDesktop) {
      document.addEventListener("mousemove", function (event) {
        var now = Date.now();
        if (lastY !== null && lastY - event.clientY > 4 && now - lastMoveAt < 400) {
          upwardUntil = now + 700;
        }
        lastY = event.clientY;
        lastMoveAt = now;
        engaged = true;
      }, { passive: true });

      document.addEventListener("mouseout", function (event) {
        if (
          event.relatedTarget === null &&
          event.clientY <= 8 &&
          Date.now() - pageStartedAt >= 8_000 &&
          Date.now() <= upwardUntil &&
          engaged &&
          document.visibilityState === "visible"
        ) openModal(root);
      });
      return;
    }

    document.addEventListener("visibilitychange", function () {
      if (document.visibilityState === "hidden") {
        if (Date.now() - pageStartedAt >= 30_000 && engaged && maxScrollRatio >= 0.25) {
          hiddenAt = Date.now();
        }
        return;
      }
      var awayFor = hiddenAt ? Date.now() - hiddenAt : 0;
      if (awayFor >= 1_000 && awayFor <= 3 * 60_000) {
        window.setTimeout(function () { openModal(root); }, 350);
      }
      hiddenAt = 0;
    });
  }

  function init() {
    if (readState() || sessionWasShown()) return;
    var root = buildModal();
    bindForm(root);
    bindClose(root);
    bindExitSignals(root);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();
