(() => {
  const applyTestimonialsMediaLayout = () => {
    const section = document.querySelector("#depoimentos");
    if (!section) return false;

    section.querySelectorAll(".student-proof-copy p").forEach((paragraph) => paragraph.remove());

    const track = section.querySelector(".student-proof-track");
    if (track) track.classList.add("student-proof-single-row");

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
