(() => {
  const scenes = [...document.querySelectorAll('.scene')];
  const dots = [...document.querySelectorAll('.progress-dot')];
  const pageNumber = document.getElementById('stagePageNumber');
  const previousButton = document.getElementById('prevScene');
  const nextButton = document.getElementById('nextScene');
  const openEnvelope = document.getElementById('openEnvelope');
  const envelopeHint = document.getElementById('envelopeHint');
  const giftModal = document.getElementById('giftModal');
  const giftModalTitle = document.getElementById('giftModalTitle');
  const giftModalMessage = document.getElementById('giftModalMessage');
  let currentScene = 0;
  let envelopeBusy = false;

  // Comprueba las imágenes. Si todavía no has añadido tus fotos,
  // se muestra una bonita tarjeta de ejemplo en vez de una imagen rota.
  document.querySelectorAll('[data-photo]').forEach((img) => {
    const markLoaded = () => img.closest('.photo-frame')?.classList.add('has-image');
    if (img.complete && img.naturalWidth > 0) markLoaded();
    img.addEventListener('load', markLoaded);
  });

  function showScene(nextIndex) {
    const target = Math.max(0, Math.min(scenes.length - 1, nextIndex));
    if (target === currentScene) return;

    const oldScene = scenes[currentScene];
    const newScene = scenes[target];
    oldScene.classList.remove('active');
    oldScene.classList.add(target > currentScene ? 'leaving-left' : 'leaving-right');
    newScene.classList.remove('leaving-left', 'leaving-right');
    newScene.classList.add('active');

    window.setTimeout(() => oldScene.classList.remove('leaving-left', 'leaving-right'), 750);
    currentScene = target;
    dots.forEach((dot, index) => dot.classList.toggle('active', index === currentScene));
    pageNumber.textContent = `${String(currentScene + 1).padStart(2, '0')} / ${String(scenes.length).padStart(2, '0')}`;
    previousButton.disabled = currentScene === 0;
    nextButton.disabled = currentScene === scenes.length - 1;
  }

  previousButton.addEventListener('click', () => showScene(currentScene - 1));
  nextButton.addEventListener('click', () => showScene(currentScene + 1));
  dots.forEach(dot => dot.addEventListener('click', () => showScene(Number(dot.dataset.go))));

  openEnvelope.addEventListener('click', () => {
    if (envelopeBusy) return;
    envelopeBusy = true;
    openEnvelope.classList.add('opening');
    envelopeHint.textContent = 'UN MOMENTITO... ♡';
    window.setTimeout(() => {
      showScene(1);
      envelopeBusy = false;
      openEnvelope.classList.remove('opening');
      envelopeHint.innerHTML = '<span class="tap-star">✦</span> TOCA EL SOBRE PARA ABRIRLO <span class="tap-star">✦</span>';
    }, 1250);
  });

  const giftMessages = {
    camera: {
      title: 'A little camera 📷',
      message: 'Quiero guardar cada aventura, cada paseo y cada sonrisa contigo. Que nunca nos falten momentos bonitos para fotografiar y recuerdos para volver a mirar.'
    },
    cake: {
      title: 'A birthday wish 🎂',
      message: 'Mi deseo para ti es que la vida te sorprenda con cosas hermosas, que cumplas cada sueño y que siempre encuentres razones para sonreír. Hoy celebramos lo increíble que eres.'
    },
    present: {
      title: 'A little surprise 🎁',
      message: 'Mi regalo favorito no cabe en una caja: es poder compartir tiempo contigo. Gracias por ser parte de mis días y hacerlos mucho más especiales.'
    }
  };

  document.querySelectorAll('.gift-item').forEach(button => {
    button.addEventListener('click', () => {
      const gift = giftMessages[button.dataset.gift];
      if (!gift) return;
      giftModalTitle.textContent = gift.title;
      giftModalMessage.textContent = gift.message;
      giftModal.classList.add('show');
      giftModal.setAttribute('aria-hidden', 'false');
    });
  });

  function closeGiftModal() {
    giftModal.classList.remove('show');
    giftModal.setAttribute('aria-hidden', 'true');
  }
  document.getElementById('closeGift').addEventListener('click', closeGiftModal);
  giftModal.addEventListener('click', event => {
    if (event.target === giftModal) closeGiftModal();
  });

  document.getElementById('playSong').addEventListener('click', () => {
    const songUrl = document.getElementById('songUrl').value.trim();
    if (!songUrl) {
      document.getElementById('songUrl').focus();
      document.getElementById('songUrl').placeholder = 'Primero pega el enlace aquí ♡';
      return;
    }
    try {
      const parsed = new URL(songUrl);
      if (!['https:', 'http:'].includes(parsed.protocol)) throw new Error('URL no válida');
      window.open(parsed.href, '_blank', 'noopener,noreferrer');
    } catch {
      document.getElementById('songUrl').value = '';
      document.getElementById('songUrl').placeholder = 'Ese enlace no parece válido';
    }
  });

  document.getElementById('replayGift').addEventListener('click', () => {
    showScene(0);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') closeGiftModal();
    if (giftModal.classList.contains('show')) return;
    if (event.key === 'ArrowRight' && currentScene < scenes.length - 1) showScene(currentScene + 1);
    if (event.key === 'ArrowLeft' && currentScene > 0) showScene(currentScene - 1);
  });

  previousButton.disabled = true;
  nextButton.disabled = false;
  pageNumber.textContent = `01 / ${String(scenes.length).padStart(2, '0')}`;
})();
