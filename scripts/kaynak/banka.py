# Soru bankası v2 → data/sorular.json + data/kazanimlar.json
# Çalıştır: python3 scripts/kaynak/banka.py
import json, glob, os, sys
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'v2'))
from tr import TR; from mat import MAT; from fen import FEN; from sos_ing import SOS, ING; from kazanim import K
from deneyap import SORULAR as DNY

# .py setlerini JSON'a dök (otomatik akış doğrudan JSON yazar)
for f in glob.glob(os.path.join(os.path.dirname(__file__), 'v2', 'set_*.py')):
    ns = {}; exec(open(f).read(), {'__name__': 'set', 'S': __import__('ortak').S}, ns)
    s = ns['SET']; json.dump(s, open(f"data/setler/{s['id']}.json", 'w'), ensure_ascii=False, indent=1)
SETS = [json.load(open(f)) for f in sorted(glob.glob('data/setler/*.json'))]

LEGS = [
 dict(id='tr', title='İstanbul → Londra', ders='Türkçe', icon='📘', **{'from': 'İstanbul'}, to='Londra', vehicle='plane', qs=list(TR)),
 dict(id='mat', title='Londra → New York', ders='Matematik', icon='📐', **{'from': 'Londra'}, to='New York', vehicle='plane', qs=list(MAT), gen=True),
 dict(id='fen', title='New York → Ay 🌙', ders='Fen Bilimleri', icon='🚀', **{'from': 'New York'}, to='Ay', vehicle='rocket', qs=list(FEN)),
 dict(id='sos', title='Ay → Kapadokya', ders='Sosyal Bilgiler', icon='🗺️', **{'from': 'Ay'}, to='Kapadokya', vehicle='plane', qs=list(SOS)),
 dict(id='ing', title='Kapadokya → Tokyo', ders='İngilizce', icon='🇬🇧', **{'from': 'Kapadokya'}, to='Tokyo', vehicle='plane', qs=list(ING)),
]
by = {L['id']: L for L in LEGS}
odev = []
for s in SETS:
    for q in s['sorular']:
        q = dict(q); q['set'] = s['id']
        by[s['ders']]['qs'].append(q)
        odev.append(q)
if odev:
    LEGS.append(dict(id='odev', title='Ödev Görevi ⭐', ders='Ödev Görevi', icon='📸', **{'from': 'Ödev'}, to='Usta', vehicle='plane', qs=odev,
                     ozel=True, setler=[{k: s[k] for k in ('id', 'baslik', 'ders', 'kazanimlar')} for s in SETS]))
LEGS.append(dict(id='deneyap', title='DENEYAP Rotası 🧠', ders='DENEYAP', icon='🧠', **{'from': 'Hangar'}, to='Atölye', vehicle='rocket', qs=list(DNY), ozel=True, gen=True))

hata, uyari = [], []
for L in LEGS:
    seen = set()
    for q in L['qs']:
        if len(q['o']) != 4: hata.append(f"{L['id']}: 4 şık değil: {q['q']}")
        if not 0 <= q['a'] < len(q['o']): hata.append(f"a hatalı: {q['q']}")
        if len(set(q['o'])) != len(q['o']): hata.append(f"tekrar eden şık: {q['q']}")
        if q['q'] in seen and L['id'] != 'odev': hata.append(f"tekrar eden soru: {q['q']}")
        seen.add(q['q'])
        if q.get('k') not in K: uyari.append(f"kazanım katalogda yok: {q.get('k')} — {q['q'][:50]}")
        for i in range(len(q['o'])):
            if i != q['a'] and str(i) not in q.get('yan', {}): hata.append(f"yanılgı eksik ({i}): {q['q']}")
        if not q.get('ip'): hata.append(f"ipucu yok: {q['q']}")
if hata: print('\n'.join(hata)); sys.exit(1)
json.dump(LEGS, open('data/sorular.json', 'w'), ensure_ascii=False, indent=1)
json.dump(K, open('data/kazanimlar.json', 'w'), ensure_ascii=False, indent=1)
print({L['id']: len(L['qs']) for L in LEGS}, 'toplam', sum(len(L['qs']) for L in LEGS if L['id'] != 'odev'), '| set:', len(SETS))
if uyari: print('UYARI:', *uyari, sep='\n  ')
