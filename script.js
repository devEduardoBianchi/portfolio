// Endereços públicos confirmados podem ser adicionados aqui sem alterar o HTML.
const portfolio = {
  email: 'eduardopiresbianchi2003@gmail.com',
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
  themeColor.content = theme === 'light' ? '#f4f5f7' : '#090a0d';
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

// Conteúdo e links permanecem acessíveis se GSAP não carregar.
if (window.gsap && window.ScrollTrigger) {
  gsap.registerPlugin(ScrollTrigger);
  const motion = gsap.matchMedia();

  motion.add('(prefers-reduced-motion: no-preference)', () => {
    const entrance = gsap.timeline({ defaults: { duration: .78, ease: 'power3.out' } });
    entrance
      .from('.hero-art', { scale: 1.045, opacity: .35, duration: 1.35, ease: 'power2.out', clearProps: 'transform,opacity' }, 0)
      .from('.hero .eyebrow-line', { y: 12, opacity: 0, clearProps: 'transform,opacity' }, .12)
      .from('.hero h1>span', { y: 36, opacity: 0, stagger: .13, clearProps: 'transform,opacity' }, .24)
      .from('.hero-statement', { y: 18, opacity: 0, clearProps: 'transform,opacity' }, .63)
      .from('.hero-actions', { y: 16, opacity: 0, clearProps: 'transform,opacity' }, .75)
      .from('.hero-coordinates', { y: 14, opacity: 0, clearProps: 'transform,opacity' }, .85);

    gsap.to('.reading-progress', {
      scaleX: 1, ease: 'none',
      scrollTrigger: { trigger: document.body, start: 'top top', end: 'bottom bottom', scrub: .3 },
    });

    gsap.timeline({
      scrollTrigger: { trigger: '.work-intro-body', start: 'top 82%', once: true },
      defaults: { ease: 'power2.out', duration: .65 },
    })
      .from('.work-intro-body h2', { y: 24, clearProps: 'transform' })
      .from('.work-intro-aside', { y: 16, opacity: 0, clearProps: 'transform,opacity' }, '<.08');

    gsap.utils.toArray('.project-row').forEach(row => {
      const elements = [row.querySelector('.project-visual'), row.querySelector('.project-copy')];
      gsap.timeline({
        scrollTrigger: { trigger: row, start: 'top 78%', once: true },
        defaults: { ease: 'power2.out', duration: .72 },
      })
        .from(elements[0], { y: 24, opacity: 0, clearProps: 'transform,opacity' })
        .from(elements[1], { y: 18, opacity: 0, clearProps: 'transform,opacity' }, '<.14');
    });

    gsap.timeline({
      scrollTrigger: { trigger: '.about-grid', start: 'top 80%', once: true },
      defaults: { ease: 'power2.out', duration: .75 },
    })
      .from('.about-identity h2, .about-portrait', { y: 25, opacity: 0, stagger: .1, clearProps: 'transform,opacity' })
      .from('.about-copy', { y: 20, opacity: 0, clearProps: 'transform,opacity' }, '<.18');

    gsap.timeline({
      scrollTrigger: { trigger: '.capabilities', start: 'top 84%', once: true },
      defaults: { ease: 'power2.out', duration: .65 },
    })
      .from('.capabilities h3, .capabilities p', { y: 18, opacity: 0, stagger: .08, clearProps: 'transform,opacity' })
      .from('.skill-row', { x: 20, opacity: 0, stagger: .11, clearProps: 'transform,opacity' }, '<.18');

    gsap.timeline({
      scrollTrigger: { trigger: '.education-grid', start: 'top 80%', once: true },
      defaults: { ease: 'power2.out', duration: .72 },
    })
      .from('.education-intro', { y: 25, opacity: 0, clearProps: 'transform,opacity' })
      .from('.courses>h3, .courses>p', { y: 16, opacity: 0, stagger: .08, clearProps: 'transform,opacity' }, '<.15')
      .from('.course-list li', { y: 17, opacity: 0, stagger: .09, duration: .52, clearProps: 'transform,opacity' }, '<.12');

    gsap.timeline({
      scrollTrigger: { trigger: '.contact h2', start: 'top 82%', once: true },
      defaults: { ease: 'power2.out', duration: .72 },
    })
      .from('.contact h2', { y: 28, opacity: 0, clearProps: 'transform,opacity' })
      .from('.contact-intro, .contact-actions', { y: 20, opacity: 0, stagger: .12, clearProps: 'transform,opacity' }, '<.2');
  });

  window.addEventListener('load', () => ScrollTrigger.refresh(), { once: true });
}
