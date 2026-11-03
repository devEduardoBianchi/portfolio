# Assets preparados para Accordion Gallery

Componente de referência: https://reactbits.dev/components/accordion-gallery

A referência tem painéis expansíveis: altura padrão de 460 px e expandRatio 0.52. Não existe uma dimensão de imagem obrigatória; o recorte muda entre os painéis abertos e fechados. Por isso foram preparadas duas versões reais de cada projeto, sem implementar a galeria:

- *-portrait.png e .webp: novas capturas do site publicado em viewport 900 × 1200 (arquivos efetivos 885 × 1180 devido à escala de captura do navegador), proporcionais a 3:4, úteis para os painéis estreitos. Confira dimensões efetivas no manifest.json.
- *-landscape.webp: capturas de desktop preservando a proporção original, úteis quando o painel expandido precisa mostrar a interface inteira.
- manifest.json: caminhos, dimensões reais e ponto inicial de object-position.

Usar WebP na futura implementação; PNG preservado como fonte. Para interfaces, evitar ampliar mais que o arquivo ou cortar formulários/textos importantes. O recorte final depende da largura da galeria e deve ser ajustado quando o layout for definido. Nenhuma dessas imagens foi ligada à seção de projetos atual.

Capturados em 3 de novembro de 2026: nexo-desk-pi.vercel.app, entrecenas-blond.vercel.app, forma-nine-wheat.vercel.app, pricecards.vercel.app e fiotech-six.vercel.app.
