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
            <h2 id="student-proof-title">ELAS TAMBÉM<br><strong>ESTÃO VENDENDO.</strong></h2>
            <p>Quando o método sai do discurso, o resultado aparece no painel.</p>
          </div>
          <aside class="student-proof-number" aria-label="Aluna com 150 mil reais em vendas">
            <span>RESULTADO JÁ ALCANÇADO</span>
            <strong>+R$ 150 MIL</strong>
            <small>em vendas por aluna</small>
          </aside>
        </header>

        <div class="student-proof-wall" aria-label="Espaços preparados para provas e depoimentos de alunas">
          <article class="student-proof-card student-proof-result">
            <div class="student-proof-slot student-proof-dashboard">
              <span class="student-proof-slot-label">PRINT DE RESULTADO</span>
              <div class="student-proof-dashboard-panel" aria-hidden="true">
                <i></i><i></i><i></i>
                <span>VENDAS</span>
                <strong>R$ 150 mil</strong>
                <small>resultado de aluna</small>
                <b></b>
              </div>
            </div>
            <div class="student-proof-caption">
              <strong>O resultado vai falar primeiro.</strong>
              <span>Área pronta para receber o print real.</span>
            </div>
          </article>

          <article class="student-proof-card student-proof-video">
            <div class="student-proof-slot student-proof-video-slot">
              <span class="student-proof-slot-label">DEPOIMENTO EM VÍDEO</span>
              <div class="student-proof-play" aria-hidden="true"><i></i></div>
              <img src="/brand/icon-heart.webp" alt="" aria-hidden="true">
              <p>Relato da aluna</p>
            </div>
            <div class="student-proof-caption">
              <strong>Ela conta. O público acredita.</strong>
              <span>Formato preparado para vídeo vertical.</span>
            </div>
          </article>

          <div class="student-proof-stack">
            <article class="student-proof-card student-proof-message">
              <div class="student-proof-slot student-proof-message-slot">
                <span class="student-proof-slot-label">PRINT DO FEEDBACK</span>
                <img src="/brand/icon-chat.webp" alt="" aria-hidden="true">
                <div aria-hidden="true"><i></i><i></i><i></i></div>
              </div>
              <div class="student-proof-caption">
                <strong>Palavras de quem aplicou.</strong>
              </div>
            </article>

            <article class="student-proof-card student-proof-photo">
              <div class="student-proof-slot student-proof-photo-slot">
                <span class="student-proof-slot-label">FOTO + RESULTADO</span>
                <div class="student-proof-photo-mark" aria-hidden="true"><i></i></div>
                <img src="/brand/icon-bolt.webp" alt="" aria-hidden="true">
              </div>
              <div class="student-proof-caption">
                <strong>Rosto, história e conquista.</strong>
              </div>
            </article>
          </div>
        </div>

        <a class="student-proof-cta" href="#jornada">
          QUERO SER A PRÓXIMA HISTÓRIA <span aria-hidden="true">↗</span>
        </a>
      </div>
    `;

    hero.insertAdjacentElement("afterend", section);

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
