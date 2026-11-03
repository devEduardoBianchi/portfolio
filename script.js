// Endereços públicos confirmados podem ser adicionados aqui sem alterar o HTML.
const portfolio = {
  email: 'deveduardobianchi@gmail.com',
  projectUrls: {
    nexoDesk: 'https://nexo-desk-pi.vercel.app/',
    nexoOficina: 'https://nexo-informatica-murex.vercel.app/',
    entreCenas: 'https://entrecenas-blond.vercel.app/',
    forma: 'https://forma-nine-wheat.vercel.app/#inicio',
    priceCards: 'https://pricecards.vercel.app/#inicio',
    fioTech: 'https://fiotech-six.vercel.app/',
  },
};

document.querySelector('#year').textContent = new Date().getFullYear();

document.documentElement.dataset.theme = 'dark';

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

// O indicador acompanha a seção que ocupa a faixa de leitura da tela.
const sectionLinks = [...document.querySelectorAll('.header nav a[href^="#"]')];
if ('IntersectionObserver' in window && sectionLinks.length) {
  const visibleSections = new Map();
  const sections = sectionLinks.map(link => document.querySelector(link.getAttribute('href'))).filter(Boolean);
  const sectionObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) visibleSections.set(entry.target.id, entry.target);
      else visibleSections.delete(entry.target.id);
    });
    const active = [...visibleSections.values()].sort((a, b) =>
      Math.abs(a.getBoundingClientRect().top - window.innerHeight * .3) -
      Math.abs(b.getBoundingClientRect().top - window.innerHeight * .3)
    )[0];
    sectionLinks.forEach(link => {
      if (active && link.hash === `#${active.id}`) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  }, { rootMargin: '-25% 0px -65% 0px' });
  sections.forEach(section => sectionObserver.observe(section));
}

// Compara as capturas reais de desktop e celular sem alterar os links dos projetos.
const previewControl = document.querySelector('.preview-control');
const previewButtons = document.querySelectorAll('[data-preview-mode]');
const previews = [...document.querySelectorAll('.project-visual picture')].map(picture => ({
  image: picture.querySelector('img'),
  desktop: picture.querySelector('img').getAttribute('src'),
  mobile: picture.querySelector('source')?.getAttribute('srcset'),
}));
if (previews.length && previews.every(preview => preview.mobile)) {
  previewControl.hidden = false;
  previewButtons.forEach(button => button.addEventListener('click', () => {
    const mode = button.dataset.previewMode;
    document.querySelector('.work-section').dataset.previewMode = mode;
    previewButtons.forEach(item => item.setAttribute('aria-pressed', String(item === button)));
    window.PortfolioSwitch?.update(previewControl, mode, true);
    previews.forEach(preview => { preview.image.src = mode === 'mobile' ? preview.mobile : preview.desktop; });
  }));
}

[
  { key: 'nexoDesk', slot: '#nexo-link-slot', label: 'Abrir Nexo Desk ↗' },
  { key: 'fioTech', slot: '#fio-link-slot', label: 'Abrir FIO / tech ↗' },
].forEach(project => {
  const url = confirmedUrl(portfolio.projectUrls[project.key]);
  if (!url) return;
  const link = document.createElement('a');
  link.href = url;
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
  link.className = 'project-public-link';
  link.dataset.publicProject = project.key;
  link.textContent = window.PortfolioLanguage?.text(project.label) || project.label;
  document.querySelector(project.slot)?.replaceWith(link);
});

const copyButton = document.querySelector('#copy-email');
const copyStatus = document.querySelector('#copy-status');
let statusTimer;
let copyFeedbackTimer;
copyButton.addEventListener('click', async () => {
  clearTimeout(statusTimer);
  clearTimeout(copyFeedbackTimer);
  try {
    await navigator.clipboard.writeText(portfolio.email);
    copyButton.dataset.copied = 'true';
    copyStatus.classList.add('sr-only');
    copyStatus.textContent = window.PortfolioLanguage?.text('E-mail copiado!') || 'E-mail copiado!';
    copyFeedbackTimer = setTimeout(() => { copyButton.dataset.copied = 'false'; }, 2400);
  } catch {
    const message = 'Selecione o endereço acima para copiar ou clique nele para enviar um e-mail.';
    copyButton.dataset.copied = 'false';
    copyStatus.classList.remove('sr-only');
    copyStatus.textContent = window.PortfolioLanguage?.text(message) || message;
  }
  statusTimer = setTimeout(() => { copyStatus.textContent = ''; }, 6000);
});

// O índice acompanha o estudo de caso em leitura, inclusive sem GSAP.
const projectRows = [...document.querySelectorAll('.project-row')];
const projectIndexLinks = [...document.querySelectorAll('.work-index a')];
if ('IntersectionObserver' in window) {
  const projectObserver = new IntersectionObserver(entries => {
    const current = entries.find(entry => entry.isIntersecting);
    if (!current) return;
    projectIndexLinks.forEach(link => {
      if (link.hash === `#${current.target.id}`) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  }, { rootMargin: '-25% 0px -55% 0px' });
  projectRows.forEach(row => projectObserver.observe(row));
}

// Entrada inspirada em Animated Content: só transforma elementos quando há suporte e movimento permitido.
const motionAllowed = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (motionAllowed && !document.body.classList.contains('projects-page') && 'IntersectionObserver' in window) {
  const targets = document.querySelectorAll('.work-intro-body, .project-copy, .about-heading, .about-copy, .capabilities, .skill-row, .education-intro, .courses, .contact h2, .contact-bottom');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  }, { threshold: .12, rootMargin: '0px 0px -18% 0px' });
  targets.forEach(target => {
    if (target.getBoundingClientRect().top < window.innerHeight * .8) return;
    target.classList.add('animated-content');
    observer.observe(target);
  });
}

const progress = document.querySelector('.reading-progress');
let progressFrame = 0;
function updateProgress() {
  if (progressFrame) return;
  progressFrame = requestAnimationFrame(() => {
    const total = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.transform = `scaleX(${total > 0 ? window.scrollY / total : 0})`;
    progressFrame = 0;
  });
}
window.addEventListener('scroll', updateProgress, { passive: true });
window.addEventListener('resize', updateProgress, { passive: true });
updateProgress();

// Revelação curta do nome; o texto permanece legível sem JavaScript.
// The ScrollExpand opening starts the hero content reveal after expansion.

// Inclinação leve do retrato. A foto e o link continuam utilizáveis sem JavaScript.
const profileCard = document.querySelector('.profile-card');
if (profileCard && motionAllowed && window.matchMedia('(hover: hover)').matches) {
  profileCard.addEventListener('pointermove', event => {
    const bounds = profileCard.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - .5;
    const y = (event.clientY - bounds.top) / bounds.height - .5;
    profileCard.style.setProperty('--card-rotate-x', `${-y * 7}deg`);
    profileCard.style.setProperty('--card-rotate-y', `${x * 7}deg`);
    profileCard.style.setProperty('--glare-x', `${(x + .5) * 100}%`);
    profileCard.style.setProperty('--glare-y', `${(y + .5) * 100}%`);
  });
  profileCard.addEventListener('pointerleave', () => {
    profileCard.style.removeProperty('--card-rotate-x');
    profileCard.style.removeProperty('--card-rotate-y');
  });
}
