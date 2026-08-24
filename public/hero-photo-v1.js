(() => {
  const applyHeroPhoto = () => {
    const image = document.querySelector(
      ".hero-method-visual .method-photo-frame img",
    );

    if (!image) return false;

    image.src = "/assets/samanta-hero-portrait.webp";
    image.alt = "Retrato de Samanta";
    image.loading = "eager";
    image.decoding = "sync";
    image.style.objectPosition = "center 34%";
    return true;
  };

  const observer = new MutationObserver(applyHeroPhoto);
  observer.observe(document.documentElement, { childList: true, subtree: true });

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", applyHeroPhoto, { once: true });
  } else {
    applyHeroPhoto();
  }

  window.addEventListener("load", () => {
    applyHeroPhoto();
    window.setTimeout(applyHeroPhoto, 120);
    window.setTimeout(applyHeroPhoto, 650);
    window.setTimeout(() => observer.disconnect(), 5000);
  });
})();
