(() => {
  const testimonialCopy = `
    <p>São depoimentos como esses que me fazem querer compartilhar meu método e, cada vez mais, ajudar a realizar sonhos.</p>
    <p>Com meu método já vi mulheres deixando o CLT e mães dando uma condição melhor pra sua família e é por isso que eu continuo a cada dia. Você pode ser a próxima, escolha agora começar a trilhar seu próprio caminho ao meu lado e junto a essa comunidade de mulheres que evoluem a cada dia.</p>`;

  const makeVideoCard = (src, label) => {
    const card = document.createElement("figure");
    card.className = "student-proof-card student-proof-real-card student-proof-preview-video-card";
    card.setAttribute("aria-label", label);
    card.style.cssText = "grid-template-rows:1fr!important;opacity:1!important;transform:scale(1)!important;background:#111!important;";
    card.innerHTML = `
      <video
        src="${src}"
        aria-label="${label}"
        autoplay
        muted
        loop
        playsinline
        controls
        preload="metadata"
        style="display:block;width:100%;height:100%;min-height:0;object-fit:contain;background:#111;"
      ></video>`;
    return card;
  };

  const applyTestimonialsMediaLayout = () => {
    const section = document.querySelector("#depoimentos");
    if (!section || section.dataset.previewVideosApplied === "true") return false;

    const copy = section.querySelector(".student-proof-copy");
    if (copy) {
      copy.querySelectorAll("p").forEach((paragraph) => paragraph.remove());
      copy.insertAdjacentHTML("beforeend", testimonialCopy);
    }

    const track = section.querySelector(".student-proof-track");
    const firstRealCard = track?.querySelector(".student-proof-real-card:not(.student-proof-clone)");

    if (track && firstRealCard) {
      track.classList.add("student-proof-single-row");

      const videoOne = makeVideoCard(
        "/testimonials/video-depoimento-1-preview.mp4",
        "Prévia do primeiro depoimento em vídeo",
      );
      const videoTwo = makeVideoCard(
        "/testimonials/video-depoimento-2-preview.mp4",
        "Prévia do segundo depoimento em vídeo",
      );

      firstRealCard.insertAdjacentElement("afterend", videoTwo);
      firstRealCard.insertAdjacentElement("afterend", videoOne);
    }

    section.dataset.previewVideosApplied = "true";
    return true;
  };

  if (!applyTestimonialsMediaLayout()) {
    const observer = new MutationObserver(() => {
      if (applyTestimonialsMediaLayout()) observer.disconnect();
    });
    observer.observe(document.documentElement, { childList: true, subtree: true });
    window.setTimeout(() => observer.disconnect(), 8000);
  }
})();
