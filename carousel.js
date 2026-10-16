"use strict";
(() => {
  const base = "https://netinho-da-vila-drywall-gesso.milanijhonata.chatgpt.site/images/projects/";
  const works = [
    ["001", "Rebaixamento geométrico em gesso", "Composição personalizada com sancas e iluminação pontual."],
    ["002", "Sanca aberta com iluminação", "Moldura perimetral em gesso com luz indireta e spots."],
    ["003", "Forro rebaixado com luz cênica", "Teto com spots, lustre central e detalhe iluminado."],
    ["005", "Sala com forro geométrico", "Execução completa de teto decorativo integrado."],
    ["006", "Sanca perimetral com LED", "Acabamento decorativo com iluminação indireta."],
    ["007", "Sanca iluminada em corredor", "Detalhe contínuo em gesso e pontos de luz."],
    ["008", "Sanca com lustre central", "Teto rebaixado com iluminação e acabamento refinado."],
    ["009", "Rebaixo com perfil de LED", "Execução de linha luminosa contínua."],
    ["010", "Forro de cozinha com spots", "Rebaixamento funcional com luminárias pendentes."],
    ["011", "Forro flutuante com luz indireta", "Composição em níveis com luz perimetral."],
    ["013", "Teto com iluminação linear integrada", "Forro contemporâneo com rasgos luminosos."],
    ["014", "Perfil linear em corredor", "Luz arquitetônica integrada ao forro."],
    ["015", "Teto decorativo com spots", "Sanca com luz azul e lustre central."],
    ["017", "Sanca fechada com LED vermelho", "Projeto perimetral com luz indireta e spots."]
  ];

  const gallery = document.getElementById("gallery");
  if (!gallery) return;

  const image = document.getElementById("gallery-image");
  const stage = document.getElementById("gallery-stage");
  const fallback = document.getElementById("gallery-image-fallback");
  const heading = document.getElementById("gallery-title");
  const description = document.getElementById("gallery-description");
  const count = document.getElementById("gallery-count");
  const progress = document.getElementById("gallery-progress-fill");
  const thumbsContainer = document.getElementById("gallery-thumbs");
  const announcement = document.getElementById("gallery-announcement");
  const prev = document.getElementById("gallery-prev");
  const next = document.getElementById("gallery-next");
  if ([image, stage, fallback, heading, description, count, progress, thumbsContainer, announcement, prev, next].some(el => !el)) return;

  let current = 0;
  let startedX = null;
  let startedY = null;
  const thumbs = [];

  const urlFor = (work) => base + work[0] + "-pro.webp";
  const format = (n) => String(n).padStart(2, "0");

  for (const [index, work] of works.entries()) {
    const thumb = document.createElement("button");
    thumb.type = "button";
    thumb.className = "gallery-thumb";
    thumb.setAttribute("aria-label", "Ver foto " + (index + 1) + ": " + work[1]);
    thumb.setAttribute("aria-pressed", "false");
    thumb.setAttribute("aria-controls", "gallery-stage");
    const thumbImage = document.createElement("img");
    thumbImage.src = urlFor(work);
    thumbImage.alt = "";
    thumbImage.loading = index < 3 ? "eager" : "lazy";
    thumbImage.decoding = "async";
    const badge = document.createElement("span");
    badge.className = "gallery-thumb-label";
    badge.textContent = format(index + 1);
    thumb.append(thumbImage, badge);
    thumb.addEventListener("click", () => show(index));
    thumbs.push(thumb);
    thumbsContainer.appendChild(thumb);
  }

  function show(index, announce = true) {
    current = (index + works.length) % works.length;
    const work = works[current];
    const slideNumber = current + 1;
    heading.textContent = work[1];
    description.textContent = work[2];
    count.textContent = format(slideNumber) + " / " + format(works.length);
    progress.style.width = ((slideNumber / works.length) * 100) + "%";
    if (announce) announcement.textContent = "Foto " + slideNumber + " de " + works.length + ": " + work[1];

    thumbs.forEach((thumb, idx) => {
      const selected = idx === current;
      thumb.classList.toggle("is-active", selected);
      thumb.setAttribute("aria-pressed", String(selected));
      if (selected) thumb.setAttribute("aria-current", "true");
      else thumb.removeAttribute("aria-current");
    });

    fallback.hidden = true;
    stage.classList.add("is-loading");
    image.onload = () => { stage.classList.remove("is-loading"); fallback.hidden = true; };
    image.onerror = () => {
      stage.classList.remove("is-loading");
      fallback.hidden = false;
      fallback.textContent = "Esta foto não pôde ser carregada. Use as setas para ver as outras obras.";
    };
    image.alt = "Obra realizada: " + work[1];
    image.src = urlFor(work);
    if (image.complete && image.naturalWidth > 0) {
      stage.classList.remove("is-loading");
    }

    const activeThumb = thumbs[current];
    if (activeThumb && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      // Rola somente a faixa horizontal de miniaturas, jamais a página.
      const desired = activeThumb.offsetLeft - thumbsContainer.offsetLeft - (thumbsContainer.clientWidth - activeThumb.offsetWidth) / 2;
      thumbsContainer.scrollTo({left: Math.max(0, desired), behavior: "auto"});
    }
  }

  prev.addEventListener("click", () => show(current - 1));
  next.addEventListener("click", () => show(current + 1));

  // Setas do teclado só operam o carrossel quando ele está em foco.
  // Evita comandos globais que poderiam mover a página indevidamente.
  gallery.addEventListener("keydown", event => {
    if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
      event.preventDefault();
      show(current + (event.key === "ArrowRight" ? 1 : -1));
    }
  });

  // Gesto horizontal não bloqueia a rolagem vertical normal no celular.
  stage.addEventListener("touchstart", event => {
    if (event.touches.length !== 1) return;
    startedX = event.touches[0].clientX;
    startedY = event.touches[0].clientY;
  }, {passive:true});
  stage.addEventListener("touchend", event => {
    if (startedX === null || startedY === null || !event.changedTouches.length) return;
    const dx = event.changedTouches[0].clientX - startedX;
    const dy = event.changedTouches[0].clientY - startedY;
    if (Math.abs(dx) >= 55 && Math.abs(dx) > Math.abs(dy) * 1.3) show(current + (dx < 0 ? 1 : -1));
    startedX = startedY = null;
  }, {passive:true});
  stage.addEventListener("touchcancel", () => { startedX = startedY = null; }, {passive:true});

  show(0, false);
})();
