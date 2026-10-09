"""Gera o currículo público a partir de informações confirmadas pelo usuário."""
from pathlib import Path
from reportlab.lib import colors
from reportlab.lib.enums import TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, HRFlowable

ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / 'assets' / 'curriculo-eduardo-bianchi.pdf'
pdfmetrics.registerFont(TTFont('Resume', 'C:/Windows/Fonts/arial.ttf'))
pdfmetrics.registerFont(TTFont('ResumeBold', 'C:/Windows/Fonts/arialbd.ttf'))
pdfmetrics.registerFontFamily('Resume', normal='Resume', bold='ResumeBold')
INK = colors.HexColor('#182536')
BLUE = colors.HexColor('#3455a0')
MUTED = colors.HexColor('#4d5865')
styles = {
    'name': ParagraphStyle('name', fontName='ResumeBold', fontSize=25, leading=30, textColor=INK, spaceAfter=5),
    'role': ParagraphStyle('role', fontName='Resume', fontSize=11, leading=16, textColor=BLUE, spaceAfter=8),
    'contact': ParagraphStyle('contact', fontName='Resume', fontSize=9.3, leading=13.5, textColor=MUTED),
    'section': ParagraphStyle('section', fontName='ResumeBold', fontSize=10, leading=14, textColor=BLUE, spaceBefore=10, spaceAfter=5, keepWithNext=True),
    'body': ParagraphStyle('body', fontName='Resume', fontSize=9.7, leading=14.2, textColor=INK, alignment=TA_LEFT),
    'project': ParagraphStyle('project', fontName='ResumeBold', fontSize=9.8, leading=13.6, textColor=INK, spaceBefore=5, spaceAfter=2, keepWithNext=True),
    'course': ParagraphStyle('course', fontName='Resume', fontSize=9.5, leading=13.3, textColor=INK),
}
story = []
def p(text, style='body'):
    story.append(Paragraph(text, styles[style]))
def section(title):
    p(title, 'section')

p('Eduardo Pires Bianchi', 'name')
p('Estudante de Engenharia de Software | Desenvolvimento Web', 'role')
p('Dourados, MS · '
  '<link href="mailto:eduardopiresbianchi2003@gmail.com" color="#3455a0">eduardopiresbianchi2003@gmail.com</link> · '
  '<link href="tel:+5567999969634" color="#3455a0">+55 (67) 9 9996-9634</link>', 'contact')
p('<link href="https://www.linkedin.com/in/eduardo-bianchi-31bb76321/" color="#3455a0">LinkedIn</link> · '
  '<link href="https://github.com/devEduardoBianchi" color="#3455a0">GitHub</link> · '
  '<link href="https://portfolio-one-gold-1u7sxwbaen.vercel.app/" color="#3455a0">Portfólio</link>', 'contact')
story.extend([Spacer(1, 12), HRFlowable(width='100%', thickness=1, color=colors.HexColor('#c6d1e0'))])

section('PERFIL E OBJETIVO')
p('Estudante de Engenharia de Software na Unigran, com conhecimentos em HTML, CSS, JavaScript, React, TypeScript, Git e SQL. Desenvolvo projetos pessoais para praticar interfaces responsivas, interações acessíveis e organização de dados. Busco oportunidades de estágio ou trabalho em desenvolvimento web para contribuir com uma equipe e ampliar minha experiência prática.')

section('FORMAÇÃO ACADÊMICA')
p('<b>Engenharia de Software</b> | Unigran - em andamento')
p('<b>Ensino Médio completo</b> | Elite Rede de Ensino - Dourados, MS')

section('CONHECIMENTOS TÉCNICOS')
p('<b>Front-end:</b> HTML5, CSS3, JavaScript, React, TypeScript, layouts responsivos, Grid e Flexbox.<br/>'
  '<b>Interfaces e ferramentas:</b> acessibilidade, GSAP, lógica de programação, Git e GitHub.<br/>'
  '<b>Dados e projetos:</b> SQL; Node.js, Express e SQLite em projeto demonstrativo; hardware e montagem de computadores.')

section('PROJETOS PESSOAIS')
p('<link href="https://nexo-desk-pi.vercel.app/" color="#3455a0">Nexo Desk | Sistema de chamados</link>', 'project')
p('Demonstração de suporte com fila e quadro de chamados, filtros, indicadores, histórico e ações em lote. A versão local usa Node.js, Express e SQLite.')
p('<link href="https://entrecenas-blond.vercel.app/" color="#3455a0">Entre Cenas | Diário de cinema</link>', 'project')
p('Aplicação para pesquisar filmes, organizar uma lista pessoal e registrar avaliações e notas; inclui estatísticas, persistência local e TMDb opcional.')
p('<link href="https://forma-nine-wheat.vercel.app/#inicio" color="#3455a0">Forma | Página de contato</link>', 'project')
p('Página com temas claro e escuro, validação acessível e estados de envio; a demonstração não envia mensagens.')
p('<link href="https://pricecards.vercel.app/#inicio" color="#3455a0">Price Cards | Página de planos</link>', 'project')
p('Estudo responsivo de comparação de hospedagem com indicação de plano; os preços são demonstrativos.')
p('<link href="https://fiotech-six.vercel.app/" color="#3455a0">FIO / tech | Loja conceitual</link>', 'project')
p('Loja demonstrativa de eletrônicos com catálogo filtrável, comparação, favoritos e questionário de setup; produtos e preços fictícios.')

section('CURSOS COMPLEMENTARES')
for course in [
    'FullStack PRO (Sujeito Programador) - <b>em andamento</b>; React, TypeScript, Next.js, Node.js, bancos de dados, testes e IA para devs.',
    'Desenvolvimento Frontend: 10 Projetos - <b>132,5 h</b>',
    'Estudos de JavaScript (4 cursos: lógica de programação, fundamentos, tipos, condicionais e laços) - <b>40 h</b>',
    'Estudos de HTML e CSS (4 cursos: estrutura, estilo, layout, formulários, SEO e acessibilidade) - <b>42 h</b>',
    'Internet: fundamentos da web - <b>8 h</b>',
    'Lógica de Programação - <b>6 h</b>',
]:
    p(course, 'course')

section('IDIOMAS')
p('<b>Inglês intermediário</b> - compreensão de textos e conteúdos, com boa comunicação.')

def footer(canvas, doc):
    canvas.saveState()
    canvas.setStrokeColor(colors.HexColor('#c6d1e0'))
    canvas.line(43, 37, A4[0]-43, 37)
    canvas.setFont('Resume', 8)
    canvas.setFillColor(MUTED)
    canvas.drawString(43, 24, 'Atualizado em outubro de 2026')
    canvas.drawRightString(A4[0]-43, 24, str(doc.page))
    canvas.restoreState()

doc = SimpleDocTemplate(str(OUTPUT), pagesize=A4, rightMargin=43, leftMargin=43,
                        topMargin=34, bottomMargin=43, title='Currículo - Eduardo Pires Bianchi',
                        author='Eduardo Pires Bianchi', subject='Desenvolvimento Web | Estágio e trabalho')
doc.build(story, onFirstPage=footer, onLaterPages=footer)
print(OUTPUT)
