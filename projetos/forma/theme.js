// Roda antes do CSS para aplicar a preferência salva sem piscar entre temas.
(() => {
  const storageKey = 'eduardo-contact-theme';
  let theme = 'dark';

  try {
    if (localStorage.getItem(storageKey) === 'light') theme = 'light';
  } catch {
    // O formulário continua utilizável quando o navegador bloqueia armazenamento.
  }

  function applyTheme(nextTheme) {
    theme = nextTheme;
    document.documentElement.dataset.theme = theme;
    document.querySelector('meta[name="theme-color"]')?.setAttribute(
      'content', theme === 'dark' ? '#101411' : '#f5f6ef'
    );

    const button = document.getElementById('theme-toggle');
    const label = document.getElementById('theme-label');
    if (!button || !label) return;

    const showingLight = theme === 'light';
    button.setAttribute('aria-label', showingLight ? 'Ativar tema escuro' : 'Ativar tema claro');
    label.textContent = showingLight ? 'Tema escuro' : 'Tema claro';
  }

  applyTheme(theme);

  document.addEventListener('DOMContentLoaded', () => {
    applyTheme(theme);
    document.getElementById('theme-toggle').addEventListener('click', () => {
      const nextTheme = theme === 'dark' ? 'light' : 'dark';
      applyTheme(nextTheme);
      try {
        localStorage.setItem(storageKey, nextTheme);
      } catch {
        // A escolha ainda funciona nesta visita, mesmo sem persistência.
      }
    });
  });
})();
