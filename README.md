# Eduardo Bianchi · Portfólio

Portfólio pessoal de **Eduardo Pires Bianchi**, estudante de Engenharia de Software em Dourados, MS. Reúne projetos de interfaces, uma aplicação de suporte e experiências interativas.

**Acesse:** [www.eduardopbianchi.com.br](https://www.eduardopbianchi.com.br/)

![Prévia da abertura do portfólio](assets/portfolio-preview.png)

## Conteúdo

- Site estático em HTML, CSS e JavaScript, responsivo, em português e inglês, somente no tema escuro.
- Navegação direta pelas seções na barra superior.
- Animações de entrada em CSS, faixa de ferramentas em movimento quando visível e suporte à preferência por movimento reduzido. A página principal não carrega GSAP nem Canvas.
- **Nexo Desk**, **Nexo Oficina Digital**, **Entre Cenas**, **Forma**, **Price Cards** e **FIO / tech** apresentados com o mesmo peso visual, índice navegável e capturas reais. Um controle alterna as capturas entre desktop e celular.
- Demonstrações públicas dos cinco projetos, além de versões locais de **Entre Cenas**, **Forma** e **Price Cards**.
- Contato por e-mail, telefone e botão que abre uma conversa no WhatsApp.
- Currículo em PDF disponível na hero e na seção Sobre.

## Projetos

| Projeto | Sobre | Tecnologias |
| --- | --- | --- |
| [**Nexo Desk**](https://nexo-desk-pi.vercel.app/) | Sistema de suporte com fila e quadro de chamados, filtros, indicadores, histórico, notas internas e ações em lote com opção de desfazer. A demonstração pública usa dados fictícios no navegador; não atende chamados reais nem inclui a API ou o banco. | HTML, CSS, JavaScript, GSAP, localStorage na demonstração, Node.js, Express, SQLite |
| [**Nexo Oficina Digital**](https://nexo-informatica-murex.vercel.app/) | Site conceitual de informática e assistência técnica, com catálogo pesquisável, filtros, Blog e página de reparos de notebooks. Marca e contatos fictícios; atendimento simulado. | HTML, CSS, JavaScript, GSAP |
| [**Entre Cenas**](https://entrecenas-blond.vercel.app/) | Diário de cinema para descobrir filmes, organizar uma lista pessoal e registrar avaliações e anotações. O catálogo TMDb é opcional e pede um token no navegador; a coleção de demonstração funciona sem ele. | HTML, CSS, JavaScript, GSAP, localStorage, TMDb opcional |
| [**Forma**](https://forma-nine-wheat.vercel.app/#inicio) | Página de contato somente no tema escuro, validação acessível, assunto e orçamento opcionais. A demonstração não envia mensagens; o envio real depende de um serviço configurado. | HTML, CSS, JavaScript, GSAP |
| [**Price Cards**](https://pricecards.vercel.app/#inicio) | Estudo responsivo de planos de hospedagem com comparação interativa, resumos e indicação por quantidade de sites e necessidade de e-mail personalizado. Preços apenas demonstrativos. | HTML, CSS, JavaScript |
| [**FIO / tech**](https://fiotech-six.vercel.app/) | Loja conceitual de eletrônicos e informática com catálogo, filtros, comparação de até três itens, favoritos e questionário de setup baseado em regras explicadas. Produtos e preços fictícios; sem compra real. | React, TypeScript, Vite, CSS, GSAP, localStorage |

As demonstrações de Entre Cenas, Forma e Price Cards também estão incluídas em `projetos/` e funcionam sem instalar dependências. Nexo Desk e FIO / tech são apresentados com capturas reais; suas aplicações não fazem parte deste repositório. Os seis endereços públicos estão configurados em `script.js`.

## Movimento e desempenho

As entradas durante a rolagem usam `IntersectionObserver` e animam apenas opacidade e posição. Nos projetos, a entrada afeta o texto; as capturas não são animadas como um bloco grande. A navbar e o índice de projetos mantêm a posição fixa durante a leitura sem aplicar desfoque ao conteúdo que passa atrás deles. O indicador de progresso é atualizado com `requestAnimationFrame`, no máximo uma vez por quadro. A faixa de ferramentas pausa fora da área visível.

Essas escolhas reduzem o trabalho de renderização durante a rolagem. Não há uma medição de FPS publicada neste repositório; o resultado pode variar conforme o aparelho e o navegador.

A abertura usa WebP de 800 px no celular (20 KB) e uma versão de 1672 px no desktop (64 KB), pré-carregadas por breakpoint. A Raleway é servida em WOFF2 pelo próprio domínio, com `font-display: swap`. O CSS inicial fica no HTML e a folha completa carrega por preload, com alternativa para JavaScript desativado.

Após editar `style.css`, atualize o trecho inicial com `node tools/build_critical_css.cjs`. Esse utilitário usa apenas Node.js e mantém a ordem das regras da folha original. As otimizações foram conferidas localmente; não representam uma nova medição de LCP em 4G. Repita o PageSpeed Insights após publicar.

## Executar localmente

O site é estático e não precisa de compilação nem instalação de pacotes. Na pasta do repositório, inicie um servidor HTTP local:

```bash
python -m http.server 8080
```

No Windows, também é possível usar `py -3 -m http.server 8080`. Acesse `http://localhost:8080` no navegador. Para conferir uma demonstração diretamente, abra `projetos/entre-cenas/`, `projetos/forma/` ou `projetos/price-cards/`.

## Busca e compartilhamento

O domínio canônico é `https://www.eduardopbianchi.com.br/`. O título, a descrição e as tags Open Graph/Twitter estão no HTML inicial, disponíveis sem executar JavaScript. A capa pública de compartilhamento é `/og.jpg`, em JPEG de 1200 × 630 pixels (72 KB); a cópia de origem permanece em `assets/portfolio-social-v1.jpg`. O briefing da arte está em `assets/portfolio-social-brief.md`. As demonstrações locais e a página de privacidade também têm metadados de compartilhamento.

`robots.txt` permite o rastreamento e informa o endereço de `sitemap.xml`. O sitemap lista a página principal, as três demonstrações locais, a política de privacidade e os termos de uso. As seções com `#` fazem parte da mesma página; as demonstrações externas têm seus próprios domínios. O HTML inicial inclui JSON-LD de `Person`, `WebSite` e `ProfilePage`, com informações presentes no portfólio.

Após publicar estas alterações na Vercel, confira `/robots.txt`, `/sitemap.xml` e `/og.jpg` no domínio oficial. No Google Search Console, envie `https://www.eduardopbianchi.com.br/sitemap.xml`. A indexação e a atualização de prévias dependem dos serviços; o WhatsApp pode manter uma imagem anterior em cache.

## Privacidade e medição

`/privacidade/` identifica Eduardo Pires Bianchi como pessoa física responsável e informa o contato profissional. Foi adotado, por escolha do responsável, o prazo máximo de 12 meses após a última conversa para contatos encerrados. Essa revisão/exclusão acontece nas contas de e-mail e WhatsApp; o site não acessa essas caixas nem exclui mensagens automaticamente.

`assets/privacy.js` oferece aceitar/recusar e guarda a escolha no navegador por até 180 dias. A versão atual da escolha (`portfolio-privacy-v2`) abrange o Pixel da Meta e o Google Analytics; escolhas da versão anterior não são reaproveitadas. O visitante pode reabrir o controle na política. Ao recusar, o código bloqueia os novos disparos de medição e solicita a remoção dos cookies de primeira parte conhecidos da Meta e do Analytics. A faixa respeita o tema e o idioma do portfólio; a política e os termos estão em português. As fontes locais dispensam a conexão ao Google Fonts na página principal.

O Pixel da Meta `1321323833385070` está centralizado em `assets/meta-pixel.js`. Ele só inicia depois de aceitar a medição e apenas nos hosts `www.eduardopbianchi.com.br` e `eduardopbianchi.com.br`. Registra um `PageView` por documento e `Contact` nos cliques em `wa.me` ou `api.whatsapp.com`. Âncoras internas não contam como novas páginas. A biblioteca externa carrega com `async`, após o evento `load`; o contato continua funcionando se ela for bloqueada. Localhost e prévias da Vercel não enviam eventos de produção.

O GA4 `G-M36GTQ5ZQ3` está centralizado em `assets/analytics.js`, com a mesma restrição de domínio e consentimento do Pixel. `gtag.js` só carrega com `async` depois de aceitar e do evento `load`. O código envia um `page_view` por documento (com o pageview automático de configuração desativado) e `generate_lead` no clique do WhatsApp. O evento indica intenção de contato, não confirma uma mensagem enviada. O único parâmetro personalizado é `contact_method: whatsapp`, sem telefone, e-mail ou texto da mensagem. Sinais do Google, personalização e armazenamento para anúncios não são habilitados pela integração.

A medição otimizada foi habilitada pelo responsável no fluxo GA4. Os eventos automáticos controlados pelo painel são adicionais aos eventos personalizados. Ao configurar mudanças de histórico no GA4, lembre que as âncoras de seção deste portfólio não são novas páginas.

Para conferir após o deploy, aceite a medição no domínio oficial e use "Testar eventos" no Gerenciador de Eventos da Meta e "Tempo real" no Analytics. Clique no WhatsApp e confira `Contact` e `generate_lead`. No GA4, marque `generate_lead` como evento principal se quiser utilizá-lo como conversão. A validação local usa eventos simulados e não confirma recebimento nos serviços. Execute `node tools/check_tracking.cjs` para repetir os testes de consentimento, revogação, eventos e exclusão de prévias sem enviar dados reais.

`/termos/` reflete o uso confirmado: portfólio gratuito e demonstrações, sem compra ou contratação pelo site. Antes de oferecer contratação direta, será necessário revisar os termos, a identificação e as condições comerciais. Os rodapés atuais identificam o responsável com nome, cidade e e-mail profissional; nenhum CPF/CNPJ foi informado ou publicado.

O andamento dos onze itens do relatório está em `docs/raio-x.md`.

## Estrutura

- `index.html`, `style.css`, `script.js`, `language.js`, `effects.js`: página, estilos, interações, traduções e faixa de ferramentas.
- `assets/`: capturas reais, artes originais, fontes com suas licenças e currículo público.
- `assets/vendor/`: cópias locais do GSAP e ScrollTrigger usadas pelas demonstrações incluídas, com avisos de licença preservados.
- `projetos/`: demonstrações autocontidas dos projetos incluídos.
- `tools/build_resume.py`: código-fonte do currículo PDF. Requer Python, ReportLab e fontes Arial disponíveis no ambiente Windows usado para gerá-lo.
- `DESIGN.md`: notas sobre a direção visual do portfólio.

## Informações públicas

O portfólio exibe nome, cidade, e-mail, LinkedIn e telefone para contato profissional. O botão de WhatsApp abre uma conversa com o mesmo número exibido na página; nenhuma mensagem é enviada pelo portfólio. O PDF público mantém os dados que já constam nele. A configuração de envio do Forma está vazia por padrão: nenhum formulário envia dados até que um serviço seja configurado pelo responsável pelo deploy. Entre Cenas solicita o token TMDb ao visitante e o guarda apenas na sessão do navegador.

O README, o código e os recursos deste repositório não precisam de arquivos `.env`, tokens, banco de dados local ou credenciais. Não adicione esses dados ao publicar. A pasta `tmp/` é local e fica ignorada pelo Git.

## Licenças

Os arquivos de fonte e as cópias do GSAP incluem seus avisos de licença. Este repositório não define uma licença geral de reutilização para o portfólio, currículo, imagens e código. Peça autorização ao autor antes de reutilizar esses materiais.

### Abertura e fundo da hero

O site abre diretamente na hero, sem túnel nem bloqueio de rolagem. A hero apresenta Eduardo como engenheiro de software e desenvolvedor web full stack e descreve as tecnologias de front-end e back-end usadas e o cuidado com a navegação e as interfaces em diferentes telas. A formação acadêmica aparece na seção Sobre mim. O conteúdo tem uma entrada breve, desativada quando o visitante prefere movimento reduzido.

O fundo atual usa Aurora em `assets/aurora.js`, carregado por `assets/hero-shards.js` após o carregamento da página. A animação acompanha a taxa de atualização da tela, usa resolução limitada e pausa fora da hero ou com a aba oculta. O AeroShards anterior e os arquivos do túnel estão preservados como recursos inativos.

A navbar em `assets/adaptive-navbar.js` fica transparente sobre a hero e assume a cor de fundo da seção sob ela ao navegar. O contraste dos links e controles é ajustado automaticamente para superfícies claras ou escuras; não muda o tema do site. A cor é lida do fundo CSS real da seção, sem analisar imagens nem executar um loop contínuo.

As imagens para a futura Accordion Gallery estão em `assets/accordion-gallery/`, com cinco capturas reais verticais 3:4, variantes horizontais e manifest de dimensões. A galeria não foi implementada.


### Experimento atual: Aurora

O seletor `HERO_BACKGROUND` no início de `assets/hero-shards.js` está em `aurora`. O arquivo `assets/aurora.js` adapta o shader WebGL2 do prompt ProfitizeBuild, sem novas dependências. Paleta: #7197ff, #dceaff, #315eff e #07152f. O efeito inicia somente depois do túnel, reage suavemente ao ponteiro sobre a hero ou até 120 px ao redor, acompanha a atualização da tela via requestAnimationFrame, sem limite artificial de FPS, em meia resolução e pausa fora da tela/na aba oculta. Com movimento reduzido ou economia de dados, desenha um quadro estático. Sem WebGL2, mantém o fundo sólido. O canvas, observadores e recursos WebGL são liberados ao desmontar.

Para restaurar o teste anterior, trocar apenas `HERO_BACKGROUND` para `shards`; os arquivos e ajustes do AeroShards foram preservados.

A hero ocupa a altura da tela, sem a antiga faixa “Interfaces · Sistemas · Experiência”. A seção de projetos começa com espaçamento superior de 40 a 64 px.

### Galeria de projetos

A página inicial usa uma adaptação do Accordion Gallery (React Bits) em HTML, CSS e JavaScript com o GSAP local já disponível. Os cinco painéis usam recriações por imagegen das interfaces reais em `assets/accordion-gallery/*-restored.webp`; expandem por mouse, foco, setas do teclado ou toque. Em celular a galeria fica vertical. A animação só executa ao selecionar ou redimensionar e respeita movimento reduzido. O botão “Ver todos os projetos” abre `/trabalhos/`, que preserva as descrições completas, tecnologias, demonstrações e comparação de capturas desktop/celular.

As seções depois da hero compartilham um fundo quase preto com luz azul estática em CSS, sem novos loops, shaders ou blur. A barra de rolagem do documento fica oculta visualmente; a rolagem nativa continua funcionando.

As cinco imagens foram recriadas por imagegen integrado usando os screenshots como referência, seguindo o fluxo de restauração do projeto Ricardo Salão de Beleza. Fontes PNG e prompts em `output/imagegen/`; as versões WebP usadas na galeria somam aproximadamente 502 KB. A página `/trabalhos/` mantém as capturas originais para consulta das interfaces reais.

A galeria foi conferida no navegador em 1440, 768 e 390 px, com teclado, seleção de painéis, português/inglês e navegação para a página completa. O teste de largura móvel simula o layout; não equivale a medir desempenho em um celular físico. A inspeção visual usou CUA; o inspetor automatizado da skill não foi executado porque o controle do navegador nesta sessão é feito exclusivamente por CUA.

As luzes azuis nas bordas das seções são pareadas: posição, cor, intensidade e raio vertical coincidem entre a saída de uma seção e a entrada da próxima. A transição é estática em CSS, sem processamento por quadro.

### Página de trabalhos: Relevo

A página `/trabalhos/` usa `assets/relevo.css` e `assets/relevo.js`: texto e prévia alternados em zigue-zague, cinco painéis 16:10, colunas, margens e espaçamento idênticos. Uma altura de conteúdo compartilhada mantém as linhas do desktop iguais sem cortar descrições. Em até 900 px, os blocos empilham com espaçamentos uniformes.

As entradas GSAP acontecem uma vez por visita: navegação, introdução, textos e imagens de cada projeto, contato e rodapé. Só transform e opacidade são animados; movimento reduzido mostra tudo pronto. A inclinação de até 5° segue o mouse apenas em desktop, sem brilho sobre as imagens; não existe loop de animação ocioso. A apresentação usa as imagens recriadas via imagegen em `assets/relevo/*-wide.webp`, todas com 1586 × 992 px. Fontes PNG e prompts em `output/imagegen/relevo/`. O controle permite alternar para as capturas reais de celular.

Verificação do Relevo: em 1440 px, os cinco blocos mediram 636 px de altura, painéis de 787 × 492 px, 72 px de margem interna vertical e 57,6 px entre as colunas. Em 1024 px, todos mediram 631 px de altura. Em 768 px, os cinco painéis mediram 702 × 439 px, com gap de 32 px e padding de 54 px; em 390 px, 354 × 221 px, gap de 26 px e padding de 42 px. Português/inglês, prévias móveis, carregamento e ausência de rolagem lateral foram conferidos no navegador. As medidas móveis são de viewport simulado, não benchmark em aparelho físico.

Na página inicial, `assets/home-entrances.js` anima os cinco painéis da galeria em cascata e a moldura da foto com sua legenda, uma vez ao entrar na tela. As entradas usam transform e opacidade, aguardam o fim da abertura e respeitam movimento reduzido; a expansão da galeria e a inclinação do cartão continuam independentes.
