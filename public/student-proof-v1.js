(() => {
  const buildStudentProof = () => {
    if (document.querySelector("#depoimentos")) return;

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
          <figure class="student-proof-video-only-card">
            <video
              src="/testimonials/video-depoimento-1-preview.mp4"
              aria-label="Primeiro depoimento em vídeo"
              controls
              playsinline
              preload="metadata"
            ></video>
          </figure>

          <figure class="student-proof-video-only-card">
            <video
              src="/testimonials/video-depoimento-2-preview.mp4"
              aria-label="Segundo depoimento em vídeo"
              controls
              playsinline
              preload="metadata"
            ></video>
          </figure>
        </div>

        <a class="student-proof-cta" href="https://pay.kiwify.com.br/3U3ri1Z?utm_source=ig&utm_medium=social&utm_content=link_in_bio&fbclid=PAcGRvZgJleHRuA2FlbQIxMQBzcnRjBmFwcF9pZA85MzY2MTk3NDMzOTI0NTkAAaevJUkw0_uoPexeLpBD0uwAqbcykPEPqyIsY92jjdMazyQ3sDDuOGK9PuqByQ_aem_2snf6J8TOi97NbaW3-4PNw&utm_id=97760_v0_s00_e0_tv3O">QUERO SER A PRÓXIMA HISTÓRIA <span aria-hidden="true">↗</span></a>
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
