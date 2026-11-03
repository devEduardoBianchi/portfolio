// Relevo-inspired previews with GSAP entrance only, once per visit.
(() => {
  if (!document.body.classList.contains('projects-page') || !window.gsap) return;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const pointer = matchMedia('(hover: hover) and (pointer: fine) and (min-width: 901px)');
  const rows = [...document.querySelectorAll('.relevo')];
  const timelines = new Set();
  const pending = new Map();
  const cleanupPointer = [];
  const restorePointer = [];
  const io = 'IntersectionObserver' in window ? new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      pending.get(entry.target)?.();
      pending.delete(entry.target);
      io.unobserve(entry.target);
    });
  }, { rootMargin: '0px 0px -6% 0px', threshold: .06 }) : null;

  function track(timeline) {
    timelines.add(timeline);
    timeline.eventCallback('onComplete', () => timelines.delete(timeline));
    return timeline;
  }
  function revealGroup(root, elements, stage) {
    elements = [...elements].filter(Boolean);
    if (!elements.length || reduced.matches) return;
    gsap.set(elements, { autoAlpha: 0, y: 24 });
    if (stage) gsap.set(stage, { autoAlpha: 0, y: 36, scale: .97 });
    const play = () => {
      const tl = track(gsap.timeline({ defaults: { duration: .7, ease: 'power3.out' } }));
      tl.to(elements, { autoAlpha: 1, y: 0, stagger: .08, clearProps: 'opacity,visibility,transform' }, 0);
      if (stage) tl.to(stage, { autoAlpha: 1, y: 0, scale: 1, duration: .85, clearProps: 'opacity,visibility,transform' }, .12);
      root.dataset.entered = 'true';
    };
    if (io) { pending.set(root, play); io.observe(root); }
    else play();
  }

  if (!reduced.matches) {
    const header = document.querySelector('.header');
    const headerItems = [...header.children];
    track(gsap.from(headerItems, { autoAlpha: 0, y: -12, duration: .55, stagger: .06, ease: 'power3.out', clearProps: 'opacity,visibility,transform' }));
    const intro = document.querySelector('.work-section');
    revealGroup(document.querySelector('.work-intro-body'), [intro.querySelector('.section-label'), intro.querySelector('h1'), intro.querySelector('.work-intro-aside'), intro.querySelector('.work-index')]);
    rows.forEach(row => revealGroup(row, row.querySelector('.relevo__copy').children, row.querySelector('.relevo__stage')));
    const contact = document.querySelector('.contact');
    revealGroup(contact, contact.querySelector('.contact-inner').children);
    const footer = document.querySelector('.footer');
    revealGroup(footer, footer.children);
  }

  // A shared content height gives every desktop project the same vertical rhythm.
  const list = document.querySelector('.project-list');
  let measureFrame = 0, previousHeight = 0;
  function measure() {
    if (measureFrame) return;
    measureFrame = requestAnimationFrame(() => {
      measureFrame = 0;
      const height = Math.ceil(Math.max(...rows.map(row => Math.max(row.querySelector('.relevo__copy').offsetHeight, row.querySelector('.relevo__stage').offsetHeight))));
      if (height !== previousHeight) { previousHeight = height; list.style.setProperty('--relevo-content-height', `${height}px`); }
    });
  }
  const sizeObserver = new ResizeObserver(measure);
  rows.forEach(row => { sizeObserver.observe(row.querySelector('.relevo__copy')); sizeObserver.observe(row.querySelector('.relevo__stage')); });
  measure();

  rows.forEach(row => {
    const stage = row.querySelector('.relevo__stage');
    let frame = 0, point;
    const reset = () => {
      cancelAnimationFrame(frame); frame = 0;
      stage.style.removeProperty('--rx'); stage.style.removeProperty('--ry');
    };
    const move = event => {
      if (reduced.matches || !pointer.matches || event.pointerType !== 'mouse') return;
      point = { x: event.clientX, y: event.clientY };
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        const rect = stage.getBoundingClientRect();
        const x = Math.max(0, Math.min(1, (point.x - rect.left) / rect.width));
        const y = Math.max(0, Math.min(1, (point.y - rect.top) / rect.height));
        stage.style.setProperty('--rx', `${(x - .5) * 10}deg`);
        stage.style.setProperty('--ry', `${(.5 - y) * 10}deg`);
      });
    };
    const attach = () => { stage.addEventListener('pointermove', move, { passive: true }); stage.addEventListener('pointerleave', reset); pointer.addEventListener('change', reset); };
    attach(); restorePointer.push(attach);
    cleanupPointer.push(() => { reset(); stage.removeEventListener('pointermove', move); stage.removeEventListener('pointerleave', reset); pointer.removeEventListener('change', reset); });
  });

  function finish() {
    io?.disconnect(); pending.clear();
    timelines.forEach(tl => tl.kill()); timelines.clear();
    gsap.set(document.querySelectorAll('.header>*,.work-section>.section-label,.work-intro-body h1,.work-intro-aside,.work-index,.relevo__copy>*,.relevo__stage,.contact-inner>*,.footer>*'), { clearProps: 'opacity,visibility,transform' });
    cleanupPointer.forEach(fn => fn());
  }
  reduced.addEventListener('change', () => { if (reduced.matches) finish(); else restorePointer.forEach(fn => fn()); });
  window.addEventListener('pagehide', finish);
  window.addEventListener('pageshow', event => { if (event.persisted && !reduced.matches) restorePointer.forEach(fn => fn()); });
})();
