from pathlib import Path
from html.parser import HTMLParser
import re, subprocess, unicodedata, sys

ROOT=Path("truongchuyen/physics")
OUT=Path("/tmp/vtalent-pdf-review")
OUT.mkdir(parents=True,exist_ok=True)
SPECS=[
("physics-math-level1-v51.html","V51",4),
("physics-mechanics-level1-v52.html","V52",8),
("physics-math-level2-v53.html","V53",6),
("physics-volume01-v61.html","V62",2),
("physics-mechanics-level2-v54.html","V54",10),
("physics-volume02-v62.html","V62",2),
("physics-volume03-v62.html","V62",2),
("physics-thermal-level2-v55.html","V55",12),
("physics-volume04-v63.html","V63",2),
("physics-electromagnetism-v56.html","V56",12),
("physics-volume05-v63.html","V63",2),
("physics-volume06-v63.html","V63",2)]
class Reader(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.books={}
        self.book=None
        self.tag=None
        self.buf=[]
        self.in_solutions=False
        self.section_stack=[]
    def handle_starttag(self,tag,attrs):
        a=dict(attrs)
        if tag=="article" and a.get("data-book"):
            self.book=(a["data-book"],a["lang"])
            assert self.book not in self.books,self.book
            self.books[self.book]=[]
        if self.book and tag=="section":
            self.section_stack.append("solutions" in a.get("class","").split())
            self.in_solutions=any(self.section_stack)
        if self.book and tag in ("h2","h3","h4","h5","p"):
            assert self.tag is None,(self.book,tag,self.tag)
            self.tag=tag
            self.buf=[]
    def handle_data(self,data):
        if self.book and self.tag:self.buf.append(data)
    def handle_endtag(self,tag):
        if self.book and tag==self.tag:
            self.books[self.book].append((tag,"".join(self.buf).strip(),self.in_solutions))
            self.tag=None
        if self.book and tag=="section":
            assert self.section_stack
            self.section_stack.pop()
            self.in_solutions=any(self.section_stack)
        if tag=="article" and self.book:
            assert not self.section_stack
            self.book=None

SPECIAL={"&":r"\&","%":r"\%","$":r"\$","#":r"\#","_":r"\_","{":r"\{","}":r"\}","\\":r"\textbackslash{}","~":r"\textasciitilde{}","^":r"\textasciicircum{}"}
SYMBOLS={"−":"-","×":r"\ensuremath{\times}","≤":r"\ensuremath{\le}","≥":r"\ensuremath{\ge}","≈":r"\ensuremath{\approx}","≠":r"\ensuremath{\ne}","≪":r"\ensuremath{\ll}","→":r"\ensuremath{\to}","∞":r"\ensuremath{\infty}","±":r"\ensuremath{\pm}"}
for x,y in zip("⁰¹²³⁴⁵⁶⁷⁸⁹⁻","0123456789-"):SYMBOLS[x]=r"\textsuperscript{"+y+"}"
for x,y in zip("₀₁₂₃₄₅₆₇₈₉","0123456789"):SYMBOLS[x]=r"\textsubscript{"+y+"}"
SPECIAL.update(SYMBOLS)
SPECIAL.update({"≫":r"\ensuremath{\gg}","√":r"\ensuremath{\surd}","∥":r"\ensuremath{\parallel}"})
SPECIAL.update({"ℓ":r"\ensuremath{\ell}","ₜ":r"\textsubscript{t}","†":r"\ensuremath{\dagger}"})
def prepare_figures(text, filename):
    counter=0
    def replace(m):
        nonlocal counter
        counter+=1
        svg=re.search(r"<svg\b[\s\S]*?</svg>",m[0])
        cap=re.search(r"<figcaption>([\s\S]*?)</figcaption>",m[0])
        assert svg and cap,filename
        stem=Path(filename).stem+"-figure-"+str(counter)
        src=OUT/(stem+".svg")
        dest=OUT/(stem+".pdf")
        src.write_text(svg[0],encoding="utf-8")
        subprocess.run(["rsvg-convert","-f","pdf","-o",str(dest),str(src)],check=True)
        return "<p>FIGTOKEN"+stem+"</p><p>"+cap[1]+"</p>"
    converted=re.sub(r"<figure\b[^>]*>[\s\S]*?</figure>",replace,text)
    assert counter==text.count("<figure "),filename
    return converted
def fmt(s):
    # Retain authored LaTeX expressions; escape only surrounding prose.
    def prose(x):
        result=[]
        for j,piece in enumerate(re.split(r"(https?://[^\s<>]+)",x)):
            result.append(r"\url{"+piece+"}" if j%2 else "".join(SPECIAL.get(c,c) for c in piece))
        return "".join(result)
    return "".join(x if i%2 else prose(x) for i,x in enumerate(re.split(r'(\\\(.*?\\\))',s,flags=re.S)))

ID=re.compile(r"\bPHY(?:101|102|103|201|202|203|204)-[A-F]-(?:V\d+-)?\d+\.\d+\b")
expected={}
for filename,version,num in SPECS:
    p=Reader()
    p.feed(prepare_figures((ROOT/filename).read_text(encoding="utf-8"),filename))
    assert len(p.books)==num,(filename,len(p.books))
    for (code,lang),parts in p.books.items():
        author="TS. Đặng Minh Tuấn" if lang=="vi" else "Dr. Dang Minh Tuan"
        title=parts[0][1]
        question_ids=set(ID.findall(" ".join(v for t,v,s in parts if not s)))
        solution_ids=set(ID.findall(" ".join(v for t,v,s in parts if s)))
        assert question_ids==solution_ids,(code,lang,question_ids-solution_ids,solution_ids-question_ids)
        stem=code+"-"+version+"-"+lang
        figure_count=sum(v.startswith("FIGTOKEN") for t,v,z in parts)
        expected[stem]=(author,question_ids,figure_count)
        pre=r"\documentclass[11pt,a4paper,openany]{book}"+"\n"+r"\usepackage[margin=23mm]{geometry}\usepackage{fontspec}\setmainfont{DejaVu Serif}\usepackage{amsmath,amssymb,mathtools,microtype,graphicx,xurl}\usepackage[hidelinks]{hyperref}\urlstyle{same}\raggedright\sloppy\pagestyle{plain}\setlength{\parindent}{0pt}\setlength{\parskip}{5pt}\setlength{\emergencystretch}{5em}\setlength{\hfuzz}{0pt}\setcounter{secnumdepth}{0}\setcounter{tocdepth}{1}"
        if lang=="vi":pre+=r"\renewcommand{\chaptername}{Chương}\renewcommand{\contentsname}{Mục lục}"
        pre+=r"\hypersetup{pdfauthor={"+author+r"},pdftitle={V-TALENT Physics "+code+r" "+version+r"}}"
        pre+=r"\begin{document}\pagestyle{plain}\title{\Large V-TALENT Physics\par\medskip\large "+fmt(title)+r"}\author{"+author+r"}\date{2026 -- "+version+(" -- Bản thảo kiểm tra" if lang=="vi" else " -- Review candidate")+r"}\maketitle\tableofcontents"
        b=[]
        for tag,value,sol in parts[1:]:
            if not value or value==author:continue
            if value.startswith("FIGTOKEN"):
                name=value[len("FIGTOKEN"):]
                b.append(r"\begin{center}\includegraphics[width=.80\linewidth]{"+name+r".pdf}\end{center}")
            elif tag=="h3":
                b.append(r"\chapter{"+fmt(value)+"}")
            elif tag=="h4":
                b.append(r"\section{"+fmt(value)+"}")
            elif tag=="h5":
                b.append(r"\subsection{"+fmt(value)+"}")
            else:b.append(fmt(value))
        (OUT/(stem+".tex")).write_text(pre+"\n\n"+"\n\n".join(b)+r"\end{document}",encoding="utf-8")
assert len(expected)==64
report=["V-TALENT Physics PDF review: candidate builds, not independently validated textbooks.","Existing published PDFs (page counts and extracted IDs; not proof of correctness):"]
for code in ["PHY101-A","PHY101-B","PHY102-A","PHY102-B","PHY102-C","PHY102-D"]:
    for lang in ["vi","en"]:
        pdf=ROOT/"physics-pdfs"/(code+"-"+lang+".pdf")
        info=subprocess.check_output(["pdfinfo",str(pdf)],text=True)
        txt=subprocess.check_output(["pdftotext",str(pdf),"-"],text=True)
        pages=re.search(r"^Pages:\s+(\d+)",info,re.M).group(1)
        report.append(f"{pdf.name}: {pages} pages, {len(set(ID.findall(txt)))} recognizable question IDs")
report.append("New candidate checks:")
errors=[]
for stem,(author,ids,figure_count) in expected.items():
    tex=OUT/(stem+".tex")
    with (OUT/(stem+".build.txt")).open("w") as log:
        run=subprocess.run(["latexmk","-xelatex","-interaction=nonstopmode","-halt-on-error","-file-line-error",tex.name],cwd=OUT,stdout=log,stderr=subprocess.STDOUT)
    if run.returncode:
        errors.append(stem+" compilation failed")
        continue
    pdf=OUT/(stem+".pdf")
    info=subprocess.check_output(["pdfinfo",str(pdf)],text=True)
    extracted=subprocess.check_output(["pdftotext",str(pdf),"-"],text=True)
    normalized=" ".join(unicodedata.normalize("NFC",extracted).split())
    compact=re.sub(r"\s+","",normalized)
    missing=[x for x in sorted(ids) if x not in compact]
    log=(OUT/(stem+".log")).read_text(errors="replace")
    glyphs=[s for s in log.splitlines() if "Missing character:" in s]
    overfull=re.findall(r"Overfull \\hbox \(([0-9.]+)pt too wide\)",log)
    severe=[float(x) for x in overfull if float(x)>5]
    pages=re.search(r"^Pages:\s+(\d+)",info,re.M).group(1)
    if author not in normalized:errors.append(stem+" author missing")
    if missing:errors.append(stem+" missing IDs "+str(missing))
    if glyphs:errors.append(stem+" missing glyphs "+str(glyphs[:5]))
    if severe:
        errors.append(stem+" overfull >5pt "+str(severe[:5]))
        for match in re.finditer(r"Overfull[^\n]*(?:\n[^\n]*){0,3}",log):
            report.append(match.group(0))
    report.append(f"{stem}: {pages} pages; {len(ids)} IDs expected, {len(missing)} missing; {figure_count} vector diagrams included by generator; {len(glyphs)} glyph warnings; {len(severe)} severe overfull boxes")
    # Rasterize title and first content page for human review.
    subprocess.run(["pdftoppm","-f","1","-l","1","-r","95","-png",str(pdf),str(OUT/(stem+"-cover"))],check=True)
    if int(pages)>=4:
        subprocess.run(["pdftoppm","-f","4","-l","4","-r","95","-png",str(pdf),str(OUT/(stem+"-sample"))],check=True)
report+=["Errors: "+str(errors),"Manual visual inspection and independent solution review are required before publication."]
(OUT/"quality-report.txt").write_text("\n".join(report),encoding="utf-8")
print("\n".join(report))
if errors:sys.exit(1)
