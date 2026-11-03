// One-time entrances, separate from the gallery expansion and portrait tilt.
(() => {
  if (document.body.classList.contains('projects-page') || !window.gsap || !('IntersectionObserver' in window)) return;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let observer;
  const timelines = new Set();
  const groups = [];
  function finish() {
    observer?.disconnect();
    timelines.forEach(tl => tl.kill()); timelines.clear();
    groups.forEach(({ root, targets }) => {
      gsap.set(targets, { opacity: 1, visibility: 'inherit', y: 0, scale: 1 });
      root.dataset.homeEntered = 'true';
    });
  }
  function start() {
    if (reduced.matches) return;
    const gallery = document.querySelector('.accordion-gallery');
    const portrait = document.querySelector('.profile-card');
    if (gallery) groups.push({ root: gallery, targets: [...gallery.querySelectorAll('.ag-panel')], photo: false });
    if (portrait) groups.push({ root: portrait, targets: [...portrait.querySelectorAll('.portrait-frame,.profile-caption')], photo: true });
    observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const group = groups.find(group => group.root === entry.target);
        observer.unobserve(entry.target);
        const tl = gsap.timeline({ onComplete: () => {
          timelines.delete(tl);
          // Keep panel transforms: Accordion Gallery owns rotationY.
          gsap.set(group.targets, { clearProps: 'opacity,visibility' });
        } });
        timelines.add(tl);
        tl.to(group.targets, { autoAlpha: 1, y: 0, scale: 1, duration: group.photo ? .85 : .75, stagger: group.photo ? .12 : .09, ease: 'power3.out' });
        group.root.dataset.homeEntered = 'true';
      });
    }, { threshold: .08, rootMargin: '0px 0px -6% 0px' });
    groups.forEach(group => {
      gsap.set(group.targets, { autoAlpha: 0, y: group.photo ? 24 : 32, ...(group.photo ? { scale: .97 } : {}) });
      observer.observe(group.root);
    });
  }
  if (document.documentElement.classList.contains('site-intro-active')) document.addEventListener('portfolio:intro-complete', start, { once: true });
  else start();
  reduced.addEventListener('change', () => { if (reduced.matches) finish(); });
  window.addEventListener('pagehide', finish);
})();
