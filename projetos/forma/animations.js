// O formulário funciona mesmo se a biblioteca de animação não carregar.
(() => {
  const noop = () => {};
  window.contactMotion = { reveal: noop, busy: noop, invalid: noop };
  if (!window.gsap) return;

  const gsap = window.gsap;
  const media = gsap.matchMedia();
  let spinnerTween;
  let entrance;
  let entrancePlayed = false;

  media.add('(prefers-reduced-motion: no-preference)', (context) => {
    // A timeline coordena a ordem sem uma cadeia de atrasos independentes.
    if (!entrancePlayed) {
      entrancePlayed = true;
      entrance = gsap.timeline({ defaults: { duration: 0.75, ease: 'power3.out' } })
        .from('.site-header', { y: -10, autoAlpha: 0, clearProps: 'all' })
        .from('.title-line', { y: 28, autoAlpha: 0, stagger: 0.12, clearProps: 'all' }, 0.1)
        .from('.intro-reveal', { y: 15, autoAlpha: 0, stagger: 0.09, clearProps: 'all' }, 0.2)
        .from('.form-heading, .mode-notice, .required-note', { y: 12, autoAlpha: 0, stagger: 0.07, clearProps: 'all' }, 0.25)
        .from('.field', { y: 18, autoAlpha: 0, stagger: 0.08, clearProps: 'all' }, 0.35)
        .from('.form-actions, .demo-tools, .form-bottom, .site-footer', { y: 10, autoAlpha: 0, stagger: 0.05, clearProps: 'all' }, 0.55);
    }

    // Registra os tweens de eventos no contexto para limpar tudo ao reduzir movimento.
    context.add('reveal', (element) => {
      // Mantém visibility ativa para permitir foco imediato no título da resposta.
      gsap.fromTo(element, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.45, ease: 'power2.out', clearProps: 'all', overwrite: true });
    });
    context.add('busy', (active) => {
      spinnerTween?.kill();
      gsap.set('.spinner', { rotation: 0 });
      if (active) spinnerTween = gsap.to('.spinner', { rotation: 360, repeat: -1, duration: 0.85, ease: 'none' });
    });
    context.add('invalid', (element) => {
      gsap.fromTo(element, { x: -3 }, { x: 0, duration: 0.25, ease: 'power2.out', overwrite: true, clearProps: 'transform' });
    });
    context.add('focusIn', (event) => {
      // Quem começar a interagir não precisa esperar a animação de entrada.
      if (entrance?.isActive()) entrance.progress(1);
      const line = event.target.closest('.control-shell')?.querySelector('.focus-line');
      if (line) gsap.fromTo(line, { scaleX: 0 }, { scaleX: 1, duration: 0.35, ease: 'power2.out', overwrite: true });
    });
    context.add('focusOut', (event) => {
      const line = event.target.closest('.control-shell')?.querySelector('.focus-line');
      if (line) gsap.to(line, { scaleX: 0, duration: 0.25, overwrite: true, clearProps: 'transform' });
    });
    window.contactMotion = { reveal: context.reveal, busy: context.busy, invalid: context.invalid };
    document.addEventListener('focusin', context.focusIn);
    document.addEventListener('focusout', context.focusOut);
    if (document.querySelector('#contact-form').getAttribute('aria-busy') === 'true') context.busy(true);

    return () => {
      spinnerTween?.kill();
      entrance = null;
      document.removeEventListener('focusin', context.focusIn);
      document.removeEventListener('focusout', context.focusOut);
      window.contactMotion = { reveal: noop, busy: noop, invalid: noop };
    };
  });

  // Feedback de ponteiro apenas em dispositivos com mouse; teclado mantém o foco nativo.
  media.add('(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)', (context) => {
    const cleanups = [];
    document.querySelectorAll('.submit-button, .social-link:not([aria-disabled="true"]), .text-button').forEach((element, index) => {
      const arrow = element.querySelector('.icon');
      context.add(`enter${index}`, () => {
        gsap.to(arrow, { x: 3, y: -3, duration: 0.25, ease: 'power2.out', overwrite: 'auto' });
      });
      context.add(`leave${index}`, () => {
        gsap.to(arrow, { x: 0, y: 0, duration: 0.35, ease: 'power2.out', overwrite: 'auto' });
      });
      element.addEventListener('pointerenter', context[`enter${index}`]);
      element.addEventListener('pointerleave', context[`leave${index}`]);
      cleanups.push(() => {
        element.removeEventListener('pointerenter', context[`enter${index}`]);
        element.removeEventListener('pointerleave', context[`leave${index}`]);
      });
    });
    return () => cleanups.forEach((cleanup) => cleanup());
  });
})();
