// Endereços públicos confirmados podem ser adicionados aqui sem alterar o HTML.
const portfolio = {
  email: 'deveduardobianchi@gmail.com',
  projectUrls: {
    nexoDesk: 'https://nexo-desk-pi.vercel.app/',
    entreCenas: 'https://entrecenas-blond.vercel.app/',
    forma: 'https://forma-nine-wheat.vercel.app/#inicio',
    priceCards: 'https://pricecards.vercel.app/#inicio',
    fioTech: 'https://fiotech-six.vercel.app/',
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
  window.PortfolioSwitch?.update(document.querySelector('.theme-switch'), theme, announce);
  themeColor.content = theme === 'light' ? '#f5f6f8' : '#0b0d11';
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

// Janela de comandos: navegação rápida por seções e projetos já presentes na página.
const quickOpen = document.querySelector('#quick-open');
const quickDialog = document.querySelector('#quick-dialog');
const quickInput = document.querySelector('#quick-input');
const quickResults = [...quickDialog.querySelectorAll('.quick-result')];
const quickGroups = [...quickDialog.querySelectorAll('.quick-group')];
const quickEmpty = quickDialog.querySelector('.quick-empty');
const normalizeQuery = value => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();

function filterQuickResults() {
  const query = normalizeQuery(quickInput.value);
  quickResults.forEach(link => {
    link.hidden = !!query && !normalizeQuery(`${link.textContent} ${link.dataset.search}`).includes(query);
  });
  quickGroups.forEach(group => { group.hidden = !group.querySelector('.quick-result:not([hidden])'); });
  quickEmpty.hidden = quickResults.some(link => !link.hidden);
}

function openQuickDialog() {
  quickInput.value = '';
  filterQuickResults();
  quickDialog.showModal();
  quickInput.focus();
}

quickOpen.addEventListener('click', () => openQuickDialog());
quickDialog.querySelector('.quick-close').addEventListener('click', () => quickDialog.close());
quickDialog.addEventListener('click', event => { if (event.target === quickDialog) quickDialog.close(); });
quickInput.addEventListener('input', filterQuickResults);
quickDialog.addEventListener('keydown', event => {
  const available = quickResults.filter(link => !link.hidden);
  if (!available.length) return;
  if (event.key === 'Enter' && document.activeElement === quickInput) {
    event.preventDefault();
    available[0].click();
  }
  if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
    event.preventDefault();
    const current = available.indexOf(document.activeElement);
    const next = event.key === 'ArrowDown'
      ? (current + 1) % available.length
      : (current < 0 ? available.length - 1 : (current - 1 + available.length) % available.length);
    available[next].focus();
  }
});
quickResults.forEach(link => link.addEventListener('click', () => quickDialog.close()));
document.addEventListener('keydown', event => {
  if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
    event.preventDefault();
    if (quickDialog.open) quickDialog.close();
    else openQuickDialog();
  }
});

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
  document.querySelector(project.slot).replaceWith(link);
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
if (motionAllowed && 'IntersectionObserver' in window) {
  const targets = document.querySelectorAll('.work-intro-body, .project-copy, .about-identity h2, .about-copy, .capabilities, .skill-row, .education-intro, .courses, .contact h2, .contact-bottom');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  }, { threshold: .08, rootMargin: '0px 0px -8% 0px' });
  targets.forEach(target => {
    if (target.getBoundingClientRect().top < window.innerHeight * .95) return;
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
if (motionAllowed) document.querySelector('.hero')?.classList.add('hero-reveal-ready');

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
