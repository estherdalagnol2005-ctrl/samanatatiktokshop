(() => {
  const buildStudentProof = () => {
    if (document.querySelector("#depoimentos")) return;

    const hero = document.querySelector(".hero-stage");
    if (!hero) return;

    const section = document.createElement("section");
    section.className = "student-proof-section";
    section.id = "depoimentos";
    section.setAttribute("aria-labelledby", "student-proof-title");

    section.innerHTML = `
      <div class="student-proof-shell">
        <header class="student-proof-heading">
          <div class="student-proof-copy">
            <span class="student-proof-eyebrow">PROVA SOCIAL · RESULTADOS DAS ALUNAS</span>
            <h2 id="student-proof-title">ESSE É O MOTIVO QUE ME FAZ CONTINUAR<br><strong>AJUDANDO MULHERES COMO VOCÊ.</strong></h2>
            <p>Se você é mãe e sente que não tem tempo, trabalha como CLT ou está começando do zero, estes resultados mostram que é possível avançar quando existe método, direção e apoio.</p>
          </div>
        </header>

        <div class="student-proof-carousel-shell">
          <button class="student-proof-arrow student-proof-arrow--prev" type="button" aria-label="Ver depoimento anterior">←</button>

          <div class="student-proof-carousel" aria-label="Carrossel com dez resultados reais de alunas" tabindex="0">
            <div class="student-proof-track">
              <figure class="student-proof-card student-proof-real-card student-proof-fit-contain is-active">
                <img src="/testimonials/sarah-comissoes-marco.webp" alt="Depoimento de Sarah mostrando 87,6 mil reais em GMV e quase 9 mil reais em comissões no mês" loading="lazy" decoding="async">
                <figcaption class="student-proof-caption"><span>RESULTADO DE ALUNA</span><strong>Quase R$ 9 mil em comissões no mês.</strong></figcaption>
              </figure>

              <figure class="student-proof-card student-proof-real-card student-proof-fit-contain">
                <img src="/testimonials/leticia-pix-31634.webp" alt="Depoimento de Leticia mostrando um Pix de 31.634 reais recebido do TikTok Shop" loading="lazy" decoding="async">
                <figcaption class="student-proof-caption"><span>PAGAMENTO REAL</span><strong>R$ 31.634 recebidos de uma vez.</strong></figcaption>
              </figure>

              <figure class="student-proof-card student-proof-real-card student-proof-fit-contain">
                <img src="/testimonials/nay-pagamentos-tres-perfis.webp" alt="Depoimento de Nay mostrando pagamentos recebidos em três perfis" loading="lazy" decoding="async">
                <figcaption class="student-proof-caption"><span>RESULTADO DE ALUNA</span><strong>Três perfis gerando pagamentos.</strong></figcaption>
              </figure>

              <figure class="student-proof-card student-proof-real-card">
                <img src="/testimonials/sarah-pagamento-7714.webp" alt="Depoimento de Sarah mostrando pagamento de 7.714 reais recebido da ByteDance" loading="lazy" decoding="async">
                <figcaption class="student-proof-caption"><span>DINHEIRO NA CONTA</span><strong>R$ 7.714 recebidos.</strong></figcaption>
              </figure>

              <figure class="student-proof-card student-proof-real-card">
                <img src="/testimonials/karol-comissoes-2600.webp" alt="Depoimento de Karol mostrando novo recorde de 2.600 reais em comissões" loading="lazy" decoding="async">
                <figcaption class="student-proof-caption"><span>NOVO RECORDE</span><strong>R$ 2,6 mil em comissões.</strong></figcaption>
              </figure>

              <figure class="student-proof-card student-proof-real-card student-proof-fit-contain">
                <img src="/testimonials/2026-08/michelle-gratidao.webp" alt="Depoimento de Michelle mostrando uma transferência de 2.524 reais recebida da ByteDance" loading="lazy" decoding="async">
                <figcaption class="student-proof-caption"><span>DINHEIRO NA CONTA</span><strong>R$ 2.524 recebidos.</strong></figcaption>
              </figure>

              <figure class="student-proof-card student-proof-real-card">
                <img src="/testimonials/2026-08/itamires-ajuda.webp" alt="Depoimento de Itámires mostrando evolução nas vendas com ajuda e acompanhamento" loading="lazy" decoding="async">
                <figcaption class="student-proof-caption"><span>EVOLUÇÃO ACOMPANHADA</span><strong>Mais um produto validado e pronto para escalar.</strong></figcaption>
              </figure>

              <figure class="student-proof-card student-proof-real-card student-proof-fit-contain">
                <img src="/testimonials/2026-08/michelle-viver-tiktok.webp" alt="Depoimento de Michelle sobre seu plano de sair do trabalho e viver do TikTok" loading="lazy" decoding="async">
                <figcaption class="student-proof-caption"><span>NOVA POSSIBILIDADE</span><strong>A caminho de viver do TikTok.</strong></figcaption>
              </figure>

              <figure class="student-proof-card student-proof-real-card student-proof-fit-contain">
                <img src="/testimonials/2026-08/karol-pix-9401.webp" alt="Depoimento de Karol mostrando um Pix de 9.401 reais recebido da ByteDance" loading="lazy" decoding="async">
                <figcaption class="student-proof-caption"><span>ESFORÇO RECOMPENSADO</span><strong>R$ 9.401 recebidos.</strong></figcaption>
              </figure>

              <figure class="student-proof-card student-proof-real-card student-proof-fit-contain">
                <img src="/testimonials/2026-08/elisangela-fechamento.webp" alt="Depoimento de Elisângela mostrando 6.500 reais em comissões no mês" loading="lazy" decoding="async">
                <figcaption class="student-proof-caption"><span>FECHAMENTO DO MÊS</span><strong>R$ 6,5 mil em comissões.</strong></figcaption>
              </figure>
            </div>
          </div>

          <button class="student-proof-arrow student-proof-arrow--next" type="button" aria-label="Ver próximo depoimento">→</button>
        </div>

        <div class="student-proof-carousel-nav">
          <span>ARRASTE PARA VER MAIS</span>
          <div class="student-proof-dots" aria-label="Escolher depoimento">
            <button class="is-active" type="button" aria-label="Ver depoimento 1" aria-current="true"></button>
            <button type="button" aria-label="Ver depoimento 2"></button>
            <button type="button" aria-label="Ver depoimento 3"></button>
            <button type="button" aria-label="Ver depoimento 4"></button>
            <button type="button" aria-label="Ver depoimento 5"></button>
            <button type="button" aria-label="Ver depoimento 6"></button>
            <button type="button" aria-label="Ver depoimento 7"></button>
            <button type="button" aria-label="Ver depoimento 8"></button>
            <button type="button" aria-label="Ver depoimento 9"></button>
            <button type="button" aria-label="Ver depoimento 10"></button>
          </div>
        </div>

        <aside class="student-proof-number" aria-label="Aluna recebeu mais de 31 mil reais em um pagamento">
          <span>UM DOS RESULTADOS</span>
          <strong>+R$ 31 MIL</strong>
          <small>em um único pagamento</small>
        </aside>

        <a class="student-proof-cta" href="https://pay.kiwify.com.br/3U3ri1Z?utm_source=ig&utm_medium=social&utm_content=link_in_bio&fbclid=PAcGRvZgJleHRuA2FlbQIxMQBzcnRjBmFwcF9pZA85MzY2MTk3NDMzOTI0NTkAAaevJUkw0_uoPexeLpBD0uwAqbcykPEPqyIsY92jjdMazyQ3sDDuOGK9PuqByQ_aem_2snf6J8TOi97NbaW3-4PNw&utm_id=97760_v0_s00_e0_tv3O">QUERO SER A PRÓXIMA HISTÓRIA <span aria-hidden="true">↗</span></a>
      </div>
    `;

    hero.insertAdjacentElement("afterend", section);

    const carousel = section.querySelector(".student-proof-carousel");
    const track = section.querySelector(".student-proof-track");
    const cards = [...section.querySelectorAll(".student-proof-real-card")];
    const dots = [...section.querySelectorAll(".student-proof-dots button")];
    const previousButton = section.querySelector(".student-proof-arrow--prev");
    const nextButton = section.querySelector(".student-proof-arrow--next");

    cards.forEach((card, index) => {
      card.dataset.proofIndex = String(index);
      const image = card.querySelector("img");
      if (card.classList.contains("student-proof-fit-contain") && image) {
        card.style.setProperty(
          "--student-proof-image",
          `url("${image.getAttribute("src")}")`,
        );
      }
    });

    if (track && cards.length > 1) {
      const lastClone = cards.at(-1).cloneNode(true);
      const firstClone = cards[0].cloneNode(true);

      [lastClone, firstClone].forEach((clone) => {
        clone.classList.remove("is-active");
        clone.classList.add("student-proof-clone");
        clone.setAttribute("aria-hidden", "true");
        clone.querySelector("img")?.setAttribute("alt", "");
      });

      track.prepend(lastClone);
      track.append(firstClone);
    }

    const slides = [...section.querySelectorAll(".student-proof-track .student-proof-card")];
    let activeIndex = 0;
    let scrollFrame = 0;
    let settleTimer = 0;

    const setGutter = () => {
      const card = cards[0];
      if (!carousel || !card) return;
      const gutter = Math.max(12, (carousel.clientWidth - card.clientWidth) / 2);
      carousel.style.setProperty("--student-proof-gutter", `${gutter}px`);
    };

    const updateState = (index) => {
      activeIndex = Math.max(0, Math.min(cards.length - 1, index));
      slides.forEach((slide) => {
        slide.classList.toggle(
          "is-active",
          Number(slide.dataset.proofIndex) === activeIndex,
        );
      });
      dots.forEach((dot, dotIndex) => {
        const isActive = dotIndex === activeIndex;
        dot.classList.toggle("is-active", isActive);
        if (isActive) dot.setAttribute("aria-current", "true");
        else dot.removeAttribute("aria-current");
      });
      previousButton.disabled = false;
      nextButton.disabled = false;
    };

    const centerOn = (target, behavior = "smooth") => {
      if (!carousel || !target) return;
      const left = target.offsetLeft - (carousel.clientWidth - target.clientWidth) / 2;
      carousel.scrollTo({ left, behavior });
    };

    const goTo = (index, behavior = "smooth") => {
      let targetIndex = index;
      let target = cards[index];

      if (index < 0) {
        targetIndex = cards.length - 1;
        target = slides[0];
      } else if (index >= cards.length) {
        targetIndex = 0;
        target = slides.at(-1);
      }

      centerOn(target, behavior);
      updateState(targetIndex);
    };

    const updateFromScroll = () => {
      window.cancelAnimationFrame(scrollFrame);
      scrollFrame = window.requestAnimationFrame(() => {
        const center = carousel.scrollLeft + carousel.clientWidth / 2;
        let closestIndex = 0;
        let closestDistance = Number.POSITIVE_INFINITY;
        slides.forEach((slide, index) => {
          const cardCenter = slide.offsetLeft + slide.clientWidth / 2;
          const distance = Math.abs(center - cardCenter);
          if (distance < closestDistance) {
            closestDistance = distance;
            closestIndex = index;
          }
        });

        updateState(Number(slides[closestIndex].dataset.proofIndex));
        window.clearTimeout(settleTimer);
        settleTimer = window.setTimeout(() => {
          if (closestIndex === 0) {
            centerOn(cards.at(-1), "auto");
          } else if (closestIndex === slides.length - 1) {
            centerOn(cards[0], "auto");
          }
        }, 140);
      });
    };

    previousButton.addEventListener("click", () => goTo(activeIndex - 1));
    nextButton.addEventListener("click", () => goTo(activeIndex + 1));
    dots.forEach((dot, index) => dot.addEventListener("click", () => goTo(index)));
    carousel.addEventListener("scroll", updateFromScroll, { passive: true });
    carousel.addEventListener("keydown", (event) => {
      if (event.key === "ArrowLeft") goTo(activeIndex - 1);
      if (event.key === "ArrowRight") goTo(activeIndex + 1);
    });
    window.addEventListener("resize", () => {
      setGutter();
      goTo(activeIndex, "auto");
    }, { passive: true });

    setGutter();
    goTo(0, "auto");

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
