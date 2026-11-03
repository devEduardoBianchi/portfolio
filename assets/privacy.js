// Preferência de medição; nenhuma biblioteca de publicidade é carregada aqui.
(() => {
  // Nova versão: a escolha agora abrange a Meta e o Google Analytics.
  const key = 'portfolio-privacy-v2';
  const lifetime = 180 * 24 * 60 * 60 * 1000;
  let choice = null;
  try {
    const saved = JSON.parse(localStorage.getItem(key));
    if (saved && typeof saved.allowed === 'boolean' && saved.at <= Date.now() && Date.now() - saved.at < lifetime) choice = saved.allowed;
  } catch { /* A escolha vale nesta página mesmo sem armazenamento. */ }

  const style = document.createElement('style');
  style.textContent = `.privacy-notice{position:fixed;right:18px;bottom:18px;z-index:1000;width:min(440px,calc(100vw - 36px));max-height:calc(100svh - 36px);overflow:auto;padding:20px;border:1px solid var(--line,#39404f);border-radius:8px;background:var(--paper,#10131a);color:var(--ink,#f1f3f7);font:400 14px/1.6 Raleway,system-ui,sans-serif;box-shadow:0 8px 32px #0003}.privacy-notice[hidden]{display:none}.privacy-notice h2{margin:0 0 8px;font:700 17px/1.4 Raleway,system-ui,sans-serif}.privacy-notice p{margin:0 0 10px}.privacy-notice a{color:var(--blue,#587bff);text-decoration:underline}.privacy-notice-actions{display:flex;gap:10px;margin-top:16px}.privacy-notice button{flex:1;min-height:44px;padding:9px;border:1px solid var(--blue,#587bff);border-radius:4px;background:transparent;color:inherit;font:600 13px/1.4 Raleway,system-ui,sans-serif;cursor:pointer}.privacy-notice button[data-choice="accept"]{background:var(--blue,#587bff);color:var(--accent-ink,#fff)}.privacy-notice button:focus-visible,.privacy-notice a:focus-visible{outline:3px solid var(--blue,#587bff);outline-offset:3px}`;
  document.head.appendChild(style);
  const notice = document.createElement('section');
  notice.className = 'privacy-notice';
  notice.setAttribute('aria-labelledby', 'privacy-notice-title');
  notice.hidden = choice !== null;
  notice.innerHTML = '<h2 id="privacy-notice-title"></h2><p data-privacy-copy></p><a href="/privacidade/"></a><div class="privacy-notice-actions"><button type="button" data-choice="reject"></button><button type="button" data-choice="accept"></button></div>';
  document.body.appendChild(notice);
  function translate() {
    const en = document.documentElement.lang === 'en';
    notice.querySelector('h2').textContent = en ? 'Your privacy' : 'Sua privacidade';
    notice.querySelector('p').textContent = en ? 'May I use Google Analytics measurement cookies and Meta measurement and advertising cookies to understand visits and WhatsApp clicks? You can browse and contact me without accepting.' : 'Posso usar cookies de medição do Google Analytics e de medição e publicidade da Meta para entender visitas e cliques no WhatsApp? Você pode navegar e entrar em contato sem aceitar.';
    notice.querySelector('a').textContent = en ? 'Privacy policy (in Portuguese)' : 'Política de privacidade';
    notice.querySelector('[data-choice="reject"]').textContent = en ? 'Decline' : 'Recusar';
    notice.querySelector('[data-choice="accept"]').textContent = en ? 'Accept' : 'Aceitar';
  }
  translate();
  document.addEventListener('portfolio:language', translate);
  function clearMeasurementCookies() {
    const googleCookies = document.cookie.split(';').map(part => part.split('=')[0].trim()).filter(name => /^_ga(?:_|$)/.test(name) || name === '_gid');
    for (const name of new Set(['_fbp', '_fbc', '_ga', ...googleCookies])) {
      for (const domain of ['', `; domain=${location.hostname}`, '; domain=.eduardopbianchi.com.br']) {
        document.cookie = `${name}=; max-age=0; path=/${domain}; SameSite=Lax; Secure`;
      }
    }
  }
  function choose(allowed) {
    choice = allowed;
    try { localStorage.setItem(key, JSON.stringify({ allowed, at: Date.now() })); } catch { /* Sem persistência. */ }
    if (!allowed) clearMeasurementCookies();
    notice.hidden = true;
    document.dispatchEvent(new CustomEvent('portfolio:privacy', { detail: { allowed } }));
  }
  notice.querySelector('[data-choice="accept"]').addEventListener('click', () => choose(true));
  notice.querySelector('[data-choice="reject"]').addEventListener('click', () => choose(false));
  document.addEventListener('click', event => {
    if (event.target.closest?.('[data-privacy-open]')) {
      notice.hidden = false;
      notice.querySelector('button').focus();
    }
  });
  window.PortfolioPrivacy = { allowed: () => choice === true };
})();
