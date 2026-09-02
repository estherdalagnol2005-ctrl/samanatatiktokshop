(() => {
  const media = [
    {
      type: "video",
      src: "/assets/dreams-2026/paris-torre-eiffel.webm",
      poster: "/assets/dreams-2026/paris-torre-eiffel-poster.jpg",
      label: "Paris, França",
      caption: "A liberdade que virou memória.",
      alt: "Samanta caminhando em Paris com a Torre Eiffel ao fundo",
    },
    {
      type: "video",
      src: "/assets/dreams-2026/momento-em-paris.webm",
      poster: "/assets/dreams-2026/momento-em-paris-poster.jpg",
      label: "Momentos em Paris",
      caption: "Uma conquista para guardar para sempre.",
      alt: "Samanta abrindo um presente em um café de Paris",
    },
    {
      type: "image",
      src: "/assets/result-record-day.jpg",
      label: "R$ 9,4 mil em um dia",
      caption: "Um brinde ao dia de recorde.",
      alt: "Samanta tomando vinho no dia em que faturou R$ 9,4 mil",
    },
    {
      type: "image",
      src: "/assets/samanta-eiffel-room.webp",
      label: "Uma nova vista",
      caption: "A Torre Eiffel da janela do quarto.",
      alt: "Samanta no quarto diante da Torre Eiffel",
    },
    {
      type: "image",
      src: "/assets/dreams-2026/pix-na-rotina.webp",
      label: "Pix na rotina",
      caption: "Resultados que acompanham o dia.",
      alt: "Samanta na academia com comprovantes de pagamentos do TikTok Shop",
    },
    {
      type: "image",
      src: "/assets/dreams-2026/42-mil-em-sete-dias.webp",
      label: "R$ 42 mil em 7 dias",
      caption: "Consistência que aparece nos números.",
      alt: "Samanta com painéis de R$ 42 mil em sete dias",
    },
    {
      type: "image",
      src: "/assets/dreams-2026/resultados-com-liberdade.webp",
      label: "Resultados com liberdade",
      caption: "Trabalhar sem abrir mão de viver.",
      alt: "Samanta diante do mar ao pôr do sol com painéis de resultados",
    },
    {
      type: "image",
      src: "/assets/dreams-2026/quartas-de-pix.webp",
      label: "Quartas de Pix",
      caption: "Uma operação que continua vendendo.",
      alt: "Samanta no quarto com comprovantes de pagamentos recebidos",
    },
    {
      type: "image",
      src: "/assets/dreams-2026/familia-torre-eiffel.webp",
      label: "Torre Eiffel em família",
      caption: "Conquistas ficam melhores quando são compartilhadas.",
      alt: "Samanta com sua família diante da Torre Eiffel à noite",
      position: "center 42%",
    },
    {
      type: "video",
      src: "/assets/dreams-2026/conquista-em-familia.webm",
      poster: "/assets/dreams-2026/conquista-em-familia-poster.jpg",
      label: "Conquista em família",
      caption: "Realizar sonhos de quem sempre esteve por perto.",
      alt: "Momento de uma conquista de Samanta com sua família",
    },
    {
      type: "image",
      src: "/assets/dreams-2026/20-mil-em-sete-dias.webp",
      label: "R$ 20 mil em 7 dias",
      caption: "Estratégia, repetição e crescimento.",
      alt: "Samanta com painéis de R$ 20 mil em sete dias",
    },
    {
      type: "image",
      src: "/assets/dreams-2026/celebrar-conquistas.webp",
      label: "Liberdade para celebrar",
      caption: "Trabalhar também para viver bons momentos.",
      alt: "Conta de uma celebração conquistada com o trabalho",
    },
    {
      type: "image",
      src: "/assets/dreams-2026/7-mil-em-um-dia.webp",
      label: "+R$ 7 mil em um dia",
      caption: "Resultado que cabe na rotina.",
      alt: "Samanta na academia com painéis de mais de R$ 7 mil em um dia",
    },
    {
      type: "image",
      src: "/assets/dreams-2026/creator-summit.webp",
      label: "Creator Summit",
      caption: "Networking que abre novas portas.",
      alt: "Samanta com outras criadoras no Creator Summit",
      position: "center",
      fit: "contain",
    },
    {
      type: "image",
      src: "/assets/dreams-2026/evento-criadores.webp",
      label: "Novas experiências",
      caption: "O digital levando a lugares antes distantes.",
      alt: "Samanta sorrindo em um evento de criadores",
      position: "center 32%",
    },
  ];

  const initializeCoverflow = () => {
    if (document.querySelector(".dreams-coverflow")) return true;

    const showcase = document.querySelector(".dreams-showcase");
    if (!showcase) return false;

    const coverflow = document.createElement("div");
    coverflow.className = "dreams-coverflow";
    coverflow.setAttribute("aria-roledescription", "carrossel");
    coverflow.setAttribute(
      "aria-label",
      "Vídeos, resultados e conquistas de Samanta",
    );

    const viewport = document.createElement("div");
    viewport.className = "dreams-coverflow-viewport";
    viewport.tabIndex = 0;

    const track = document.createElement("div");
    track.className = "dreams-coverflow-track";

    const slides = media.map((item, index) => {
      const slide = document.createElement("button");
      slide.type = "button";
      slide.className = `dreams-coverflow-slide dreams-coverflow-${item.type}`;
      slide.dataset.index = String(index);
      slide.dataset.label = item.label;
      slide.setAttribute(
        "aria-label",
        `${item.label}. ${item.caption} Item ${index + 1} de ${media.length}.`,
      );

      if (item.type === "video") {
        const video = document.createElement("video");
        video.src = item.src;
        video.poster = item.poster;
        video.muted = true;
        video.loop = true;
        video.playsInline = true;
        video.preload = "none";
        video.setAttribute("aria-label", item.alt);
        slide.append(video);
      } else {
        const image = document.createElement("img");
        image.src = item.src;
        image.alt = item.alt;
        image.loading = "lazy";
        image.decoding = "async";
        image.draggable = false;
        if (item.position) image.style.objectPosition = item.position;
        if (item.fit === "contain") {
          slide.classList.add("dreams-coverflow-contained");
          const backdrop = document.createElement("span");
          backdrop.className = "dreams-coverflow-backdrop";
          backdrop.setAttribute("aria-hidden", "true");
          backdrop.style.backgroundImage = `url("${item.src}")`;
          slide.append(backdrop);
        }
        slide.append(image);
      }

      const caption = document.createElement("span");
      caption.className = "dreams-coverflow-caption";
      caption.innerHTML = `<span>${item.label}</span><strong>${item.caption}</strong>`;
      slide.append(caption);
      track.append(slide);
      return slide;
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
    let inViewport = false;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const playActiveVideo = () => {
      const video = slides[activeIndex]?.querySelector("video");
      if (video && inViewport && !document.hidden && !reducedMotion) video.play().catch(() => {});
    };

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

      document
        .querySelectorAll(".dreams-coverflow video")
        .forEach((video) => video.pause());

      playActiveVideo();

      status.textContent = `${media[activeIndex].label}. Item ${activeIndex + 1} de ${slides.length}.`;
      coverflow.dataset.activeType = media[activeIndex].type;
    };

    const move = (direction) => {
      activeIndex = (activeIndex + direction + slides.length) % slides.length;
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
      if (event.target.closest(".dreams-coverflow-arrow")) return;
      pointerStartX = event.clientX;
      viewport.setPointerCapture?.(event.pointerId);
    });

    viewport.addEventListener("pointerup", (event) => {
      if (pointerStartX === null) return;
      const distance = event.clientX - pointerStartX;
      pointerStartX = null;
      if (Math.abs(distance) > 42) move(distance > 0 ? -1 : 1);
    });

    viewport.addEventListener("pointercancel", () => {
      pointerStartX = null;
    });

    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        document
          .querySelectorAll(".dreams-coverflow video")
          .forEach((video) => video.pause());
      } else {
        playActiveVideo();
      }
    });

    const visibilityObserver = new IntersectionObserver(([entry]) => {
      inViewport = entry.isIntersecting;
      if (inViewport) playActiveVideo();
      else coverflow.querySelectorAll("video").forEach(video => video.pause());
    }, { threshold: 0.1 });
    visibilityObserver.observe(coverflow);
    render();
    return true;
  };

  const observer = new MutationObserver(initializeCoverflow);
  observer.observe(document.documentElement, { childList: true, subtree: true });

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initializeCoverflow, {
      once: true,
    });
  } else {
    initializeCoverflow();
  }

  window.addEventListener("load", () => {
    initializeCoverflow();
    window.setTimeout(initializeCoverflow, 120);
    window.setTimeout(initializeCoverflow, 650);
    window.setTimeout(() => observer.disconnect(), 5000);
  });
})();
