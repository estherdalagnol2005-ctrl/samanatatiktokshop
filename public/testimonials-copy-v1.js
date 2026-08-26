(() => {
  const copyHtml = `
    <p>São depoimentos como esses que me fazem querer compartilhar meu método e, cada vez mais, ajudar a realizar sonhos.</p>
    <p>Com meu método já vi mulheres deixando o CLT e mães dando uma condição melhor pra sua família e é por isso que eu continuo a cada dia. Você pode ser a próxima, escolha agora começar a trilhar seu próprio caminho ao meu lado e junto a essa comunidade de mulheres que evoluem a cada dia.</p>`;

  const applyTestimonialsCopy = () => {
    const copy = document.querySelector("#depoimentos .student-proof-copy");
    if (!copy || copy.dataset.updatedCopy === "true") return false;

    copy.querySelectorAll("p").forEach((paragraph) => paragraph.remove());
    copy.insertAdjacentHTML("beforeend", copyHtml);
    copy.dataset.updatedCopy = "true";
    return true;
  };

  if (!applyTestimonialsCopy()) {
    const observer = new MutationObserver(() => {
      if (applyTestimonialsCopy()) observer.disconnect();
    });
    observer.observe(document.documentElement, { childList: true, subtree: true });
    window.setTimeout(() => observer.disconnect(), 8000);
  }
})();
