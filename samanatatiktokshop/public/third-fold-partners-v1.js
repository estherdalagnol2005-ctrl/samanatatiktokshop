(() => {
  const enhancePartnersSection = () => {
    const section = document.querySelector(".method-section");
    if (!section) return;

    section.setAttribute(
      "aria-label",
      "Método de Samanta e Luana na Comunidade Sangue",
    );

    const photo = section.querySelector(
      ".method-timeline-photo > img:not(.method-timeline-bolt)",
    );
    if (photo) {
      photo.src = "/assets/samanta-luana.webp";
      photo.alt =
        "Samanta e Luana, sócias e criadoras de um método para TikTok Shop";
      photo.loading = "lazy";
      photo.decoding = "async";
    }

    const label = section.querySelector(".method-timeline-photo-label");
    if (label) {
      const dot = label.querySelector("i") || document.createElement("i");
      dot.setAttribute("aria-hidden", "true");
      label.replaceChildren(
        dot,
        document.createTextNode(
          " Samanta + Luana · sócias na Comunidade Sangue",
        ),
      );
    }

    const timeline = section.querySelector(".method-timeline");
    timeline?.setAttribute(
      "aria-label",
      "Atenção, desejo e chamada para ação",
    );

    const introParagraph = section.querySelector(".method-timeline-copy > p");
    if (introParagraph) {
      introParagraph.textContent =
        "Um método direto para transformar conteúdo em venda no TikTok Shop.";
    }

    const stepCopy = [
      ["01", "ATENÇÃO.", "Pare o scroll."],
      ["02", "DESEJO.", "Faça querer."],
      ["03", "CTA.", "Chame para a ação."],
    ];

    const steps = section.querySelectorAll(".method-timeline-steps article");
    steps.forEach((step, index) => {
      const content = stepCopy[index];
      if (!content) return;

      const small = step.querySelector("small");
      const title = step.querySelector("h3");
      const paragraph = step.querySelector("p");

      if (small) small.textContent = content[0];
      if (title) title.textContent = content[1];
      if (paragraph) paragraph.textContent = content[2];
    });

    const shell = section.querySelector(".method-timeline-shell");
    const media = timeline?.querySelector(".method-timeline-media");
    const copy = section.querySelector(".method-timeline-copy");

    if (shell && timeline && media && copy) {
      let intro = shell.querySelector(".method-partners-intro");

      if (!intro) {
        intro = document.createElement("div");
        intro.className = "method-partners-intro";
        shell.insertBefore(intro, timeline);
      }

      intro.append(media, copy);
      section.classList.add("method-layout-v2");
    }

    const cta = section.querySelector(".method-timeline-cta");
    if (cta) {
      const arrow = cta.querySelector("span") || document.createElement("span");
      arrow.setAttribute("aria-hidden", "true");
      arrow.textContent = "↗";
      cta.replaceChildren(
        document.createTextNode("Quero aprender o método delas "),
        arrow,
      );
    }

    if (!copy || copy.querySelector(".method-proof-grid")) return;

    const proof = document.createElement("div");
    proof.className = "method-proof-grid";
    proof.setAttribute("aria-label", "Resultados ilustrativos do método");

    const items = [
      ["+250", "mulheres guiadas pelo método"],
      ["+R$ 1,8 mi", "em vendas geradas pelas alunas"],
    ];

    for (const [value, description] of items) {
      const card = document.createElement("div");
      card.className = "method-proof-card";

      const strong = document.createElement("strong");
      strong.textContent = value;

      const span = document.createElement("span");
      span.textContent = description;

      card.append(strong, span);
      proof.append(card);
    }

    const note = document.createElement("p");
    note.className = "method-proof-note";
    note.textContent =
      "*Dados ilustrativos para visualização desta proposta.";
    proof.append(note);
    copy.append(proof);
  };

  const scheduleEnhancement = () => {
    window.setTimeout(enhancePartnersSection, 900);
  };

  if (document.readyState === "complete") {
    scheduleEnhancement();
  } else {
    window.addEventListener("load", scheduleEnhancement, { once: true });
  }

  window.addEventListener("pageshow", scheduleEnhancement);
})();
