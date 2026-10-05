// Endereços públicos confirmados podem ser adicionados aqui sem alterar o HTML.
const portfolio = {
  email: 'eduardopiresbianchi2003@gmail.com',
  projectUrls: {
    nexoDesk: '',
    entreCenas: '',
    forma: '',
    priceCards: '',
  },
};

document.querySelector('#year').textContent = new Date().getFullYear();

const themeButtons = document.querySelectorAll('[data-theme-choice]');
const themeStatus = document.querySelector('#theme-status');
const themeColor = document.querySelector('meta[name="theme-color"]');
function setTheme(choice, announce = false) {
  const theme = choice === 'light' ? 'light' : 'dark';
  document.documentElement.dataset.theme = theme;
  themeButtons.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.themeChoice === theme)));
  themeColor.content = theme === 'light' ? '#f0f4f4' : '#0a111b';
  if (announce) {
    const message = theme === 'light' ? 'Tema claro ativado.' : 'Tema escuro ativado.';
    themeStatus.textContent = window.PortfolioLanguage?.text(message) || message;
  }
  try { localStorage.setItem('portfolio-theme', theme); } catch { /* O controle continua funcional nesta visita. */ }
}
setTheme(document.documentElement.dataset.theme);
themeButtons.forEach(button => button.addEventListener('click', () => setTheme(button.dataset.themeChoice, true)));

const confirmedUrl = value => {
  try {
    const url = new URL(value);
    return url.protocol === 'https:' ? url.href : null;
  } catch {
    return null;
  }
};

document.querySelectorAll('[data-project]').forEach(link => {
  const url = confirmedUrl(portfolio.projectUrls[link.dataset.project]);
  if (url) link.href = url;
});

const nexoUrl = confirmedUrl(portfolio.projectUrls.nexoDesk);
if (nexoUrl) {
  const slot = document.querySelector('#nexo-link-slot');
  const link = document.createElement('a');
  link.href = nexoUrl;
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
  link.className = 'featured-public-link';
  link.textContent = window.PortfolioLanguage?.text('Abrir Nexo Desk ↗') || 'Abrir Nexo Desk ↗';
  slot.replaceWith(link);
}

const copyButton = document.querySelector('#copy-email');
const copyStatus = document.querySelector('#copy-status');
let statusTimer;
copyButton.addEventListener('click', async () => {
  clearTimeout(statusTimer);
  try {
    await navigator.clipboard.writeText(portfolio.email);
    copyStatus.textContent = window.PortfolioLanguage?.text('E-mail copiado!') || 'E-mail copiado!';
  } catch {
    const message = 'Selecione o endereço acima para copiar ou clique nele para enviar um e-mail.';
    copyStatus.textContent = window.PortfolioLanguage?.text(message) || message;
  }
  statusTimer = setTimeout(() => { copyStatus.textContent = ''; }, 6000);
});

// Conteúdo e links permanecem acessíveis se GSAP não carregar.
if (window.gsap && window.ScrollTrigger) {
  gsap.registerPlugin(ScrollTrigger);
  const motion = gsap.matchMedia();

  motion.add('(prefers-reduced-motion: no-preference)', () => {
    const entrance = gsap.timeline({ defaults: { duration: .7, ease: 'power3.out' } });
    entrance
      .from('.hero .eyebrow-line', { y: 12, opacity: 0, clearProps: 'transform,opacity' }, 0)
      .from('.hero h1>span', { y: 30, opacity: 0, stagger: .09, clearProps: 'transform,opacity' }, .08)
      .from('.hero-statement', { y: 18, opacity: 0, clearProps: 'transform,opacity' }, '<.1')
      .from('.hero-actions', { y: 16, opacity: 0, clearProps: 'transform,opacity' }, '<.08')
      .from('.hero-art', { opacity: 0, duration: 1, clearProps: 'opacity' }, .18)
      .from('.hero-coordinates', { y: 14, opacity: 0, clearProps: 'transform,opacity' }, .38);

    gsap.to('.reading-progress', {
      scaleX: 1, ease: 'none',
      scrollTrigger: { trigger: document.body, start: 'top top', end: 'bottom bottom', scrub: .3 },
    });

    gsap.timeline({
      scrollTrigger: { trigger: '.featured-heading', start: 'top 82%', once: true },
      defaults: { ease: 'power2.out', duration: .65 },
    })
      .from('.featured-heading .chapter-index', { y: 14, clearProps: 'transform' })
      .from('.featured-heading h2', { y: 24, clearProps: 'transform' }, '<.1')
      .from('.featured-heading>p', { y: 16, clearProps: 'transform' }, '<.08');

    gsap.utils.toArray('.project-row').forEach(row => {
      gsap.from(row.querySelector('.project-copy'), {
        y: 24, duration: .68, ease: 'power2.out', clearProps: 'transform',
        scrollTrigger: { trigger: row, start: 'top 82%', once: true },
      });
    });
  });

  motion.add('(min-width: 781px) and (prefers-reduced-motion: no-preference)', () => {
    const shift = gsap.utils.clamp(-3, 3);
    gsap.utils.toArray('.project-visual img').forEach(image => {
      gsap.fromTo(image, { yPercent: shift(-3), scale: 1.06 }, {
        yPercent: shift(3), ease: 'none',
        scrollTrigger: { trigger: image.parentElement, start: 'top bottom', end: 'bottom top', scrub: .8 },
      });
    });
  });

  window.addEventListener('load', () => ScrollTrigger.refresh(), { once: true });
}
