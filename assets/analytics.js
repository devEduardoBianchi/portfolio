// O ID de medição é público. Não use tokens ou segredos neste arquivo.
(() => {
  'use strict';
  const measurementId = 'G-M36GTQ5ZQ3';
  const productionHosts = new Set(['www.eduardopbianchi.com.br', 'eduardopbianchi.com.br']);
  if (!productionHosts.has(window.location.hostname) || window.portfolioAnalyticsReady) return;
  window.portfolioAnalyticsReady = true;

  let enabled = false;
  let configured = false;
  let requested = false;
  let waitingForLoad = false;
  const disableKey = `ga-disable-${measurementId}`;
  window[disableKey] = true;

  function loadAnalytics() {
    if (!enabled || requested) return;
    requested = true;
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
    document.head.appendChild(script);
  }

  function startAnalytics() {
    enabled = true;
    window[disableKey] = false;
    if (!window.gtag) {
      window.dataLayer = window.dataLayer || [];
      window.gtag = function () { window.dataLayer.push(arguments); };
    }
    if (!configured) {
      window.gtag('consent', 'default', {
        analytics_storage: 'denied', ad_storage: 'denied',
        ad_user_data: 'denied', ad_personalization: 'denied',
      });
    }
    window.gtag('consent', 'update', {
      analytics_storage: 'granted', ad_storage: 'denied',
      ad_user_data: 'denied', ad_personalization: 'denied',
    });
    if (!configured) {
      configured = true;
      window.gtag('js', new Date());
      window.gtag('config', measurementId, {
        send_page_view: false,
        allow_google_signals: false,
        allow_ad_personalization_signals: false,
      });
      window.gtag('event', 'page_view');
    }
    if (document.readyState === 'complete') loadAnalytics();
    else if (!waitingForLoad) {
      waitingForLoad = true;
      window.addEventListener('load', loadAnalytics, { once: true });
    }
  }

  document.addEventListener('portfolio:privacy', event => {
    if (event.detail.allowed) startAnalytics();
    else {
      enabled = false;
      window[disableKey] = true;
      if (configured) window.gtag('consent', 'update', {
        analytics_storage: 'denied', ad_storage: 'denied',
        ad_user_data: 'denied', ad_personalization: 'denied',
      });
    }
  });
  if (window.PortfolioPrivacy?.allowed()) startAnalytics();

  function trackContact(event) {
    if (!enabled || (event.type === 'auxclick' && event.button !== 1)) return;
    const link = event.target.closest?.('a[href]');
    if (!link) return;
    try {
      const url = new URL(link.href, window.location.href);
      if (!['http:', 'https:'].includes(url.protocol)) return;
      if (url.hostname !== 'wa.me' && url.hostname !== 'api.whatsapp.com') return;
      // Não incluir telefone, endereço de e-mail nem conteúdo de mensagens.
      window.gtag('event', 'generate_lead', { contact_method: 'whatsapp' });
    } catch { /* A medição nunca deve impedir o contato. */ }
  }
  document.addEventListener('click', trackContact, true);
  document.addEventListener('auxclick', trackContact, true);
})();
