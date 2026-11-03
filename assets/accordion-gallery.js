// Accordion Gallery adapted from the supplied React Bits source for vanilla HTML.
(() => {
  const root = document.querySelector('.accordion-gallery');
  if (!root) return;
  const panels = [...root.querySelectorAll('.ag-panel')];
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const mobile = matchMedia('(max-width: 640px)');
  const hover = matchMedia('(hover: hover)');
  let active = 0, timeline;
  function layout(animate = true) {
    timeline?.kill();
    const duration = animate && !reduced.matches ? .6 : 0;
    const usable = root.clientWidth - 12 * (panels.length - 1);
    root.style.setProperty('--ag-media-width', `${Math.max(usable * .52, 240)}px`);
    timeline = window.gsap?.timeline();
    panels.forEach((panel, index) => {
      const open = index === active;
      panel.classList.toggle('ag-panel--active', open);
      panel.setAttribute('aria-expanded', String(open));
      const values = mobile.matches
        ? { height: open ? 280 : 62, flexGrow: 0, rotationY: 0 }
        : { height: root.clientHeight, flexGrow: open ? 4.333 : 1, rotationY: open ? 0 : index < active ? 4 : -4 };
      if (timeline) {
        timeline.to(panel, { ...values, duration, ease: 'power3.out' }, 0);
        timeline.to(panel.querySelector('.ag-media'), { x: open || mobile.matches ? 0 : Math.max(-1.5, Math.min(1.5, active-index)) * 12, duration, ease: 'power3.out' }, 0);
      } else {
        panel.style.height = `${values.height}px`;
        panel.style.flexGrow = values.flexGrow;
      }
    });
  }
  function select(index) { if (index !== active) { active = index; layout(); } }
  panels.forEach((panel, index) => {
    panel.addEventListener('pointerenter', event => { if (hover.matches && event.pointerType !== 'touch') select(index); });
    panel.addEventListener('click', () => select(index));
    panel.addEventListener('focus', () => select(index));
    panel.addEventListener('keydown', event => {
      let next;
      if (['ArrowRight', 'ArrowDown'].includes(event.key)) next = (index + 1) % panels.length;
      if (['ArrowLeft', 'ArrowUp'].includes(event.key)) next = (index - 1 + panels.length) % panels.length;
      if (event.key === 'Home') next = 0;
      if (event.key === 'End') next = panels.length - 1;
      if (next === undefined) return;
      event.preventDefault(); panels[next].focus();
    });
  });
  let previousWidth = root.clientWidth;
  new ResizeObserver(() => {
    if (Math.abs(root.clientWidth - previousWidth) < 1) return;
    previousWidth = root.clientWidth; layout(false);
  }).observe(root);
  reduced.addEventListener('change', () => layout(false));
  mobile.addEventListener('change', () => layout(false));
  document.addEventListener('portfolio:language', () => layout(false));
  window.addEventListener('pagehide', () => timeline?.kill());
  layout(false);
})();
