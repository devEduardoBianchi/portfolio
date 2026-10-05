(() => {
  'use strict';

  const config = window.CONTACT_CONFIG || {};
  const profile = config.profile || {};
  const endpoint = String(config.delivery?.endpoint || '').trim();
  const isDemo = endpoint === '';
  const timeoutMs = Number(config.delivery?.timeoutMs) || 12000;
  const form = document.querySelector('#contact-form');
  const fieldset = document.querySelector('#form-fields');
  const fields = ['name', 'email', 'message'].map((id) => document.getElementById(id));
  const status = document.querySelector('#form-status');
  const result = document.querySelector('#result');
  const counter = document.querySelector('#message-counter');
  let sending = false;

  // Dados do perfil são inseridos como texto, nunca como HTML.
  document.querySelectorAll('[data-profile]').forEach((element) => {
    const value = profile[element.dataset.profile];
    if (value) element.textContent = value;
  });
  const displayName = profile.name || 'Seu nome';
  const words = displayName.trim().split(/\s+/);
  document.querySelector('#monogram').textContent = (words[0][0] + (words.length > 1 ? words.at(-1)[0] : '')).toUpperCase();
  document.title = `Contato — ${displayName}`;
  document.querySelector('#year').textContent = new Date().getFullYear();

  let activeLinks = 0;
  ['github', 'linkedin'].forEach((network) => {
    const link = document.querySelector(`#${network}-link`);
    try {
      const url = new URL(profile[network]);
      if (url.protocol !== 'https:') throw new Error('O perfil precisa de HTTPS.');
      link.href = url.href;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.removeAttribute('aria-disabled');
      link.setAttribute('aria-label', `${network === 'github' ? 'GitHub' : 'LinkedIn'} de ${displayName} (abre em nova aba)`);
      activeLinks += 1;
    } catch {
      link.removeAttribute('href');
      link.setAttribute('aria-disabled', 'true');
    }
  });
  document.querySelector('#profile-hint').hidden = activeLinks > 0;

  if (!isDemo) {
    document.querySelector('#mode-label').textContent = 'Contato direto';
    document.querySelector('#mode-description').textContent = 'Ao enviar, sua mensagem será encaminhada ao serviço de contato.';
    document.querySelector('#demo-tools').hidden = true;
  }

  function announce(message, state = 'idle') {
    status.textContent = message;
    status.dataset.state = state;
    form.dataset.state = state;
  }

  function updateCounter() {
    counter.textContent = `${document.querySelector('#message').value.length.toLocaleString('pt-BR')} / 2.000`;
  }

  function validateField(control) {
    const value = control.value.trim();
    let error = '';
    if (!value) {
      error = { name: 'Informe seu nome completo.', email: 'Informe seu e-mail.', message: 'Escreva sua mensagem antes de enviar.' }[control.id];
    } else if (control.id === 'email' && control.validity.typeMismatch) {
      error = 'Use um e-mail válido, como nome@exemplo.com.';
    } else if (value.length > control.maxLength) {
      error = `Use no máximo ${control.maxLength} caracteres.`;
    }
    document.querySelector(`#${control.id}-error`).textContent = error;
    control.closest('.field').classList.toggle('has-error', Boolean(error));
    if (error) control.setAttribute('aria-invalid', 'true');
    else control.removeAttribute('aria-invalid');
    return error === '';
  }

  function validateForm() {
    const invalid = fields.filter((control) => !validateField(control));
    if (!invalid.length) return true;
    announce(`Revise ${invalid.length === 1 ? 'o campo indicado' : `os ${invalid.length} campos indicados`} para continuar.`, 'invalid');
    invalid[0].focus();
    window.contactMotion?.invalid(invalid[0].closest('.field'));
    return false;
  }

  function setBusy(active) {
    sending = active;
    fieldset.disabled = active;
    form.setAttribute('aria-busy', String(active));
    document.querySelector('#submit-label').textContent = active ? (isDemo ? 'Testando formulário…' : 'Enviando mensagem…') : 'Enviar mensagem';
    document.querySelector('.send-arrow').toggleAttribute('hidden', active);
    document.querySelector('.spinner').toggleAttribute('hidden', !active);
    window.contactMotion?.busy(active);
  }

  function showSuccess() {
    form.hidden = true;
    result.hidden = false;
    announce('');
    form.dataset.state = 'success';
    document.querySelector('#result-kicker').textContent = isDemo ? 'DEMONSTRAÇÃO CONCLUÍDA' : 'CONFIRMAÇÃO DO SERVIÇO';
    document.querySelector('#result-title').textContent = isDemo ? 'Tudo pronto para conectar.' : 'Mensagem recebida.';
    document.querySelector('#result-description').textContent = isDemo
      ? 'Nenhuma mensagem foi enviada. Este teste mostra como o formulário responde depois de validar seus dados.'
      : 'Obrigado pelo contato. O serviço confirmou o recebimento da sua mensagem.';
    document.querySelector('#restart').firstChild.textContent = isDemo ? 'Voltar ao formulário ' : 'Escrever outra mensagem ';
    window.contactMotion?.reveal(result);
    document.querySelector('#result-title').focus();
  }

  // Contrato do serviço: POST JSON; sucesso = HTTP 2xx com { "ok": true }.
  async function deliverMessage(payload) {
    const url = new URL(endpoint, window.location.href);
    const localHost = ['localhost', '127.0.0.1', '[::1]'].includes(url.hostname);
    if (url.protocol !== 'https:' && !(url.protocol === 'http:' && localHost)) {
      throw new Error('invalid-endpoint');
    }
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), timeoutMs);
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        credentials: 'omit',
        body: JSON.stringify(payload),
        signal: controller.signal,
      });
      const body = await response.json().catch(() => null);
      if (!response.ok || body?.ok !== true) throw new Error('service-failure');
    } finally {
      window.clearTimeout(timeout);
    }
  }

  fields.forEach((control) => {
    control.addEventListener('blur', () => validateField(control));
    control.addEventListener('input', () => {
      if (control.hasAttribute('aria-invalid')) validateField(control);
      if (form.dataset.state === 'invalid') announce('');
      updateCounter();
    });
  });

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (sending || !validateForm()) return;
    // A captura acontece antes de desabilitar os campos.
    const payload = Object.fromEntries(new FormData(form));
    Object.keys(payload).forEach((key) => { payload[key] = payload[key].trim(); });
    payload.subject ||= 'Outro';
    setBusy(true);
    announce(isDemo ? 'Testando o estado de envio. Nenhuma mensagem será enviada.' : 'Enviando sua mensagem…', 'sending');
    try {
      if (isDemo) {
        await new Promise((resolve) => window.setTimeout(resolve, 1100));
        if (document.querySelector('#demo-result').value === 'failure') throw new Error('demo-failure');
      } else {
        await deliverMessage(payload);
      }
      showSuccess();
    } catch (error) {
      const message = error.message === 'demo-failure'
        ? 'Falha de demonstração. Seus dados foram preservados. Selecione “Concluir demonstração” para testar novamente. Nenhuma mensagem foi enviada.'
        : error.name === 'AbortError'
          ? 'O serviço demorou para responder e não foi possível confirmar o envio. Seus dados foram preservados para você tentar novamente.'
          : error.message === 'invalid-endpoint'
            ? 'O endereço de envio não está configurado corretamente. Seus dados foram preservados.'
            : 'Não foi possível confirmar o envio agora. Seus dados foram preservados. Tente novamente em instantes.';
      announce(message, 'error');
      window.contactMotion?.reveal(status);
    } finally {
      setBusy(false);
      if (form.dataset.state === 'error') document.querySelector('#submit-button').focus();
    }
  });

  document.querySelector('#restart').addEventListener('click', () => {
    // Em demonstração, preserva o conteúdo para explorar também o estado de falha.
    if (!isDemo) form.reset();
    result.hidden = true;
    form.hidden = false;
    fields.forEach((control) => {
      control.removeAttribute('aria-invalid');
      control.closest('.field').classList.remove('has-error');
      document.querySelector(`#${control.id}-error`).textContent = '';
    });
    announce('');
    updateCounter();
    window.contactMotion?.reveal(form);
    fields[0].focus();
  });

  // Sem JavaScript, os campos continuam desabilitados e o aviso noscript é exibido.
  form.noValidate = true;
  fieldset.disabled = false;
  form.dataset.mode = isDemo ? 'demo' : 'live';
  form.dataset.state = 'idle';
  updateCounter();
})();
