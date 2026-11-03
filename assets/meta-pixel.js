// Configuração única para as páginas deste domínio. O ID do Pixel é público.
(() => {
  'use strict';

  const pixelId = '1321323833385070';
  const productionHosts = new Set(['www.eduardopbianchi.com.br', 'eduardopbianchi.com.br']);
  // Não contaminar os relatórios com localhost ou deploys de prévia.
  if (!productionHosts.has(window.location.hostname) || window.portfolioMetaPixelReady) return;
  window.portfolioMetaPixelReady = true;

  let enabled = false;
  let initialized = false;
  let libraryRequested = false;
  let pageViewed = false;
  let waitingForLoad = false;

  function startPixel() {
    enabled = true;
    if (!window.fbq) {
      const fbq = function () {
        if (fbq.callMethod) fbq.callMethod.apply(fbq, arguments);
        else fbq.queue.push(arguments);
      };
      window.fbq = fbq;
      if (!window._fbq) window._fbq = fbq;
      fbq.push = fbq;
      fbq.loaded = true;
      fbq.version = '2.0';
      fbq.queue = [];
    }
    if (!initialized) {
      window.fbq('init', pixelId);
      initialized = true;
    }
    window.fbq('consent', 'grant');
    if (!pageViewed) {
      window.fbq('track', 'PageView');
      pageViewed = true;
    }
    if (document.readyState === 'complete') loadPixel();
    else if (!waitingForLoad) {
      waitingForLoad = true;
      window.addEventListener('load', loadPixel, { once: true });
    }
  }

  // A fila já recebe eventos; a biblioteca externa só baixa após os recursos iniciais.
  const loadPixel = () => {
    if (!enabled || libraryRequested) return;
    libraryRequested = true;
    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://connect.facebook.net/en_US/fbevents.js';
    document.head.appendChild(script);
  };
  document.addEventListener('portfolio:privacy', event => {
    if (event.detail.allowed) startPixel();
    else {
      enabled = false;
      if (initialized) window.fbq('consent', 'revoke');
    }
  });
  if (window.PortfolioPrivacy?.allowed()) startPixel();

  const trackWhatsApp = event => {
    if (!enabled) return;
    if (event.type === 'auxclick' && event.button !== 1) return;
    const link = event.target.closest?.('a[href]');
    if (!link) return;
    try {
      const url = new URL(link.href, window.location.href);
      if (!['https:', 'http:'].includes(url.protocol)) return;
      if (url.hostname !== 'wa.me' && url.hostname !== 'api.whatsapp.com') return;
      // Apenas o evento: sem enviar telefone, mensagem ou dados de formulários.
      window.fbq('track', 'Contact');
    } catch { /* Um link inválido não deve interromper a navegação. */ }
  };
  document.addEventListener('click', trackWhatsApp, true);
  document.addEventListener('auxclick', trackWhatsApp, true);
})();
