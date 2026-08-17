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
            <p>Prints e relatos de alunas que aplicaram o método e já estão transformando conteúdo em resultado.</p>
          </div>
          <aside class="student-proof-number" aria-label="Aluna recebeu mais de 31 mil reais em um pagamento">
            <span>UM DOS RESULTADOS</span>
            <strong>+R$ 31 MIL</strong>
            <small>em um único pagamento</small>
          </aside>
        </header>

        <div class="student-proof-wall" aria-label="Resultados e depoimentos de alunas">
          <figure class="student-proof-card student-proof-real-card">
            <img src="/testimonials/sarah-comissoes-marco.webp" alt="Depoimento de Sarah mostrando 87,6 mil reais em GMV e quase 9 mil reais em comissões no mês" loading="lazy">
            <figcaption class="student-proof-caption"><span>RESULTADO DE ALUNA</span><strong>Quase R$ 9 mil em comissões no mês.</strong></figcaption>
          </figure>
          <figure class="student-proof-card student-proof-real-card">
            <img src="/testimonials/sarah-pagamento-7714.webp" alt="Depoimento de Sarah mostrando pagamento de 7.714 reais recebido da ByteDance" loading="lazy">
            <figcaption class="student-proof-caption"><span>RESULTADO DE ALUNA</span><strong>R$ 7,7 mil recebidos em um pagamento.</strong></figcaption>
          </figure>
          <figure class="student-proof-card student-proof-real-card">
            <img src="/testimonials/leticia-pix-31634.webp" alt="Depoimento de Letícia mostrando Pix de 31.634 reais recebido do TikTok Shop" loading="lazy">
            <figcaption class="student-proof-caption"><span>RESULTADO DE ALUNA</span><strong>R$ 31,6 mil recebidos do TikTok Shop.</strong></figcaption>
          </figure>
          <figure class="student-proof-card student-proof-real-card">
            <img src="/testimonials/karol-comissoes-2600.webp" alt="Depoimento de Karol mostrando novo recorde de 2.600 reais em comissões" loading="lazy">
            <figcaption class="student-proof-caption"><span>RESULTADO DE ALUNA</span><strong>Novo recorde de comissões.</strong></figcaption>
          </figure>
          <figure class="student-proof-card student-proof-real-card">
            <img src="/testimonials/nay-pagamentos-tres-perfis.webp" alt="Depoimento de Nay mostrando pagamentos recebidos em três perfis" loading="lazy">
            <figcaption class="student-proof-caption"><span>RESULTADO DE ALUNA</span><strong>Recebendo em três perfis.</strong></figcaption>
          </figure>
        </div>

        <a class="student-proof-cta" href="#jornada">QUERO SER A PRÓXIMA HISTÓRIA <span aria-hidden="true">↗</span></a>
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
