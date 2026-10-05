"""Erzeugt die Word-Vorlage nach dem Leitfaden der Fakultät (Abschnitt 3.3.1)
aus der Standardvorlage von Pandoc: Arial 11 pt, 1,5-zeilig, Blocksatz,
2,5 cm Rand, Überschriften fett ohne Leerzeile danach, Absatzabstand eine Zeile."""
import os, subprocess, sys
from docx import Document
from docx.enum.text import WD_ALIGN_PARAGRAPH, WD_LINE_SPACING
from docx.oxml.ns import qn
from docx.shared import Cm, Pt, RGBColor

ziel = sys.argv[1]
roh = ziel + ".roh.docx"
subprocess.run(["quarto", "pandoc", "-o", roh, "--print-default-data-file", "reference.docx"],
               check=True, shell=os.name == "nt")

doc = Document(roh)
for s in doc.sections:
    s.page_height, s.page_width = Cm(29.7), Cm(21.0)
    s.top_margin = s.bottom_margin = s.left_margin = s.right_margin = Cm(2.5)

SCHWARZ = RGBColor(0, 0, 0)

def schrift(style, groesse=None, fett=None):
    f = style.font
    f.name = "Arial"
    rpr = style.element.get_or_add_rPr()
    rfonts = rpr.find(qn("w:rFonts"))
    if rfonts is None:
        rfonts = rpr.makeelement(qn("w:rFonts"), {})
        rpr.append(rfonts)
    for a in ("w:ascii", "w:hAnsi", "w:cs", "w:eastAsia"):
        rfonts.set(qn(a), "Arial")
    for a in ("w:asciiTheme", "w:hAnsiTheme", "w:cstheme", "w:eastAsiaTheme"):
        if rfonts.get(qn(a)) is not None:
            del rfonts.attrib[qn(a)]
    f.color.rgb = SCHWARZ
    f.italic = False
    if groesse:
        f.size = Pt(groesse)
    if fett is not None:
        f.bold = fett

def absatz(style, zeilen=1.5, vor=0, nach=12, block=False):
    p = style.paragraph_format
    p.line_spacing_rule = WD_LINE_SPACING.MULTIPLE
    p.line_spacing = zeilen
    p.space_before, p.space_after = Pt(vor), Pt(nach)
    if block:
        p.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY

st = doc.styles
for name in ("Normal", "Body Text", "First Paragraph", "Compact"):
    if name in [s.name for s in st]:
        schrift(st[name], 11)
        absatz(st[name], 1.5, 0, 12 if name != "Compact" else 0, block=name != "Compact")

for name, groesse, vor in (("Heading 1", 14, 18), ("Heading 2", 12, 12), ("Heading 3", 11, 12)):
    schrift(st[name], groesse, True)
    absatz(st[name], 1.5, vor, 0)
    st[name].paragraph_format.keep_with_next = True

for name, groesse, fett in (("Title", 16, True), ("Subtitle", 12, False), ("Author", 11, False), ("Date", 11, False)):
    if name in [s.name for s in st]:
        schrift(st[name], groesse, fett)
        absatz(st[name], 1.5, 0, 12)
        st[name].paragraph_format.alignment = WD_ALIGN_PARAGRAPH.CENTER

# Bibliographie: hängender Einzug, einfacher Abstand innerhalb, Leerzeile zwischen Einträgen
if "Bibliography" in [s.name for s in st]:
    schrift(st["Bibliography"], 11)
    absatz(st["Bibliography"], 1.5, 0, 12)
    st["Bibliography"].paragraph_format.left_indent = Cm(1)
    st["Bibliography"].paragraph_format.first_line_indent = Cm(-1)

# Beschriftungen: fett, einzeilig, Textgröße
for name in ("Caption", "Table Caption", "Image Caption"):
    if name in [s.name for s in st]:
        schrift(st[name], 11, True)
        absatz(st[name], 1.0, 6, 6)

# Fußnoten 9 pt einzeilig
for name in ("Footnote Text",):
    if name in [s.name for s in st]:
        schrift(st[name], 9)
        absatz(st[name], 1.0, 0, 0)

for name in ("TOC Heading",):
    if name in [s.name for s in st]:
        schrift(st[name], 14, True)

doc.save(ziel)
os.remove(roh)
print("geschrieben:", ziel)
