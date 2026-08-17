(() => {
  const initializeCoverflow = () => {
    if (document.querySelector(".dreams-coverflow")) {
      return true;
    }

    const showcase = document.querySelector(".dreams-showcase");
    const originalVideo = showcase?.querySelector(".dreams-feature-video");
    const originalCards = [
      ...(showcase?.querySelectorAll(".dreams-orbit-card") ?? []),
    ];

    if (!showcase || !originalVideo || originalCards.length === 0) {
      return false;
    }

    const video = originalVideo.querySelector("video");
    if (!video) {
      return false;
    }

    const coverflow = document.createElement("div");
    coverflow.className = "dreams-coverflow";
    coverflow.setAttribute("aria-roledescription", "carrossel");
    coverflow.setAttribute(
      "aria-label",
      "Vídeo, resultados e conquistas de Samanta",
    );

    const viewport = document.createElement("div");
    viewport.className = "dreams-coverflow-viewport";
    viewport.tabIndex = 0;

    const track = document.createElement("div");
    track.className = "dreams-coverflow-track";

    const videoSlide = document.createElement("figure");
    videoSlide.className = "dreams-coverflow-slide dreams-coverflow-video";
    videoSlide.dataset.label = "Paris, França";
    videoSlide.setAttribute("aria-label", "Paris, França — vídeo em destaque");
    video.removeAttribute("style");
    videoSlide.append(video);

    const videoCaption = document.createElement("figcaption");
    videoCaption.innerHTML =
      "<span>Paris, França</span><strong>Liberdade em movimento.</strong>";
    videoSlide.append(videoCaption);

    const slides = [videoSlide];

    originalCards.forEach((card) => {
      const slide = document.createElement("button");
      const label = card.querySelector("span")?.textContent?.trim() || "Conquista";
      const image = card.querySelector("img")?.cloneNode(true);

      slide.type = "button";
      slide.className = "dreams-coverflow-slide dreams-coverflow-image";
      slide.dataset.label = label;
      slide.setAttribute("aria-label", `Destacar ${label}`);

      if (image) {
        image.removeAttribute("aria-hidden");
        image.alt = label;
        image.draggable = false;
        slide.append(image);
      }

      const caption = document.createElement("span");
      caption.className = "dreams-coverflow-caption";
      caption.textContent = label;
      slide.append(caption);
      slides.push(slide);
    });

    slides.forEach((slide, index) => {
      slide.dataset.index = String(index);
      track.append(slide);
    });

    const previous = document.createElement("button");
    previous.type = "button";
    previous.className = "dreams-coverflow-arrow dreams-coverflow-arrow-prev";
    previous.setAttribute("aria-label", "Ver conquista anterior");
    previous.innerHTML = '<span aria-hidden="true">←</span>';

    const next = document.createElement("button");
    next.type = "button";
    next.className = "dreams-coverflow-arrow dreams-coverflow-arrow-next";
    next.setAttribute("aria-label", "Ver próxima conquista");
    next.innerHTML = '<span aria-hidden="true">→</span>';

    const status = document.createElement("p");
    status.className = "dreams-coverflow-status";
    status.setAttribute("aria-live", "polite");

    viewport.append(track, previous, next, status);
    coverflow.append(viewport);
    showcase.replaceChildren(coverflow);

    let activeIndex = 0;
    let pointerStartX = null;

    const normalizeOffset = (index) => {
      let offset = index - activeIndex;
      const halfway = slides.length / 2;

      if (offset > halfway) offset -= slides.length;
      if (offset < -halfway) offset += slides.length;
      return offset;
    };

    const render = () => {
      slides.forEach((slide, index) => {
        const offset = normalizeOffset(index);
        const slot =
          offset === 0
            ? "active"
            : offset === -1
              ? "left"
              : offset === 1
                ? "right"
                : "hidden";

        slide.dataset.slot = slot;
        slide.setAttribute("aria-hidden", slot === "hidden" ? "true" : "false");
        slide.tabIndex = slot === "hidden" ? -1 : 0;
      });

      const activeSlide = slides[activeIndex];
      const activeVideo = activeSlide.querySelector("video");
      video.pause();
      if (activeVideo) {
        activeVideo.play().catch(() => {});
      }

      status.textContent = `${activeSlide.dataset.label}. Item ${activeIndex + 1} de ${slides.length}.`;
      coverflow.dataset.activeType =
        activeSlide === videoSlide ? "video" : "image";
    };

    const move = (direction) => {
      activeIndex =
        (activeIndex + direction + slides.length) % slides.length;
      render();
    };

    previous.addEventListener("click", () => move(-1));
    next.addEventListener("click", () => move(1));

    slides.forEach((slide, index) => {
      slide.addEventListener("click", () => {
        if (index !== activeIndex) {
          activeIndex = index;
          render();
        }
      });
    });

    viewport.addEventListener("keydown", (event) => {
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        move(-1);
      }
      if (event.key === "ArrowRight") {
        event.preventDefault();
        move(1);
      }
    });

    viewport.addEventListener("pointerdown", (event) => {
      if (event.target.closest("button")) return;
      pointerStartX = event.clientX;
      viewport.setPointerCapture?.(event.pointerId);
    });

    viewport.addEventListener("pointerup", (event) => {
      if (pointerStartX === null) return;
      const distance = event.clientX - pointerStartX;
      pointerStartX = null;

      if (Math.abs(distance) > 42) {
        move(distance > 0 ? -1 : 1);
      }
    });

    viewport.addEventListener("pointercancel", () => {
      pointerStartX = null;
    });

    render();
    return true;
  };

  const ensureCoverflow = () => initializeCoverflow();
  const observer = new MutationObserver(ensureCoverflow);

  observer.observe(document.documentElement, { childList: true, subtree: true });

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", ensureCoverflow, { once: true });
  } else {
    ensureCoverflow();
  }

  window.addEventListener("load", () => {
    ensureCoverflow();
    window.setTimeout(ensureCoverflow, 120);
    window.setTimeout(ensureCoverflow, 650);
    window.setTimeout(() => observer.disconnect(), 5000);
  });
})();
