(() => {
  const markFoldOrderReady = () => {
    document.documentElement.classList.add("site-fold-order-ready");
  };

  const setupVideoNavigation = (section) => {
    if (section.dataset.videoNavigationReady === "true") return;

    const row = section.querySelector(".student-proof-video-only-row");
    const cards = Array.from(
      section.querySelectorAll(".student-proof-video-only-card"),
    );
    const previousButton = section.querySelector(
      ".student-proof-video-arrow--previous",
    );
    const nextButton = section.querySelector(".student-proof-video-arrow--next");
    const status = section.querySelector(".student-proof-video-status");

    if (!row || cards.length < 2 || !previousButton || !nextButton || !status) {
      return;
    }

    section.dataset.videoNavigationReady = "true";
    let activeIndex = 0;
    let heightTimer = 0;

    const syncRowHeight = () => {
      const activeCard = cards[activeIndex];
      if (!activeCard) return;

      // offsetHeight is intentionally used instead of getBoundingClientRect().
      // The latter includes the visual scale transform and can leave the row
      // with a stale height after moving portrait -> landscape -> portrait.
      const activeHeight = activeCard.offsetHeight;
      if (activeHeight > 0) {
        row.style.height = `${Math.ceil(activeHeight)}px`;
      }
    };

    const settleRowHeight = () => {
      window.clearTimeout(heightTimer);
      syncRowHeight();
      window.requestAnimationFrame(syncRowHeight);
      heightTimer = window.setTimeout(syncRowHeight, 460);
    };

    const updateNavigation = () => {
      cards.forEach((card, index) => {
        const isActive = index === activeIndex;
        const frame = card.querySelector("iframe");

        card.classList.toggle("is-active", isActive);
        card.setAttribute("aria-hidden", String(!isActive));

        if (frame) {
          frame.tabIndex = isActive ? 0 : -1;
        }
      });

      section.dataset.activeVideo = String(activeIndex);
      status.textContent = `Vídeo ${activeIndex + 1} de ${cards.length}`;
      settleRowHeight();
    };

    const goToVideo = (index) => {
      activeIndex = (index + cards.length) % cards.length;
      updateNavigation();
    };

    previousButton.addEventListener("click", () => goToVideo(activeIndex - 1));
    nextButton.addEventListener("click", () => goToVideo(activeIndex + 1));

    const resizeObserver = new ResizeObserver(() => settleRowHeight());
    cards.forEach((card) => resizeObserver.observe(card));

    window.addEventListener("resize", settleRowHeight, { passive: true });
    window.addEventListener("orientationchange", settleRowHeight, { passive: true });

    updateNavigation();
  };

  const buildStudentProof = () => {
    const existingSection = document.querySelector("#depoimentos");
    if (existingSection) {
      setupVideoNavigation(existingSection);
      markFoldOrderReady();
      return true;
    }

    const hero = document.querySelector(".hero-stage");
    if (!hero) return false;

    const section = document.createElement("section");
    section.className = "student-proof-section student-proof-video-only-section";
    section.id = "depoimentos";
    section.setAttribute("aria-labelledby", "student-proof-title");

    section.innerHTML = `
      <div class="student-proof-shell">
        <header class="student-proof-heading">
          <div class="student-proof-copy">
            <h2 id="student-proof-title">Esse é o motivo que me faz continuar todos os dias <strong>ajudando mulheres como você.</strong></h2>
            <p>São depoimentos como esses que me fazem querer compartilhar meu método e, cada vez mais, ajudar a realizar sonhos. Com meu método já vi mulheres deixando o CLT e mães dando uma condição melhor pra sua família e é por isso que eu continuo a cada dia. Você pode ser a próxima, escolha agora começar a trilhar seu próprio caminho ao meu lado e junto a essa comunidade de mulheres que evoluem a cada dia.</p>
          </div>
        </header>

        <div class="student-proof-video-stage">
          <div class="student-proof-video-only-row" aria-label="Depoimentos em vídeo de alunas">
            <figure class="student-proof-video-only-card student-proof-video-only-card--portrait">
              <iframe
                src="https://drive.google.com/file/d/1KsVedupuF5JxMWARSQ2Q1Vg3C-DgTNpJ/preview"
                title="Primeiro depoimento em vídeo"
                allow="autoplay; fullscreen"
                allowfullscreen
                loading="lazy"
              ></iframe>
            </figure>

            <figure class="student-proof-video-only-card student-proof-video-only-card--landscape">
              <iframe
                src="https://drive.google.com/file/d/1wO_B1Yy0ult16Mk0ic-61ClPTkS56kI8/preview"
                title="Segundo depoimento em vídeo"
                allow="autoplay; fullscreen"
                allowfullscreen
                loading="lazy"
              ></iframe>
            </figure>
          </div>

          <div class="student-proof-video-nav" aria-label="Navegação dos depoimentos em vídeo">
            <button class="student-proof-video-arrow student-proof-video-arrow--previous" type="button" aria-label="Ver vídeo anterior">
              <span aria-hidden="true">←</span>
            </button>
            <p class="student-proof-video-status" aria-live="polite">Vídeo 1 de 2</p>
            <button class="student-proof-video-arrow student-proof-video-arrow--next" type="button" aria-label="Ver próximo vídeo">
              <span aria-hidden="true">→</span>
            </button>
          </div>
        </div>

        <a class="student-proof-cta" href="https://pay.kiwify.com.br/3U3ri1Z?utm_source=ig&utm_medium=social&utm_content=link_in_bio&fbclid=PAcGRvZgJleHRuA2FlbQIxMQBzcnRjBmFwcF9pZA85MzY2MTk3NDMzOTI0NTkAAaevJUkw0_uoPexeLpBD0uwAqbcykPEPqyIsY92jjdMazyQ3sDDuOGK9PuqByQ_aem_2snf6J8TOi97NbaW3-4PNw&utm_id=97760_v0_s00_e0_tv3O">QUERO SER A PRÓXIMA HISTÓRIA <span aria-hidden="true">↗</span></a>
      </div>
    `;

    hero.insertAdjacentElement("afterend", section);
    setupVideoNavigation(section);

    const transition = document.querySelector(
      ".dreams-section > .dreams-marquee",
    );

    if (transition) {
      transition.classList.add("site-gradient-marquee");
      hero.insertAdjacentElement("afterend", transition);
    }

    markFoldOrderReady();
    return true;
  };

  const boot = () => {
    if (buildStudentProof()) return;

    const observer = new MutationObserver(() => {
      if (buildStudentProof()) observer.disconnect();
    });
    observer.observe(document.documentElement, { childList: true, subtree: true });
    window.setTimeout(() => {
      observer.disconnect();
      markFoldOrderReady();
    }, 2500);
  };

  boot();
  window.addEventListener("pageshow", boot);
})();
