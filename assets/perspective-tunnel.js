// Perspective Tunnel Hero, adapted from the supplied ProfitizeBuild component.
// A fixed introductory stage consumes scrolling without adding distance to the document.
(() => {
  const hero = document.querySelector('.hero');
  if (!hero) return;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const storageKey = 'portfolio-perspective-intro-v2';
  let seen = false;
  try { seen = sessionStorage.getItem(storageKey) === 'done'; } catch {}
  const reveal = () => { if (!reduced.matches) hero.classList.add('hero-reveal-ready'); };
  if (seen || reduced.matches || (location.hash && location.hash !== '#inicio')) { document.documentElement.classList.remove('site-intro-active'); reveal(); return; }

  const images = [
    ['nexo-live.webp', 'Nexo Desk', true],
    ['entrecenas-mobile.webp', 'Entre Cenas · mobile'],
    ['forma-live.webp', 'Forma', true],
    ['fiotech-mobile.webp', 'FIO / tech · mobile'],
    ['pricecards-live.webp', 'Price Cards', true],
    ['nexo-mobile.webp', 'Nexo Desk · mobile'],
    ['fiotech-live.webp', 'FIO / tech', true],
    ['pricecards-mobile.webp', 'Price Cards · mobile'],
    ['entrecenas-live.webp', 'Entre Cenas', true],
  ];
  const track = document.createElement('section');
  track.className = 'tunnel-intro';
  track.innerHTML = `<div class="pt-root">
    <div class="pt-grid"></div><div class="pt-glow"></div>
    <div class="pt-ring"></div><div class="pt-ring pt-ring--outer"></div>
    <div class="pt-copy" style="opacity:0;visibility:hidden"><p class="pt-eyebrow">Portfólio / Desenvolvimento web</p>
      <p class="pt-title">Eduardo<br>Bianchi.</p>
      <p class="pt-description"></p></div>
    <div class="pt-hint"><span></span><div class="pt-hint__line"></div></div>
    <div class="pt-space" aria-hidden="true"></div>
    <button class="pt-skip" type="button"></button>
  </div>`;
  const root = track.firstElementChild;
  const space = root.querySelector('.pt-space');
  const copy = root.querySelector('.pt-copy');
  const hint = root.querySelector('.pt-hint');
  const skip = root.querySelector('.pt-skip');
  const cards = images.map(([src, title, desktop], i) => {
    const card = document.createElement('div');
    card.className = `pt-card${desktop ? ' pt-card--desktop' : ''}`;
    const frame = document.createElement('div');
    frame.className = 'pt-card__frame';
    const img = document.createElement('img');
    img.className = 'pt-card__img';
    img.src = `assets/tunnel/${src}`;
    img.alt = title;
    img.decoding = 'async';
    img.draggable = false;
    const shade = document.createElement('div');
    shade.className = 'pt-card__shade';
    const label = document.createElement('span');
    label.className = 'pt-card__title';
    label.textContent = title;
    shade.append(label);
    frame.append(img, shade);
    card.append(frame);
    space.append(card);
    const angle = i * 137.5 * Math.PI / 180;
    return { el: card, index: i, cos: Math.cos(angle), sin: Math.sin(angle),
      rx: .28 + i % 3 * .08, ry: .26 + i % 2 * .09,
      rotation: (i % 2 ? -1 : 1) * (3 + i % 5 * 2) };
  });
  function translate() {
    const en = document.documentElement.lang === 'en';
    track.setAttribute('aria-label', en ? 'Explore my projects' : 'Conheça meus projetos');
    root.querySelector('.pt-eyebrow').textContent = en ? 'Portfolio / Web development' : 'Portfólio / Desenvolvimento web';
    root.querySelector('.pt-description').textContent = en
      ? 'Scroll to explore my projects and get to know my work.'
      : 'Role para explorar meus projetos e conhecer meu trabalho.';
    hint.querySelector('span').textContent = en ? 'Scroll to explore' : 'Role para explorar';
    skip.textContent = en ? 'Skip intro' : 'Pular abertura';
  }
  translate();
  const content = [...document.body.children].filter(el => ['HEADER', 'MAIN', 'FOOTER'].includes(el.tagName));
  const priorInert = content.map(el => el.inert);
  content.forEach(el => { el.inert = true; });
  document.documentElement.classList.add('site-intro-active');
  document.body.prepend(track);
  document.addEventListener('portfolio:language', translate);
  let width = 0, height = 0, mobile = false, span = 1250;
  let progress = 0, target = 0, px = 0, py = 0, tx = 0, ty = 0;
  let raf = 0, last = 0, finished = false;
  let releaseTimer = 0, releaseDeadline = 0, touchY = null;
  const clamp = v => Math.max(0, Math.min(1, v));
  const lerp = (a, b, p) => a + (b - a) * p;
  function paint() {
    cards.forEach(card => {
      const start = card.index / cards.length * .45;
      const local = clamp((progress - start) / .55);
      const z = lerp(mobile ? -1200 : -1700, mobile ? 350 : 500, local);
      const x = card.cos * width * card.rx - px * (mobile ? 20 : 45);
      const y = card.sin * height * card.ry - py * (mobile ? 20 : 45);
      const alpha = local < .18 ? local / .18 : local > .82 ? 1 - clamp((local - .82) / .16) : 1;
      card.el.style.transform = `translate3d(calc(-50% + ${x}px),calc(-50% + ${y}px),${z}px) rotateZ(${card.rotation}deg)`;
      card.el.style.opacity = alpha;
      card.el.style.visibility = alpha > .005 ? 'visible' : 'hidden';
    });
    copy.style.transform = `scale(${progress < .5 ? lerp(.7, 1, progress * 2) : lerp(1, 1.35, (progress - .5) * 2)})`;
    const textAlpha = progress < .03 ? 0 : progress < .18 ? (progress - .03) / .15 : progress > .85 ? 1 - (progress - .85) / .15 : 1;
    copy.style.opacity = textAlpha;
    copy.style.visibility = textAlpha > .001 ? 'visible' : 'hidden';
    hint.style.opacity = 1 - clamp(progress / .12);
  }
  function finish() {
    if (finished) return;
    finished = true;
    cancelAnimationFrame(raf);

    window.removeEventListener('resize', measure);
    window.removeEventListener('hashchange', finish);
    root.removeEventListener('pointermove', onMove);
    document.removeEventListener('portfolio:language', translate);
    reduced.removeEventListener('change', motionChange);
    track.remove();
    content.forEach((el, i) => { el.inert = priorInert[i]; });
    document.documentElement.classList.add('site-intro-releasing');
    document.documentElement.classList.remove('site-intro-active');
    releaseDeadline = performance.now() + 900;
    releaseSoon();
    window.scrollTo({ top: 0, behavior: 'instant' });
    reveal();
    document.dispatchEvent(new Event('portfolio:intro-complete'));
    try { sessionStorage.setItem(storageKey, 'done'); } catch {}
  }
  function tick(now) {
    raf = 0;
    if (document.hidden || finished) { last = 0; return; }
    const dt = last ? Math.min((now - last) / 1000, .05) : 1 / 60;
    last = now;
    const ease = 1 - Math.exp(-dt / .12);
    progress += (target - progress) * ease;
    px += (tx - px) * ease;
    py += (ty - py) * ease;
    if (Math.abs(target - progress) < .0002) progress = target;
    paint();
    if (progress >= .9998) finish();
    else if (Math.abs(target - progress) > .0002 || Math.abs(tx - px) > .001 || Math.abs(ty - py) > .001) raf = requestAnimationFrame(tick);
    else last = 0;
  }
  function wake() { if (!finished && !raf) raf = requestAnimationFrame(tick); }
  function release() {
    clearTimeout(releaseTimer);
    document.documentElement.classList.remove('site-intro-releasing');
    window.removeEventListener('wheel', onWheel, true);
    window.removeEventListener('touchstart', onTouchStart, true);
    window.removeEventListener('touchmove', onTouchMove, true);
    window.removeEventListener('touchend', onTouchEnd, true);
    window.removeEventListener('touchcancel', onTouchEnd, true);
    window.removeEventListener('keydown', onKey, true);
  }
  function releaseSoon() {
    clearTimeout(releaseTimer);
    releaseTimer = setTimeout(release, Math.max(0, Math.min(180, releaseDeadline - performance.now())));
  }
  function advance(delta) {
    if (finished) { releaseSoon(); return; }
    target = clamp(target + delta);
    wake();
  }
  function onWheel(event) {
    if (event.ctrlKey || Math.abs(event.deltaX) > Math.abs(event.deltaY)) return;
    event.preventDefault();
    const unit = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? height : 1;
    advance(event.deltaY * unit / span);
  }
  function onTouchStart(event) { touchY = event.touches.length === 1 ? event.touches[0].clientY : null; }
  function onTouchMove(event) {
    if (touchY === null || event.touches.length !== 1) return;
    if (event.cancelable) event.preventDefault();
    const y = event.touches[0].clientY;
    advance((touchY - y) * .002);
    touchY = y;
  }
  function onTouchEnd() { touchY = null; }
  function onKey(event) {
    if (event.target.closest('button, input, textarea, select, a')) return;
    const steps = { ArrowDown: .075, ArrowUp: -.075, PageDown: .3, PageUp: -.3, ' ': event.shiftKey ? -.3 : .3, End: 1, Home: -1 };
    if (!(event.key in steps)) return;
    event.preventDefault();
    advance(steps[event.key]);
  }
  function onMove(event) {
    if (mobile || event.pointerType === 'touch') return;
    tx = (event.clientX / width - .5) * 2;
    ty = (event.clientY / height - .5) * 2;
    wake();
  }
  function measure() {
    width = root.clientWidth;
    height = innerHeight;
    mobile = width < 768;
    span = mobile ? 1000 : 1250;
    root.style.setProperty('--pt-vmin', `${Math.min(width, height) / 100}px`);
    cards.forEach(card => { card.el.style.width = `${mobile ? Math.max(130, Math.min(180, width * .38)) : Math.max(180, Math.min(270, width * .18))}px`; });
    wake();
  }
  function motionChange() { if (reduced.matches) finish(); }
  skip.addEventListener('click', finish);
  window.addEventListener('wheel', onWheel, { passive: false, capture: true });
  window.addEventListener('touchstart', onTouchStart, { passive: true, capture: true });
  window.addEventListener('touchmove', onTouchMove, { passive: false, capture: true });
  window.addEventListener('touchend', onTouchEnd, { passive: true, capture: true });
  window.addEventListener('touchcancel', onTouchEnd, { passive: true, capture: true });
  window.addEventListener('keydown', onKey, true);
  window.addEventListener('pagehide', release, { once: true });
  window.addEventListener('resize', measure, { passive: true });
  window.addEventListener('hashchange', finish, { once: true });
  root.addEventListener('pointermove', onMove, { passive: true });
  reduced.addEventListener('change', motionChange);
  measure();
  paint();
})();
