(() => {
  const checkoutUrl =
    "https://pay.kiwify.com.br/3U3ri1Z?utm_source=ig&utm_medium=social&utm_content=link_in_bio&fbclid=PAcGRvZgJleHRuA2FlbQIxMQBzcnRjBmFwcF9pZA85MzY2MTk3NDMzOTI0NTkAAaevJUkw0_uoPexeLpBD0uwAqbcykPEPqyIsY92jjdMazyQ3sDDuOGK9PuqByQ_aem_2snf6J8TOi97NbaW3-4PNw&utm_id=97760_v0_s00_e0_tv3O";

  const steps = [
    { title: "Está começando do zero", text: "Você quer direção desde o primeiro produto, sem perder tempo tentando descobrir tudo sozinha." },
    { title: "Já comprou outros cursos e não conseguiu vender", text: "Você estudou, tentou aplicar, mas ainda não encontrou um processo que transforme conhecimento em resultado." },
    { title: "Já tentou de tudo, mas travou em um resultado", text: "Você consegue vender, porém não sabe o que ajustar para ultrapassar o número em que parou." },
    { title: "Vende, porém quer aprender a escalar produtos e faturar mais", text: "Você quer repetir o que funciona, crescer com estratégia e transformar vendas em uma operação." },
  ];

  const setActiveStep = (section, activeIndex, progress) => {
    const stepItems = section.querySelectorAll(".method-sales-step");
    section.style.setProperty("--method-progress", `${progress.toFixed(2)}%`);
    section.dataset.activeMethodStep = String(activeIndex + 1);

    stepItems.forEach((item, index) => {
      item.classList.toggle("is-active", index === activeIndex);
      item.classList.toggle("is-complete", index < activeIndex);
      item.toggleAttribute("aria-current", index === activeIndex);
    });
  };

  const setupMethodProgress = (section) => {
    if (section.dataset.salesMethodProgressReady === "true") return;
    const timeline = section.querySelector("[data-method-timeline]");
    const markers = [...section.querySelectorAll(".method-sales-marker")];
    if (!timeline || markers.length !== steps.length) return;

    section.dataset.salesMethodProgressReady = "true";
    let frameId = 0;

    const updateProgress = () => {
      frameId = 0;
      const focusLine = window.innerHeight * 0.52;
      const markerCenters = markers.map((marker) => {
        const rect = marker.getBoundingClientRect();
        return rect.top + rect.height / 2;
      });
      const first = markerCenters[0];
      const last = markerCenters[markerCenters.length - 1];
      const trackLength = Math.max(1, last - first);
      const progress = Math.min(1, Math.max(0, (focusLine - first) / trackLength)) * 100;
      let activeIndex = 0;

      markerCenters.forEach((center, index) => {
        if (center <= focusLine) activeIndex = index;
      });
      const timelineRect = timeline.getBoundingClientRect();
      timeline.style.setProperty("--method-track-start", `${Math.max(0, first - timelineRect.top)}px`);
      timeline.style.setProperty("--method-track-length", `${trackLength}px`);
      timeline.style.setProperty("--method-fill-length", `${(trackLength * progress) / 100}px`);
      timeline.style.setProperty("--method-timeline-axis", `${markerCenters[0] ? markers[0].getBoundingClientRect().left + markers[0].getBoundingClientRect().width / 2 - timelineRect.left : 0}px`);
      setActiveStep(section, activeIndex, progress);

      if (timelineRect.top < window.innerHeight && timelineRect.bottom > 0) {
        frameId = window.requestAnimationFrame(updateProgress);
      }
    };

    const requestUpdate = () => {
      if (!frameId) frameId = window.requestAnimationFrame(updateProgress);
    };

    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate, { passive: true });
    requestUpdate();
  };

  const buildMethodSalesSection = () => {
    const section = document.querySelector(".method-section");
    if (!section || section.dataset.salesMethodReady === "true") return Boolean(section);

    section.dataset.salesMethodReady = "true";
    section.className = "method-section method-sales-section";
    section.setAttribute("aria-labelledby", "method-sales-title");
    section.innerHTML = `
      <div class="method-sales-shell">
        <div class="method-sales-intro">
          <span class="method-sales-eyebrow">SE VOCÊ SE IDENTIFICA...</span>
          <h2 id="method-sales-title">Como saber se a <strong>SUNLIX É PARA MIM?</strong></h2>
          <p><strong>Se você:</strong></p>
        </div>

        <div class="method-sales-timeline" data-method-timeline>
          <ol class="method-sales-steps" aria-label="Para quem a Sunlix é indicada">
            ${steps.map((step, index) => `
              <li class="method-sales-step method-sales-step--${index % 2 === 0 ? "right" : "left"}${index === 0 ? " is-active" : ""}" data-step="${index}"${index === 0 ? ' aria-current="step"' : ""}>
                <span class="method-sales-marker" aria-hidden="true"><i></i></span>
                <div class="method-sales-step-content">
                  <h3>${step.title}</h3>
                  <p>${step.text}</p>
                </div>
              </li>`).join("")}
          </ol>
        </div>

        <div class="method-sales-closing">
          <p><strong>A Sunlix é para você.</strong></p>
          <a class="method-sales-cta" href="${checkoutUrl}">QUERO FAZER PARTE DA SUNLIX <span aria-hidden="true">↗</span></a>
        </div>
      </div>`;
    setupMethodProgress(section);
    return true;
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", buildMethodSalesSection, { once: true });
  } else {
    buildMethodSalesSection();
  }
  window.addEventListener("pageshow", buildMethodSalesSection);
})();
