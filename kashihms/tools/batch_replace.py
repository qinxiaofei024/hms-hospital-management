import os
import re
from pathlib import Path

ROOT = Path(r"C:\Users\qinxi\lakehouse_guangdong\kashihms")
EXTS = {'.html', '.js', '.css'}

REPLACEMENTS = [
    (r"佛山市南海区中医院数据中心管理平台", "喀什地区第一人民医院数据中心管理平台"),
    (r"NANHAI HOSPITAL DATA CENTER MANAGEMENT PLATFORM", "Kashgar First People's Hospital Data Center Management Platform"),
    (r"Nanhai Hospital Data Center Management Platform", "Kashgar First People's Hospital Data Center Management Platform"),
    (r"/hms/", "/kashihms/")
]

# Also handle a potential exact redirect to /hms/index.html
REPLACEMENTS.append((r"/hms/index.html", "/kashihms/index.html"))

changed_files = 0
changed_bytes = 0

def process_file(p: Path):
    global changed_files, changed_bytes
    try:
        if p.suffix.lower() not in EXTS:
            return
        text = p.read_text(encoding='utf-8')
        new = text
        for pat, rep in REPLACEMENTS:
            new = re.sub(pat, rep, new)
        if new != text:
            p.write_text(new, encoding='utf-8')
            changed_files += 1
            changed_bytes += abs(len(new) - len(text))
            print(f"updated: {p.relative_to(ROOT)}")
    except Exception as e:
        print(f"error: {p} -> {e}")

for dirpath, dirnames, filenames in os.walk(ROOT):
    for fn in filenames:
        process_file(Path(dirpath) / fn)

print(f"done. files={changed_files}, delta_bytes={changed_bytes}")