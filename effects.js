// Logo Loop leve, sem mudar a stack do site.
const toolLoop = document.querySelector('.tool-loop');
if (toolLoop && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const track = toolLoop.querySelector('.tool-loop-track');
  const duplicate = track.querySelector('.tool-loop-set').cloneNode(true);
  duplicate.setAttribute('aria-hidden', 'true');
  track.append(duplicate);
  toolLoop.classList.add('is-ready');
  new IntersectionObserver(entries => {
    toolLoop.classList.toggle('is-in-view', entries[0].isIntersecting);
  }).observe(toolLoop);
}
