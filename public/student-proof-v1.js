(() => {
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
    let scrollFrame = 0;

    const updateNavigation = () => {
      previousButton.disabled = activeIndex === 0;
      nextButton.disabled = activeIndex === cards.length - 1;
      status.textContent = `Vídeo ${activeIndex + 1} de ${cards.length}`;
    };

    const goToVideo = (index) => {
      activeIndex = Math.max(0, Math.min(cards.length - 1, index));

      const card = cards[activeIndex];
      const rowRect = row.getBoundingClientRect();
      const cardRect = card.getBoundingClientRect();
      const target =
        row.scrollLeft +
        cardRect.left -
        rowRect.left -
        (row.clientWidth - card.clientWidth) / 2;

      row.scrollTo({ left: Math.max(0, target), behavior: "smooth" });
      updateNavigation();
    };

    previousButton.addEventListener("click", () => goToVideo(activeIndex - 1));
    nextButton.addEventListener("click", () => goToVideo(activeIndex + 1));

    row.addEventListener(
      "scroll",
      () => {
        window.cancelAnimationFrame(scrollFrame);
        scrollFrame = window.requestAnimationFrame(() => {
          const rowCenter = row.getBoundingClientRect().left + row.clientWidth / 2;
          let closestIndex = 0;
          let closestDistance = Number.POSITIVE_INFINITY;

          cards.forEach((card, index) => {
            const rect = card.getBoundingClientRect();
            const distance = Math.abs(rect.left + rect.width / 2 - rowCenter);

            if (distance < closestDistance) {
              closestDistance = distance;
              closestIndex = index;
            }
          });

          if (closestIndex !== activeIndex) {
            activeIndex = closestIndex;
            updateNavigation();
          }
        });
      },
      { passive: true },
    );

    updateNavigation();
  };

  const buildStudentProof = () => {
    const existingSection = document.querySelector("#depoimentos");
    if (existingSection) {
      setupVideoNavigation(existingSection);
      return;
    }

    const hero = document.querySelector(".hero-stage");
    if (!hero) return;

    const section = document.createElement("section");
    section.className = "student-proof-section student-proof-video-only-section";
    section.id = "depoimentos";
    section.setAttribute("aria-labelledby", "student-proof-title");

    section.innerHTML = `
      <div class="student-proof-shell">
        <header class="student-proof-heading">
          <div class="student-proof-copy">
            <h2 id="student-proof-title">Esse é o motivo que me faz continuar<br><strong>ajudando mulheres como você.</strong></h2>
            <p>São depoimentos como esses que me fazem querer compartilhar meu método e, cada vez mais, ajudar a realizar sonhos.</p>
            <p>Com meu método já vi mulheres deixando o CLT e mães dando uma condição melhor pra sua família e é por isso que eu continuo a cada dia. Você pode ser a próxima, escolha agora começar a trilhar seu próprio caminho ao meu lado e junto a essa comunidade de mulheres que evoluem a cada dia.</p>
          </div>
        </header>

        <div class="student-proof-video-only-row" aria-label="Depoimentos em vídeo de alunas">
          <figure class="student-proof-video-only-card student-proof-video-only-card--portrait">
            <iframe
              src="https://drive.google.com/file/d/1iUCIhcmILabjx84IYgPwSrIVasrqiYub/preview"
              title="Primeiro depoimento em vídeo"
              allow="autoplay; fullscreen"
              allowfullscreen
              loading="lazy"
            ></iframe>
          </figure>

          <figure class="student-proof-video-only-card student-proof-video-only-card--landscape">
            <iframe
              src="https://drive.google.com/file/d/1wWRFYcWHIwq87E_BbbU53fHg6DYEK5dp/preview"
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
  };

  const scheduleBuild = () => window.setTimeout(buildStudentProof, 950);

  if (document.readyState === "complete") {
    scheduleBuild();
  } else {
    window.addEventListener("load", scheduleBuild, { once: true });
  }

  window.addEventListener("pageshow", scheduleBuild);
})();
