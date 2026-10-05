// Textos editoriais: cada chave corresponde a um trecho do HTML em português.
// Nós de texto são atualizados sem recriar elementos, links ou animações.
(() => {
  const english = {
    'Tema da página': 'Page theme',
    'Usar tema claro': 'Use light theme',
    'Usar tema escuro': 'Use dark theme',
    'Tema claro': 'Light theme',
    'Tema escuro': 'Dark theme',
    'Tema claro ativado.': 'Light theme enabled.',
    'Tema escuro ativado.': 'Dark theme enabled.',
    '01 / ESTRUTURA': '01 / STRUCTURE',
    '02 / INTERAÇÃO': '02 / INTERACTION',
    '03 / DADOS': '03 / DATA',
    'Estudos de JavaScript': 'JavaScript studies',
    '4 cursos · fundamentos, tipos, condicionais e laços': '4 courses · fundamentals, types, conditionals and loops',
    'Estudos de HTML e CSS': 'HTML and CSS studies',
    '4 cursos · estrutura, estilo, layout, formulários, SEO e acessibilidade': '4 courses · structure, styling, layout, forms, SEO and accessibility',
    'Internet: fundamentos da web': 'Internet: web fundamentals',
    '132,5 h': '132.5 h',
    'PORTFÓLIO / DESENVOLVIMENTO WEB': 'PORTFOLIO / WEB DEVELOPMENT',
    '2026 — DOURADOS, MS': '2026 — DOURADOS, BRAZIL',
    'INTERFACES · SISTEMAS · EXPERIÊNCIA': 'INTERFACES · SYSTEMS · EXPERIENCE',
    'PROJETO EM DESTAQUE': 'FEATURED PROJECT',
    'Sistema de chamados': 'Ticket management system',
    'Explore os projetos': 'Explore the projects',
    '01 / TRABALHOS SELECIONADOS': '01 / SELECTED WORK',
    'QUATRO PROJETOS, QUATRO FORMAS DE RESOLVER': 'FOUR PROJECTS, FOUR WAYS TO SOLVE',
    'Projetos que': 'Projects that',
    'mostram o processo.': 'show the process.',
    'Do estudo visual a um sistema completo: cada projeto exercita uma parte diferente do desenvolvimento web.': 'From a visual study to a complete system, each project exercises a different part of web development.',
    '01 / PROJETO PRINCIPAL': '01 / MAIN PROJECT',
    'Uma central de suporte para acompanhar chamados, prioridades, pessoas e prazos em um único espaço.': 'A support workspace for tracking tickets, priorities, people and deadlines in one place.',
    'DESKTOP / MOBILE': 'DESKTOP / MOBILE',
    'O PROJETO': 'THE PROJECT',
    'Criação e edição de chamados, filas, busca, filtros, quadro por status, indicadores, notas internas e histórico. Alterações em lote podem ser desfeitas por 60 segundos.': 'Create and edit tickets, use queues, search, filters, a status board, analytics, internal notes and history. Bulk changes can be undone for 60 seconds.',
    'TECNOLOGIAS': 'TECHNOLOGIES',
    'Demonstração local · link público pendente': 'Local demo · public link pending',
    'Abrir Nexo Desk ↗': 'Open Nexo Desk ↗',
    '02–04 / OUTROS PROJETOS': '02–04 / OTHER PROJECTS',
    'INTERFACES EM CONTEXTOS DIFERENTES': 'INTERFACES FOR DIFFERENT CONTEXTS',
    'Outras formas de': 'Other ways to',
    'construir.': 'build.',
    '02 / APLICAÇÃO WEB': '02 / WEB APP',
    'Diário de cinema com visual de sala de projeção: descoberta de filmes, lista pessoal, notas, filtros e estatísticas da coleção. O catálogo TMDb é opcional.': 'A movie journal with a projection-room aesthetic: film discovery, a personal watchlist, ratings, filters and collection statistics. The TMDb catalog is optional.',
    'HTML · CSS · JavaScript · GSAP · localStorage · API TMDb opcional': 'HTML · CSS · JavaScript · GSAP · localStorage · optional TMDb API',
    '03 / INTERAÇÃO E FORMULÁRIOS': '03 / INTERACTION & FORMS',
    'Página de contato com temas escuro e claro, validação acessível e estados de envio, conclusão e falha recuperável. Assunto e orçamento são opcionais; no modo demonstração, nenhuma mensagem é enviada.': 'A contact page with dark and light themes, accessible validation, and sending, completion and recoverable failure states. Subject and budget are optional; demo mode sends no messages.',
    '04 / ESTUDO DE INTERFACE': '04 / UI STUDY',
    'Página de planos de hospedagem com comparação de recursos, layout responsivo e destaque visual para o Premium, recomendado para pequenos projetos.': 'A hosting plans page with feature comparison, responsive layout and visual emphasis on Premium, recommended for small projects.',
    'HTML · CSS · Design responsivo': 'HTML · CSS · Responsive design',
    'Desenvolvimento Frontend: 10 Projetos': 'Front-End Development: 10 Projects',
    'Um passo de cada vez.': 'One step at a time.',
    'Sempre em frente.': 'Always moving forward.',
    'Engenharia de Software, estudante': 'Software Engineering student',
    'Aprender faz': 'Learning is',
    'parte do': 'part of the',
    'processo.': 'process.',
    'ABERTO A OPORTUNIDADES DE ESTÁGIO': 'OPEN TO INTERNSHIP OPPORTUNITIES',
    'O próximo passo': 'The next step',
    'começa com um': 'starts with a',
    'olá.': 'hello.',
    'Conheça o projeto em destaque Nexo Desk': 'Discover the featured Nexo Desk project',
    'Tela real do Nexo Desk com fila de chamados, indicadores e radar de atenção': 'Actual Nexo Desk screen with ticket queue, metrics and attention radar',
    'Visão geral do Nexo Desk em português e tema escuro': 'Nexo Desk overview in Portuguese and dark theme',
    'Visão geral do Nexo Desk com indicadores e fila de chamados': 'Nexo Desk overview with metrics and ticket queue',
    'Versão móvel do Nexo Desk em inglês e tema claro': 'Nexo Desk mobile view in English and light theme',
    'Experimentar Entre Cenas em nova aba': 'Try Entre Cenas in a new tab',
    'Projetor de cinema iluminando uma tela âmbar, identidade visual do Entre Cenas': 'Cinema projector lighting an amber screen, the visual identity of Entre Cenas',
    'Abrir Forma em nova aba': 'Open Forma in a new tab',
    'Forma em tema escuro, com acentos verdes, formulário e controle de tema': 'Forma in dark mode, with green accents, a form and theme control',
    'Abrir Price Cards em nova aba': 'Open Price Cards in a new tab',
    'Price Cards: planos MyServer com o Premium recomendado para pequenos projetos': 'Price Cards: MyServer plans with Premium recommended for small projects',
    'Pular para o conteúdo': 'Skip to content',
    'Projetos': 'Projects', 'Sobre': 'About', 'Formação': 'Education',
    'Vamos conversar': "Let’s talk", 'Contato': 'Contact',
    'DESENVOLVIMENTO WEB · PORTFÓLIO': 'WEB DEVELOPMENT · PORTFOLIO',
    'Em busca de estágio': 'Seeking an internship',
    'Curiosidade que vira código.': 'Curiosity turned into code.',
    'Aprendizado que vira projeto.': 'Learning turned into projects.',
    'Estudante de Engenharia de Software, construindo meu caminho no desenvolvimento web.': 'Software Engineering student, building my path in web development.',
    'Conheça meu trabalho': 'Explore my work',
    'DOURADOS, MS — BRASIL': 'DOURADOS, MS — BRAZIL',
    'EM DESTAQUE': 'FEATURED',
    'APRENDER. CONSTRUIR. EVOLUIR.': 'LEARN. BUILD. GROW.',
    'Explore o portfólio': 'Explore the portfolio',
    '01 / PROJETOS SELECIONADOS': '01 / SELECTED PROJECTS',
    '03 PROJETOS · DA IDEIA À PRÁTICA': '03 PROJECTS · FROM IDEA TO PRACTICE',
    'Um diário de cinema.': 'A movie journal.',
    'Um projeto de aprendizado.': 'A learning project.',
    'WEB APP / DIÁRIO DE CINEMA': 'WEB APP / MOVIE JOURNAL',
    'EXPERIMENTE O PROJETO': 'TRY THE PROJECT',
    'SOBRE O PROJETO': 'ABOUT THE PROJECT',
    'Um espaço para descobrir filmes, organizar o que assistir e guardar impressões de cada sessão. O Entre Cenas reúne minha prática com interfaces, lógica e dados em uma aplicação de verdade.': 'A space to discover movies, organize a watchlist and capture thoughts after each screening. Entre Cenas brings my practice with interfaces, logic and data together in a working application.',
    'Experimentar projeto': 'Try the project',
    'O que ele faz': 'What it does',
    'Busca de filmes, lista pessoal, notas, anotações e estatísticas da coleção.': 'Movie search, a personal watchlist, ratings, notes and collection statistics.',
    'Como foi construído': 'How it was built',
    'HTML, CSS e JavaScript puro. Armazenamento local no navegador e integração opcional com a API do TMDB.': 'HTML, CSS and vanilla JavaScript. Browser local storage and optional integration with the TMDB API.',
    'API REST': 'REST API',
    'Outras ideias em prática': 'More ideas in action',
    'Explorando interfaces, interação e composição.': 'Exploring interfaces, interaction and composition.',
    'ABRIR DEMONSTRAÇÃO': 'OPEN DEMO',
    'RECOMENDADO PARA PEQUENOS PROJETOS': 'RECOMMENDED FOR SMALL PROJECTS',
    '02 / FORMULÁRIO INTERATIVO': '02 / INTERACTIVE FORM',
    'Uma ideia, três etapas. Formulário de briefing com validação, acompanhamento do progresso e revisão das informações antes de concluir a simulação.': 'One idea, three steps. A project brief form with validation, progress tracking and a review step before completing the simulation.',
    'Experimentar Forma': 'Try Forma',
    'VER INTERFACE': 'VIEW INTERFACE',
    '03 / ESTUDO DE INTERFACE': '03 / UI STUDY',
    'Página de planos de hospedagem com comparação de recursos, layout responsivo e estados de interação. A paleta grafite e verde destaca o Premium como recomendado para pequenos projetos.': 'A hosting plans page with feature comparison, responsive layout and interactive states. Its charcoal and green palette highlights Premium as the recommended plan for small projects.',
    'Design responsivo': 'Responsive design',
    'Explorar Price Cards': 'Explore Price Cards',
    'Preços demonstrativos; nenhum plano pode ser contratado.': 'Demo pricing; plans cannot be purchased.',
    '02 / SOBRE MIM': '02 / ABOUT ME',
    'TECNOLOGIA & APRENDIZADO': 'TECHNOLOGY & LEARNING',
    'Um passo': 'One step', 'de cada vez.': 'at a time.', 'Sempre': 'Always', 'em frente.': 'moving forward.',
    'Sou Eduardo Pires Bianchi, estudante de Engenharia de Software na Unigran.': 'I’m Eduardo Pires Bianchi, a Software Engineering student at Unigran.',
    'Meu contato com computadores começou cedo e se transformou em interesse por entender como as coisas funcionam. Hoje, levo essa curiosidade para o desenvolvimento web, unindo a faculdade a cursos e projetos pessoais.': 'I started using computers at an early age and became curious about how things work. Today, I bring that curiosity to web development, combining university studies with courses and personal projects.',
    'Busco minha primeira oportunidade de estágio em tecnologia para contribuir, aprender com uma equipe e transformar conhecimento em experiência prática.': 'I’m looking for my first internship in technology to contribute, learn from a team and turn knowledge into practical experience.',
    'BASE': 'BASED IN', 'IDIOMA': 'LANGUAGE', 'Inglês intermediário': 'Intermediate English',
    'Ver currículo em PDF': 'View résumé PDF',
    'PDF em português · Abre em nova aba': 'PDF in Portuguese · Opens in a new tab',
    'Minha caixa de ferramentas': 'My toolkit',
    'Conhecimentos que estou colocando em prática.': 'Skills I’m putting into practice.',
    'Interfaces web': 'Web interfaces',
    'Fundamentos & ferramentas': 'Fundamentals & tools',
    'Lógica de programação · Git · GitHub': 'Programming logic · Git · GitHub',
    'Além do front-end': 'Beyond the front end',
    'Banco de dados / SQL · Noções de Node.js · Hardware': 'Databases / SQL · Node.js basics · Hardware',
    '03 / FORMAÇÃO': '03 / EDUCATION',
    'CONHECIMENTO EM CONSTRUÇÃO': 'BUILDING KNOWLEDGE',
    'Aprender faz': 'Learning is', 'parte do': 'part of the', 'processo.': 'process.',
    'Formação acadêmica e cursos que ajudam a transformar curiosidade em repertório técnico.': 'Academic studies and courses that help turn curiosity into technical knowledge.',
    'GRADUAÇÃO EM ANDAMENTO': 'DEGREE IN PROGRESS',
    'Engenharia de Software': 'Software Engineering',
    'Cursos complementares': 'Additional courses',
    'Estudos em desenvolvimento e programação.': 'Studies in development and programming.',
    'Desenvolvimento Frontend:': 'Front-End Development:', '10 Projetos': '10 Projects',
    '132,5 h': '132.5 h',
    'JavaScript: Conceitos Iniciais': 'JavaScript: Introductory Concepts',
    'JavaScript: Utilizações de Tipos': 'JavaScript: Working with Types',
    'HTML e CSS: Classes, Posicionamento e Flexbox': 'HTML and CSS: Classes, Positioning and Flexbox',
    'HTML e CSS: Ambientes de Desenvolvimento': 'HTML and CSS: Development Environments',
    'Lógica de Programação': 'Programming Logic',
    '04 / VAMOS CONVERSAR': '04 / LET’S TALK',
    'Aberto a oportunidades de estágio': 'Open to internship opportunities',
    'O próximo passo': 'The next step', 'começa com um': 'starts with a', 'olá.': 'hello.',
    'Tem uma oportunidade ou quer conhecer melhor meu trabalho? Vou gostar de conversar.': 'Have an opportunity or want to learn more about my work? I’d love to talk.',
    'Copiar e-mail': 'Copy email',
    'FEITO COM CURIOSIDADE E CÓDIGO.': 'MADE WITH CURIOSITY AND CODE.',
    'Voltar ao topo ↑': 'Back to top ↑',
    'Eduardo Bianchi, início': 'Eduardo Bianchi, home',
    'Navegação principal': 'Main navigation',
    'Idioma da página': 'Page language',
    'Conheça o projeto Entre Cenas': 'Discover the Entre Cenas project',
    'Interface do Entre Cenas: diário de cinema com catálogo e coleção pessoal': 'Entre Cenas interface: movie journal with a catalog and personal collection',
    'Experimentar Entre Cenas, abre em nova aba': 'Try Entre Cenas, opens in a new tab',
    'Prévia real do aplicativo Entre Cenas com descoberta de filmes, lista e painel': 'Actual preview of Entre Cenas with movie discovery, a watchlist and dashboard',
    'Tecnologias do projeto': 'Project technologies',
    'Abrir demonstração do Forma em nova aba': 'Open the Forma demo in a new tab',
    'Forma: formulário de briefing com escolha de projeto e navegação em três etapas': 'Forma: project brief form with project selection and three-step navigation',
    'Abrir estudo visual Price Cards em nova aba': 'Open the Price Cards UI study in a new tab',
    'Price Cards: página MyServer com o plano Premium recomendado para pequenos projetos': 'Price Cards: MyServer page with the Premium plan recommended for small projects',
    'Plano recomendado para pequenos projetos': 'Plan recommended for small projects',
    'Voltar ao início': 'Back to home',
    'E-mail copiado!': 'Email copied!',
    'Selecione o endereço acima para copiar ou clique nele para enviar um e-mail.': 'Select the address above to copy it, or click it to send an email.',
  };
  const records = [];
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  while (walker.nextNode()) {
    const node = walker.currentNode;
    if (node.parentElement.closest('script, style, [data-language]')) continue;
    const key = node.textContent.trim();
    if (Object.hasOwn(english, key)) records.push({ node, original: node.textContent, translated: node.textContent.replace(key, english[key]) });
  }
  const attributes = [];
  document.querySelectorAll('[aria-label], [title], img[alt]').forEach(element => {
    for (const name of ['aria-label', 'alt', 'title']) {
      const original = element.getAttribute(name);
      if (Object.hasOwn(english, original)) attributes.push({ element, name, original, translated: english[original] });
    }
  });
  const description = document.querySelector('meta[name="description"]');
  const originalDescription = description.content;
  const originalTitle = document.title;
  let language = 'pt-BR';
  const status = document.querySelector('#language-status');

  function setLanguage(next, announce = false) {
    language = next === 'en' ? 'en' : 'pt-BR';
    const isEnglish = language === 'en';
    records.forEach(record => { record.node.textContent = isEnglish ? record.translated : record.original; });
    attributes.forEach(record => record.element.setAttribute(record.name, isEnglish ? record.translated : record.original));
    document.documentElement.lang = language;
    document.title = isEnglish ? 'Eduardo Bianchi — Web Development' : originalTitle;
    description.content = isEnglish ? 'Portfolio of Eduardo Pires Bianchi, a Software Engineering student in Dourados, Brazil. Web interfaces and projects including Nexo Desk, Entre Cenas, Forma and Price Cards.' : originalDescription;
    document.querySelectorAll('[data-language]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.language === language)));
    const nexoLink = document.querySelector('.featured-public-link');
    if (nexoLink) nexoLink.textContent = isEnglish ? 'Open Nexo Desk ↗' : 'Abrir Nexo Desk ↗';
    document.querySelector('#copy-status').textContent = '';
    document.querySelector('#theme-status').textContent = '';
    if (announce) status.textContent = isEnglish ? 'Page language changed to English.' : 'Idioma da página alterado para português.';
    try { localStorage.setItem('portfolio-language', language); } catch { /* Funciona também sem armazenamento. */ }
    if (window.ScrollTrigger) requestAnimationFrame(() => ScrollTrigger.refresh());
  }

  window.PortfolioLanguage = { text: value => language === 'en' ? (english[value] || value) : value };
  document.querySelectorAll('[data-language]').forEach(button => button.addEventListener('click', () => setLanguage(button.dataset.language, true)));
  let saved;
  try { saved = localStorage.getItem('portfolio-language'); } catch { /* Português é o padrão. */ }
  setLanguage(saved);
  document.querySelector('.language-switch').hidden = false;
})();
