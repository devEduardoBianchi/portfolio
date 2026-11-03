// Testes isolados de consentimento e eventos. Não fazem requisições à Meta/Google.
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const sources = ['meta-pixel.js', 'analytics.js'].map(file => fs.readFileSync(path.join(__dirname, '..', 'assets', file), 'utf8'));
function page(accepted = false, host = 'www.eduardopbianchi.com.br') {
  const hooks = {}, scripts = [];
  const add = (name, fn) => (hooks[name] ||= []).push(fn);
  const window = { location: { hostname: host, href: `https://${host}/` }, PortfolioPrivacy: { allowed: () => accepted }, addEventListener: add };
  const document = { readyState: 'loading', head: { appendChild: script => scripts.push(script) }, createElement: () => ({}), addEventListener: add };
  const context = vm.createContext({ window, document, URL, Set });
  sources.forEach(code => vm.runInContext(code, context));
  const fire = (name, event) => (hooks[name] || []).forEach(fn => fn(event));
  return {
    window, document, scripts, context,
    consent: allowed => fire('portfolio:privacy', { detail: { allowed } }),
    click: (href, type = 'click', button = 0) => fire(type, { type, button, target: { closest: () => href ? { href } : null } }),
    load: () => { document.readyState = 'complete'; fire('load'); },
    google: () => Array.from(window.dataLayer || [], args => Array.from(args)),
    meta: () => Array.from(window.fbq?.queue || [], args => Array.from(args)),
  };
}
const count = (events, type) => events.filter(event => event[1] === type).length;
const p = page();
assert.equal(p.window.fbq, undefined);
assert.equal(p.window.gtag, undefined);
p.click('https://wa.me/123');
assert.equal(p.scripts.length, 0);
p.consent(true);
assert.equal(p.scripts.length, 0); // Bibliotecas não competem com recursos iniciais.
assert.equal(count(p.google(), 'page_view'), 1);
assert.equal(count(p.meta(), 'PageView'), 1);
const config = p.google().find(event => event[0] === 'config');
assert.equal(config[1], 'G-M36GTQ5ZQ3');
assert.equal(config[2].send_page_view, false);
assert.equal(config[2].allow_google_signals, false);
p.click('https://wa.me/5567999969634');
p.click('https://api.whatsapp.com/send?phone=5567999969634');
p.click('https://wa.me/123', 'auxclick', 1);
assert.equal(count(p.google(), 'generate_lead'), 3);
assert.equal(count(p.meta(), 'Contact'), 3);
for (const url of ['https://wa.me.example.com/', 'https://example.com/?next=wa.me', 'mailto:test@example.com', null]) p.click(url);
p.click('https://wa.me/123', 'auxclick', 2);
assert.equal(count(p.google(), 'generate_lead'), 3);
assert.equal(count(p.meta(), 'Contact'), 3);
for (const event of p.google().filter(event => event[1] === 'generate_lead')) assert.equal(JSON.stringify(event[2]), '{"contact_method":"whatsapp"}');
p.consent(false);
assert.equal(p.window['ga-disable-G-M36GTQ5ZQ3'], true);
p.click('https://wa.me/123');
p.load();
assert.equal(p.scripts.length, 0); // Revogou antes do download.
assert.equal(count(p.google(), 'generate_lead'), 3);
p.consent(true);
assert.equal(p.scripts.length, 2);
assert(p.scripts.every(script => script.async));
assert(p.scripts.some(script => script.src === 'https://www.googletagmanager.com/gtag/js?id=G-M36GTQ5ZQ3'));
p.consent(true);
sources.forEach(code => vm.runInContext(code, p.context));
assert.equal(p.scripts.length, 2);
assert.equal(count(p.google(), 'page_view'), 1);
assert.equal(count(p.meta(), 'PageView'), 1);
p.consent(false);
p.click('https://wa.me/123');
assert.equal(count(p.google(), 'generate_lead'), 3);
assert.equal(count(p.meta(), 'Contact'), 3);
assert(p.google().some(event => event[0] === 'consent' && event[1] === 'update' && event[2].analytics_storage === 'denied'));
for (const host of ['localhost', '127.0.0.1', 'preview.vercel.app']) {
  const local = page(true, host);
  assert.equal(local.window.fbq, undefined);
  assert.equal(local.window.gtag, undefined);
}
const saved = page(true);
assert.equal(count(saved.google(), 'page_view'), 1);
assert.equal(count(saved.meta(), 'PageView'), 1);
saved.load();
assert.equal(saved.scripts.length, 2);
console.log('PASS: consentimento, revogação antes/depois do load, persistência, eventos, payload sem contato pessoal, deduplicação, async e exclusão de localhost/prévias.');
