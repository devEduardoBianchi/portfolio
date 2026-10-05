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
    'contact': ParagraphStyle('contact', fontName='Resume', fontSize=9.3, leading=14, textColor=MUTED),
    'section': ParagraphStyle('section', fontName='ResumeBold', fontSize=10, leading=14, textColor=BLUE, spaceBefore=13, spaceAfter=6, keepWithNext=True),
    'body': ParagraphStyle('body', fontName='Resume', fontSize=9.7, leading=14.2, textColor=INK, alignment=TA_LEFT),
    'project': ParagraphStyle('project', fontName='ResumeBold', fontSize=10, leading=14, textColor=INK, spaceBefore=6, spaceAfter=2, keepWithNext=True),
    'course': ParagraphStyle('course', fontName='Resume', fontSize=9.5, leading=14.5, textColor=INK),
}
story = []
def p(text, style='body'):
    story.append(Paragraph(text, styles[style]))
def section(title):
    p(title, 'section')

p('Eduardo Pires Bianchi', 'name')
p('Estágio em Desenvolvimento Web | Estudante de Engenharia de Software', 'role')
p('Dourados, MS', 'contact')
p('<link href="mailto:eduardopiresbianchi2003@gmail.com" color="#3455a0">eduardopiresbianchi2003@gmail.com</link>', 'contact')
p('<link href="https://www.linkedin.com/in/eduardo-bianchi-31bb76321/" color="#3455a0">linkedin.com/in/eduardo-bianchi-31bb76321</link>', 'contact')
story.extend([Spacer(1, 12), HRFlowable(width='100%', thickness=1, color=colors.HexColor('#c6d1e0'))])

section('PERFIL E OBJETIVO')
p('Estudante de Engenharia de Software na Unigran, com conhecimentos em HTML, CSS, JavaScript, Git e SQL. Desenvolvo projetos pessoais para praticar interfaces responsivas, interações acessíveis e manipulação de dados. Busco uma oportunidade de estágio para contribuir com uma equipe e ampliar minha experiência prática em desenvolvimento web.')

section('FORMAÇÃO ACADÊMICA')
p('<b>Engenharia de Software</b> | Unigran - em andamento')

section('CONHECIMENTOS TÉCNICOS')
p('<b>Front-end:</b> HTML5, CSS3, JavaScript, layouts responsivos, Grid e Flexbox.<br/>'
  '<b>Fundamentos e ferramentas:</b> lógica de programação, Git, GitHub e banco de dados / SQL.<br/>'
  '<b>Projetos e outros conhecimentos:</b> Node.js, Express e SQLite em projeto demonstrativo; hardware e montagem de computadores.')

section('PROJETOS PESSOAIS')
p('Nexo Desk | Sistema de chamados', 'project')
p('Sistema local de suporte com HTML, CSS, JavaScript, GSAP, Node.js, Express e SQLite. Reúne fila e quadro de chamados, filtros, indicadores, histórico, notas internas, ações em lote e desfazer alterações.')
p('Entre Cenas | Diário de cinema', 'project')
p('Aplicação em HTML, CSS e JavaScript para descobrir filmes, organizar uma lista pessoal e registrar avaliações e anotações. Inclui estatísticas, persistência local e integração opcional com o TMDB.')
p('Forma | Página de contato', 'project')
p('Página em HTML, CSS e JavaScript com GSAP, validação acessível e estados de envio, conclusão e falha recuperável. O modo demonstração não envia mensagens; integração real é configurável.')
p('Price Cards | Página de planos', 'project')
p('Estudo de interface em HTML e CSS para comparar planos de hospedagem. Usa layout responsivo, foco visível e um plano recomendado. Demonstração visual, sem contratação de serviços.')

section('CURSOS COMPLEMENTARES')
for course in [
    'Desenvolvimento Frontend: 10 Projetos - <b>132,5 h</b>',
    'Estudos de JavaScript (4 cursos: fundamentos, tipos, condicionais e laços) - <b>40 h</b>',
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
                        topMargin=38, bottomMargin=48, title='Currículo - Eduardo Pires Bianchi',
                        author='Eduardo Pires Bianchi', subject='Estágio em Desenvolvimento Web')
doc.build(story, onFirstPage=footer, onLaterPages=footer)
print(OUTPUT)
