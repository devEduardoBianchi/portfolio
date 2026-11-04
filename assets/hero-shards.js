// Change only this value to 'shards' to restore the previous background.
const HERO_BACKGROUND = 'aurora';
// Load the background as soon as the DOM is ready, before revealing the hero.
const container = document.querySelector('.hero-shards');
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
let effect;
let generation = 0;
let started = false;
async function start() {
  if (started) return;
  const current = ++generation;
  effect?.destroy();
  effect = null;
  if (!container) return;
  container.dataset.effect = HERO_BACKGROUND;
  if (HERO_BACKGROUND === 'shards' && (reduced.matches || !navigator.gpu || navigator.connection?.saveData)) return;
  started = true;
  try {
    if (HERO_BACKGROUND === 'aurora') {
      const { mountAurora } = await import('./aurora.js?v=20261104-ready');
      if (current !== generation) return;
      effect = { destroy: mountAurora(container, { warm: '#7197ff', light: '#dceaff', cool: '#315eff', deep: '#07152f' }) };
      // The first draw is synchronous; allow it to paint before the text enters.
      requestAnimationFrame(() => requestAnimationFrame(() => {
        if (current === generation) window.releaseHeroEntrance?.();
      }));
      return;
    }
    const { mountAeroShards } = await import('./aero-shards.js');
    if (current !== generation) return;
    const mobile = matchMedia('(max-width: 780px)').matches;
    effect = mountAeroShards(container, {
      shardColor: '#587cff', accentColor: '#83a6ff',
      lightMode: false,
      placement: 'full', material: 'glass', markers: 'plus',
      count: mobile ? 180 : 420, dpr: mobile ? 0.65 : 0.85,
      depthOfField: 0, glow: 0, grain: 0, vignette: 0.4,
      speed: 0.45, mouseInteraction: false, parallax: 0,
      pulseOnClick: false, holdToGather: false,
      onError: () => { container.dataset.fallback = 'true'; }
    });
  } catch { container.dataset.fallback = 'true'; window.releaseHeroEntrance?.(); }
}
reduced.addEventListener('change', () => {
  generation++;
  effect?.destroy();
  effect = null;
  started = false;
  start();
});
window.addEventListener('pagehide', () => { generation++; effect?.destroy(); effect = null; started = false; });
window.addEventListener('pageshow', event => { if (event.persisted) start(); });
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, { once: true });
else start();
