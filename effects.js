// Dois efeitos leves, inspirados no Light Tunnel e Logo Loop, sem mudar a stack do site.
const toolLoop = document.querySelector('.tool-loop');
if (toolLoop && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const track = toolLoop.querySelector('.tool-loop-track');
  const duplicate = track.querySelector('.tool-loop-set').cloneNode(true);
  duplicate.setAttribute('aria-hidden', 'true');
  track.append(duplicate);
  toolLoop.classList.add('is-ready');
  new IntersectionObserver(entries => {
    toolLoop.classList.toggle('is-in-view', entries[0].isIntersecting);
  }).observe(toolLoop);
}

const hero = document.querySelector('.hero');
const canvas = hero?.querySelector('.hero-tunnel');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
if (canvas && !reducedMotion.matches && !navigator.connection?.saveData) {
  const context = canvas.getContext('2d', { alpha: true });
  if (context) {
    let width = 0;
    let height = 0;
    let active = false;
    let inView = false;
    let rafId = 0;
    let lastFrame = 0;
    let tick = 0;
    let targetX = .76;
    let targetY = .53;
    let focusX = targetX;
    let focusY = targetY;
    let rgb = '91,130,255';
    const rays = Array.from({ length: 26 }, (_, index) => ({
      angle: index * Math.PI * (3 - Math.sqrt(5)),
      lane: .23 + (index % 5) * .11,
      speed: .0026 + (index % 7) * .00028,
      phase: ((index * 13) % 37) / 37,
    }));

    const readTheme = () => {
      rgb = getComputedStyle(document.documentElement).getPropertyValue('--tunnel-rgb').trim() || '91,130,255';
    };
    const resize = () => {
      const bounds = hero.getBoundingClientRect();
      width = Math.max(1, bounds.width);
      height = Math.max(1, bounds.height);
      const ratio = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(height * ratio);
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
    };
    const point = (angle, lane, depth, centerX, centerY) => {
      const spread = .06 + depth * depth * 1.23;
      return {
        x: centerX + Math.cos(angle) * width * lane * spread,
        y: centerY + Math.sin(angle) * height * lane * spread,
      };
    };
    const render = now => {
      if (!active) return;
      rafId = requestAnimationFrame(render);
      if (now - lastFrame < 40) return;
      lastFrame = now;
      tick += 1;
      context.clearRect(0, 0, width, height);
      focusX += (targetX - focusX) * .035;
      focusY += (targetY - focusY) * .035;
      const centerX = width * focusX;
      const centerY = height * focusY;

      // Fibras discretas criam profundidade sem cobrir o retrato ou o nome.
      rays.forEach((ray, index) => {
        const far = point(ray.angle, ray.lane, 1.1, centerX, centerY);
        const near = point(ray.angle, ray.lane, .04, centerX, centerY);
        context.beginPath();
        context.moveTo(far.x, far.y);
        context.quadraticCurveTo(centerX + (far.x - centerX) * .22, centerY + (far.y - centerY) * .22, near.x, near.y);
        context.strokeStyle = `rgba(${rgb},${index % 3 === 0 ? .13 : .065})`;
        context.lineWidth = index % 4 === 0 ? 1.1 : .65;
        context.stroke();

        const depth = (ray.phase + tick * ray.speed) % 1;
        const head = point(ray.angle, ray.lane, depth, centerX, centerY);
        const tail = point(ray.angle, ray.lane, Math.max(0, depth - .075), centerX, centerY);
        const streak = context.createLinearGradient(tail.x, tail.y, head.x, head.y);
        streak.addColorStop(0, `rgba(${rgb},0)`);
        streak.addColorStop(1, `rgba(${rgb},${.24 + depth * .48})`);
        context.beginPath();
        context.moveTo(tail.x, tail.y);
        context.lineTo(head.x, head.y);
        context.strokeStyle = streak;
        context.lineWidth = 1 + depth * 1.2;
        context.stroke();
      });
    };
    const start = () => {
      if (active || !inView || document.hidden || reducedMotion.matches) return;
      active = true;
      rafId = requestAnimationFrame(render);
    };
    const stop = () => {
      active = false;
      cancelAnimationFrame(rafId);
    };
    const observer = new IntersectionObserver(entries => {
      inView = entries[0].isIntersecting;
      if (inView) start();
      else stop();
    }, { threshold: 0 });
    const themeObserver = new MutationObserver(readTheme);
    observer.observe(hero);
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    hero.addEventListener('pointermove', event => {
      if (event.pointerType === 'touch') return;
      const rect = hero.getBoundingClientRect();
      targetX = .76 + ((event.clientX - rect.left) / rect.width - .5) * .04;
      targetY = .53 + ((event.clientY - rect.top) / rect.height - .5) * .045;
    }, { passive: true });
    hero.addEventListener('pointerleave', () => { targetX = .76; targetY = .53; });
    document.addEventListener('visibilitychange', () => document.hidden ? stop() : start());
    reducedMotion.addEventListener('change', () => reducedMotion.matches ? stop() : start());
    new ResizeObserver(resize).observe(hero);
    readTheme();
    resize();
  }
}
