(() => {
  'use strict';

  const screens = Array.from(document.querySelectorAll('.screen'));
  const openingLine = document.getElementById('openingLine');
  const adviceText = document.getElementById('adviceText');
  const messageCount = document.getElementById('messageCount');
  const adviceProgress = document.getElementById('adviceProgress');
  const nextAdvice = document.getElementById('nextAdvice');
  const adviceHint = document.getElementById('adviceHint');
  const adviceEnd = document.getElementById('adviceEnd');
  const hugStage = document.getElementById('hugStage');
  const hugDialogue = document.getElementById('hugDialogue');
  const startHug = document.getElementById('startHug');
  const musicToggle = document.getElementById('musicToggle');
  const musicLabel = document.getElementById('musicLabel');
  const musicState = document.getElementById('musicState');
  const backgroundMusic = document.getElementById('backgroundMusic');
  const heartField = document.getElementById('heartField');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const advice = [
    'thanga pulla, olungaa saapidanum. Saapidaama irukka koodaadhu.',
    'Correct time-ku thoonganum.Nalla rest Edukkanum.',
    'Enga ponaalum safe-aa po. Veettukku safe-aa thirumbi vaa.',
    'Romba kova padaadha. Konjam porumaiyaa irukkanum.',
    'Un health-ah nallaa paathukko . Udambu sari illa na udane hospital ku po, rest edu.',
    'Thanni niraiyaa kudikkanum. Unna nee nallaa paathukkanum.',
    'Appa eppayumey una paathutey irupa.',
    'en thangapulla enaku eppavume  chellaponnudhaan.',
    'eppayumey sirichittu sandhoshamaa irukkanum.',
    'En ponnu eppavume thaniya illa. appa epayum unkoodatha irupa.',
    'Edha paathum bayapadakoodathu. Unnaala ellathaiyum face panna mudiyum.',
    'Unna nee nallaa paathukko. Adhudhaan enakku romba mukkiyam.'
  ];
  const hugMessages = [
    'En chella pulla?',
    'Konjam neram appa madiyila paduthukko.',
    'Ellathaiyum manasula vachittu kashtapadaadha. appa unkoodaye tha iruka',
    'En ponnu eppavume sandhoshamaa irukkanum.'
  ];

  let currentAdvice = 0;
  let openingTimer = 0;
  let hugTimers = [];
  let musicPlaying = false;
  let heartTimer = 0;

  function showScreen(id) {
    const target = document.getElementById(id);
    if (!target || target.classList.contains('is-active')) return;
    const current = document.querySelector('.screen.is-active');
    if (current) {
      current.classList.remove('is-active');
      current.classList.add('is-leaving');
      current.setAttribute('aria-hidden', 'true');
      window.setTimeout(() => current.classList.remove('is-leaving'), 700);
    }
    target.classList.add('is-active');
    target.setAttribute('aria-hidden', 'false');
    const focusTarget = target.querySelector('button');
    if (focusTarget) window.setTimeout(() => focusTarget.focus({ preventScroll: true }), 400);
  }

  function typeOpening() {
    const characters = Array.from('Hi En thanga Pulla... ❤️\nEn chellakutty epdi irukka?');
    let index = 0;
    window.clearInterval(openingTimer);
    openingLine.textContent = '';
    const interval = reducedMotion ? 1 : 52;
    openingTimer = window.setInterval(() => {
      openingLine.textContent += characters[index];
      index += 1;
      if (index >= characters.length) window.clearInterval(openingTimer);
    }, interval);
  }

  function renderAdvice(index) {
    currentAdvice = index;
    const humanCount = String(index + 1).padStart(2, '0');
    adviceText.classList.remove('text-enter');
    void adviceText.offsetWidth;
    adviceText.textContent = advice[index];
    adviceText.classList.add('text-enter');
    messageCount.innerHTML = `${humanCount} <span>/</span> 12`;
    adviceProgress.replaceChildren();
    advice.forEach((_, pipIndex) => {
      const pip = document.createElement('span');
      pip.className = `progress-pip${pipIndex <= index ? ' done' : ''}`;
      adviceProgress.append(pip);
    });

    const expressions = [
      'loving', 'restful', 'protective', 'patient', 'concerned', 'cheerful',
      'watchful', 'proud', 'joyful', 'tender', 'encouraging', 'warm'
    ];
    document.querySelectorAll('#care .dad').forEach((dad) => {
      dad.setAttribute('data-expression', expressions[index]);
      dad.classList.remove('message-reaction');
      void dad.offsetWidth;
      dad.classList.add('message-reaction');
    });

    const isLast = index === advice.length - 1;
    nextAdvice.hidden = isLast;
    adviceHint.hidden = isLast;
    adviceEnd.hidden = !isLast;
  }

  function clearHugTimers() {
    hugTimers.forEach((timer) => window.clearTimeout(timer));
    hugTimers = [];
  }

  function startHugSequence() {
    if (startHug.disabled) return;
    startHug.disabled = true;
    startHug.innerHTML = '<span>appavoda konjam neram</span><span class="button-heart">♡</span>';
    hugDialogue.textContent = '';
    hugStage.classList.add('is-hugging');
    const timings = reducedMotion ? [80, 160, 240, 320, 420] : [750, 2600, 4700, 7200, 9900];

    hugTimers.push(window.setTimeout(() => {
      hugDialogue.textContent = hugMessages[0];
    }, timings[0]));
    hugTimers.push(window.setTimeout(() => {
      hugStage.classList.add('is-patting');
      hugDialogue.textContent = hugMessages[1];
    }, timings[1]));
    hugTimers.push(window.setTimeout(() => {
      hugStage.classList.add('is-lap');
      hugDialogue.textContent = hugMessages[2];
    }, timings[2]));
    hugTimers.push(window.setTimeout(() => {
      hugDialogue.textContent = hugMessages[3];
    }, timings[3]));
    hugTimers.push(window.setTimeout(() => {
      showScreen('final');
      hugStage.classList.remove('is-hugging', 'is-patting', 'is-lap');
      startHug.disabled = false;
      startHug.innerHTML = '<span>Appa,</span><span class="button-heart">❤️</span>';
    }, timings[4]));
  }

  function createHeart() {
    const heart = document.createElement('span');
    const size = 10 + Math.random() * 15;
    heart.className = 'floating-heart';
    heart.textContent = Math.random() > .55 ? '♡' : '·';
    heart.style.left = `${Math.random() * 100}%`;
    heart.style.fontSize = `${size}px`;
    heart.style.setProperty('--duration', `${9 + Math.random() * 8}s`);
    heart.style.setProperty('--drift', `${Math.round(Math.random() * 100 - 50)}px`);
    heart.addEventListener('animationend', () => heart.remove(), { once: true });
    heartField.append(heart);
  }

  async function toggleMusic() {
    if (musicPlaying) {
      backgroundMusic.pause();
      musicPlaying = false;
      musicToggle.setAttribute('aria-pressed', 'false');
      musicLabel.textContent = 'A little music';
      musicState.textContent = 'OFF';
      return;
    }

    try {
      await backgroundMusic.play();
      musicPlaying = true;
      musicToggle.setAttribute('aria-pressed', 'true');
      musicLabel.textContent = 'The Feel of Baththa';
      musicState.textContent = 'ON';
    } catch (error) {
      musicPlaying = false;
      musicToggle.setAttribute('aria-pressed', 'false');
      musicLabel.textContent = 'Music unavailable';
      musicState.textContent = 'OFF';
      console.error('Could not play The Feel of Baththa.mp3:', error);
    }
  }

  document.getElementById('toCare').addEventListener('click', () => {
    clearHugTimers();
    renderAdvice(0);
    showScreen('care');
  });
  nextAdvice.addEventListener('click', () => {
    if (currentAdvice < advice.length - 1) renderAdvice(currentAdvice + 1);
  });
  document.getElementById('toHug').addEventListener('click', () => {
    clearHugTimers();
    hugStage.classList.remove('is-hugging', 'is-patting', 'is-lap');
    hugDialogue.textContent = '';
    startHug.disabled = false;
    showScreen('hug');
  });
  startHug.addEventListener('click', startHugSequence);
  document.getElementById('startAgain').addEventListener('click', () => {
    clearHugTimers();
    currentAdvice = 0;
    renderAdvice(0);
    typeOpening();
    showScreen('welcome');
  });
  musicToggle.addEventListener('click', toggleMusic);

  typeOpening();
  renderAdvice(0);
  heartTimer = window.setInterval(createHeart, reducedMotion ? 2800 : 1500);
  if (!reducedMotion) {
    for (let i = 0; i < 4; i += 1) window.setTimeout(createHeart, i * 620);
  }
  window.addEventListener('pagehide', () => {
    window.clearInterval(openingTimer);
    window.clearInterval(heartTimer);
    clearHugTimers();
    backgroundMusic.pause();
  }, { once: true });
})();
