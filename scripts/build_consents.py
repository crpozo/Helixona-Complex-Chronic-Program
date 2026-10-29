"""Generate src/mock/consentContent.ts from the consent .docx files in docs/source/consents.
Wording is kept exactly as supplied; the paper signature block is replaced by the app's e-signature."""
import zipfile, re, html, json, sys, os, glob
src_dir, out = sys.argv[1], sys.argv[2]
ORDER = ['General_Informed_Consent_for_Treatment', 'Notice_of_Privacy_Practices', 'Physician-Patient_Arbitration_Agreement', 'Financial_Agreement', 'Assignment_of_Benefits_Agreement',
         'Informed_Consent_for_Consults__Follow_Ups', 'Consent_for_Medical_Management_and_Care_Plans', 'Informed_Consent_for_Diagnostics', 'Informed_Consent_for_Telemedicine', 'Consent_and_Authorization_for_Intravenous_Therapy_Procedures']
SIG_MARKERS = ('Patient or Legal Representative Signature', 'Signature: ____', 'If signed by someone other than the patient')
docs = []
for name in ORDER:
    path = os.path.join(src_dir, name + '.docx')
    xml = zipfile.ZipFile(path).read('word/document.xml').decode('utf8')
    paras = []
    for p in re.findall(r'<w:p[ >].*?</w:p>', xml, flags=re.S):
        style = re.search(r'<w:pStyle w:val="([^"]+)"', p)
        t = html.unescape(''.join(re.findall(r'<w:t[^>]*>(.*?)</w:t>', p, flags=re.S))).strip()
        if not t: continue
        if any(t.startswith(m) for m in SIG_MARKERS): continue
        bold = bool(re.search(r'<w:b/>|<w:b w:val="1"', p)) and len(t) < 120
        heading = bool(style and ('Heading' in style.group(1) or 'Title' in style.group(1))) or bold
        bullet = '<w:numPr>' in p
        paras.append({'t': t, 'h': heading, 'b': bullet})
    title = paras[0]['t']
    docs.append({'key': name.lower().replace('__', '-').replace('_', '-'), 'title': title, 'file': name + '.docx', 'version': 'v1', 'paragraphs': paras[1:]})
ts = '// GENERATED from docs/source/consents/*.docx by scripts/build_consents.py. Wording kept exactly as supplied.\n'
ts += "export interface ConsentPara { t: string; h?: boolean; b?: boolean }\nexport interface ConsentDoc { key: string; title: string; file: string; version: string; paragraphs: ConsentPara[] }\n"
ts += 'export const consents: ConsentDoc[] = ' + json.dumps(docs, ensure_ascii=False, indent=1) + '\n'
open(out, 'w').write(ts)
for d in docs: print(d['key'], d['title'], len(d['paragraphs']))
