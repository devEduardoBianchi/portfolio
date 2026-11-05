// Gera o CSS inicial a partir da mesma fonte, preservando a ordem da cascata.
// Execute novamente após editar style.css: node tools/build_critical_css.cjs
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const css = fs.readFileSync(path.join(root, 'style.css'), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');

function rules(source) {
  const result = [];
  let start = 0, opening = -1, depth = 0, quote = '';
  for (let i = 0; i < source.length; i++) {
    const char = source[i];
    if (quote) {
      if (char === '\\') i++;
      else if (char === quote) quote = '';
      continue;
    }
    if (char === '"' || char === "'") { quote = char; continue; }
    if (char === '{') {
      if (depth === 0) opening = i;
      depth++;
    } else if (char === '}') {
      depth--;
      if (depth < 0) throw new Error('CSS com fechamento de bloco inesperado');
      if (depth === 0) {
        result.push({ selector: source.slice(start, opening).trim(), body: source.slice(opening + 1, i) });
        start = i + 1;
      }
    }
  }
  if (depth || quote || source.slice(start).trim()) throw new Error('CSS não reconhecido: revise os blocos');
  return result;
}

const initialClass = /\.(?:hero(?:-[\w-]+)?|site-intro(?:-[\w-]+)?|tunnel-intro|pt-[\w-]+|header(?:-[\w-]+)?|brand(?:-[\w-]+)?|theme-(?:switch|button)|language-(?:switch|button)|squish-switch(?:-[\w-]+)?|quick-open|eyebrow-line|availability(?:-dot)?|action-(?:link(?:-primary)?|arrow)|mobile-safe-arrow|reading-progress|skip-link|sr-only)(?![\w-])/;
const globalSelector = /^(?:\*|:root|::selection|\[hidden\]|(?:html|body|a|button|input|textarea|select|img|picture|p|h[1-6]|figure|dialog)(?![\w-]))/;
function critical(source) {
  return rules(source).map(({ selector, body }) => {
    if (/^@(media|supports|layer|container)\b/.test(selector)) {
      const children = critical(body);
      return children ? `${selector}{${children}}` : '';
    }
    if (/^@(font-face|(?:-webkit-)?keyframes)\b/.test(selector)) return `${selector}{${body.trim()}}`;
    if (selector.startsWith('@')) throw new Error(`Regra não suportada: ${selector}`);
    const selectors = selector.split(',').map(part => part.trim());
    if (selectors.some(part => initialClass.test(part) || globalSelector.test(part))) return `${selector}{${body.trim()}}`;
    return '';
  }).filter(Boolean).join('\n');
}
const output = critical(css);
const target = path.join(root, 'index.html');
const html = fs.readFileSync(target, 'utf8');
const marker = /<!-- critical-css:start -->[\s\S]*?<!-- critical-css:end -->/;
if (!marker.test(html)) throw new Error('Marcadores do CSS inicial não encontrados');
fs.writeFileSync(target, html.replace(marker, `<!-- critical-css:start -->\n  <style id="critical-styles">\n${output}\n  </style>\n  <!-- critical-css:end -->`));
console.log(`CSS inicial gerado: ${Buffer.byteLength(output)} bytes; fonte completa: ${Buffer.byteLength(css)} bytes.`);

// A página de projetos compartilha a fonte; os caminhos inline partem de /trabalhos/.
const projectsTarget = path.join(root, 'trabalhos', 'index.html');
if (fs.existsSync(projectsTarget)) {
  const projectsHtml = fs.readFileSync(projectsTarget, 'utf8');
  const projectsCss = output.replace(/url\((['"]?)assets\//g, 'url($1../assets/');
  fs.writeFileSync(projectsTarget, projectsHtml.replace(marker, `<!-- critical-css:start -->\n  <style id="critical-styles">\n${projectsCss}\n  </style>\n  <!-- critical-css:end -->`));
}
