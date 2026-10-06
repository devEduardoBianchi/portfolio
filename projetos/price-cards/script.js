const planCards = [...document.querySelectorAll('.plan-card')];
const featureLabels = [
  ['price', 'Preço mensal'],
  ['sites', 'Sites'],
  ['storage', 'Armazenamento'],
  ['transfer', 'Transferência'],
  ['support', 'Suporte mensal'],
  ['email', 'E-mail personalizado']
];

// Os textos dos cartões são a fonte dos dados usados nas outras áreas.
const plans = planCards.map((card) => {
  const features = Object.fromEntries(
    [...card.querySelectorAll('[data-feature]')].map((item) => [item.dataset.feature, item.textContent.trim()])
  );
  return {
    id: card.dataset.plan,
    card,
    name: card.querySelector('h3').textContent.trim(),
    price: `${card.querySelector('.plan-price span').textContent.trim()} ${card.querySelector('.plan-price small').textContent.trim()}`,
    features,
    siteLimit: Number.parseInt(features.sites, 10)
  };
});

const comparisonHead = document.querySelector('#comparison-head');
const comparisonBody = document.querySelector('#comparison-body');
const comparisonEmpty = document.querySelector('#comparison-empty');
const comparisonStatus = document.querySelector('#comparison-status');
const comparisonScroll = document.querySelector('.comparison-scroll');
const differencesOnly = document.querySelector('#differences-only');

function renderComparison() {
  const selected = plans.filter((plan) => plan.card.dataset.selected === 'true');
  comparisonHead.replaceChildren();
  const heading = document.createElement('th');
  heading.scope = 'col';
  heading.textContent = 'Benefício';
  comparisonHead.append(heading);
  selected.forEach((plan) => {
    const cell = document.createElement('th');
    cell.scope = 'col';
    cell.textContent = plan.name;
    comparisonHead.append(cell);
  });

  comparisonBody.replaceChildren();
  differencesOnly.disabled = selected.length < 2;
  if (selected.length < 2) differencesOnly.checked = false;
  featureLabels.forEach(([key, label]) => {
    const values = selected.map((plan) => key === 'price' ? plan.price : (plan.features[key] || 'Não informado'));
    const different = new Set(values).size > 1;
    if (differencesOnly.checked && !different) return;
    const row = document.createElement('tr');
    row.dataset.different = String(different);
    const labelCell = document.createElement('th');
    labelCell.scope = 'row';
    labelCell.textContent = label;
    row.append(labelCell);
    values.forEach((value) => {
      const cell = document.createElement('td');
      cell.textContent = value;
      if (value === 'Não informado') cell.classList.add('is-unknown');
      row.append(cell);
    });
    comparisonBody.append(row);
  });
  comparisonEmpty.hidden = selected.length !== 0;
  comparisonScroll.hidden = selected.length === 0;
  comparisonStatus.textContent = `${selected.length} ${selected.length === 1 ? 'plano selecionado' : 'planos selecionados'} para comparação.`;
}

planCards.forEach((card) => {
  card.querySelector('[data-toggle-compare]').addEventListener('click', (event) => {
    const selected = card.dataset.selected !== 'true';
    card.dataset.selected = String(selected);
    event.currentTarget.textContent = selected ? 'Remover da comparação' : 'Adicionar à comparação';
    event.currentTarget.setAttribute('aria-label', `${selected ? 'Remover' : 'Adicionar'} ${card.querySelector('h3').textContent.trim()} ${selected ? 'da' : 'à'} comparação`);
    renderComparison();
  });
});
differencesOnly.addEventListener('change', renderComparison);
renderComparison();

const dialog = document.querySelector('#plan-dialog');
let dialogTrigger;
planCards.forEach((card) => {
  card.querySelector('[data-open-summary]').addEventListener('click', (event) => {
    const plan = plans.find((item) => item.card === card);
    dialogTrigger = event.currentTarget;
    document.querySelector('#dialog-title').textContent = plan.name;
    document.querySelector('#dialog-price').textContent = plan.price;
    const benefits = document.querySelector('#dialog-benefits');
    benefits.replaceChildren();
    Object.values(plan.features).forEach((feature) => {
      const item = document.createElement('li');
      item.textContent = feature;
      benefits.append(item);
    });
    dialog.showModal();
  });
});
dialog.querySelectorAll('[data-close-dialog]').forEach((button) => button.addEventListener('click', () => dialog.close()));
dialog.addEventListener('click', (event) => {
  if (event.target === dialog) dialog.close();
});
dialog.addEventListener('close', () => dialogTrigger?.focus());

const finder = document.querySelector('#plan-finder');
const finderResult = document.querySelector('#finder-result');
finder.addEventListener('submit', (event) => {
  event.preventDefault();
  const count = Number(document.querySelector('#site-count').value);
  const needsEmail = finder.elements.email.value === 'yes';
  const match = plans.find((plan) => plan.siteLimit >= count && (!needsEmail || Boolean(plan.features.email)));
  finderResult.replaceChildren();
  const marker = document.createElement('span');
  marker.className = 'result-marker';
  marker.setAttribute('aria-hidden', 'true');
  finderResult.append(marker);
  const message = document.createElement('p');
  if (match) {
    const label = document.createElement('strong');
    label.textContent = `${match.name} — ${match.price}`;
    message.append('Indicação: ', label, `. Atende a ${count} ${count === 1 ? 'site' : 'sites'}${needsEmail ? ' e inclui e-mail personalizado' : ''} conforme os benefícios publicados.`);
    const link = document.createElement('a');
    link.href = `#${match.id}-title`;
    link.textContent = `Ver plano ${match.name}`;
    finderResult.append(message, link);
  } else {
    message.textContent = 'Nenhum plano cadastrado confirma todos esses critérios. Revise a quantidade de sites ou a necessidade de e-mail personalizado.';
    finderResult.append(message);
  }
});
