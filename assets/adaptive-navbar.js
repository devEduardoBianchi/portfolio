// Match the section surface beneath the fixed navbar, with no blur or continuous loop.
(() => {
  const header = document.querySelector('.header');
  if (!header) return;
  const sections = [...document.querySelectorAll('main>section, main .project-row, body>footer')];
  let raf = 0, previous = '';
  const rgba = value => (value.match(/[\d.]+/g) || []).map(Number);
  function backgroundFor(section) {
    let element = section;
    while (element) {
      const color = rgba(getComputedStyle(element).backgroundColor);
      if (color.length >= 3 && (color.length < 4 || color[3] >= .95)) return color.slice(0, 3);
      element = element.parentElement;
    }
    return [11, 13, 17];
  }
  function update() {
    raf = 0;
    const height = header.getBoundingClientRect().height;
    document.documentElement.style.setProperty('--header-height', `${height}px`);
    const line = height * .55;
    const section = [...sections].reverse().find(el => {
      const rect = el.getBoundingClientRect();
      return rect.top <= line && rect.bottom > line;
    }) || document.querySelector('.hero');
    const transparent = section?.id === 'inicio' || scrollY < 8;
    const id = `${section?.id || section?.tagName}-${transparent}`;
    if (id === previous) return;
    previous = id;
    const rgb = backgroundFor(section);
    const linear = rgb.map(v => { v /= 255; return v <= .04045 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4; });
    const light = linear[0] * .2126 + linear[1] * .7152 + linear[2] * .0722 > .45;
    header.dataset.surface = transparent ? 'transparent' : light ? 'light' : 'dark';
    header.dataset.section = section?.id || 'footer';
    header.style.setProperty('--adaptive-nav-bg', transparent ? 'transparent' : `rgb(${rgb.join(' ')})`);
    header.style.setProperty('--adaptive-nav-ink', light && !transparent ? '#151923' : '#f2f4f7');
    header.style.setProperty('--adaptive-nav-muted', light && !transparent ? '#454d5b' : '#c0c5cf');
    header.style.setProperty('--adaptive-nav-control', light && !transparent ? '#e5e9f0' : '#15181e');
    header.style.setProperty('--adaptive-nav-line', transparent ? 'transparent' : light ? '#c9ced8' : '#2c3039');
  }
  function schedule() { if (!raf) raf = requestAnimationFrame(update); }
  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', schedule, { passive: true });
  window.addEventListener('load', schedule, { once: true });
  document.addEventListener('portfolio:intro-complete', schedule);
  update();
})();
