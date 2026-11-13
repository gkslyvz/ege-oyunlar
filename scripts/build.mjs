#!/usr/bin/env node
// data/*.json içeriğini oyun şablonlarına gömer ve tek dosyalık oyunları üretir.
// Kullanım: node scripts/build.mjs   →  games/<oyun>/index.html
import { readFileSync, writeFileSync, readdirSync, existsSync } from 'node:fs';

const sorular = JSON.parse(readFileSync('data/sorular.json', 'utf8'));
const sinavlar = existsSync('data/sinavlar.json') ? JSON.parse(readFileSync('data/sinavlar.json', 'utf8')) : [];

// Basit doğrulama: her sorunun doğru cevap indeksi seçenekler içinde olmalı.
for (const L of sorular) for (const q of L.qs) {
  if (!Array.isArray(q.o) || q.a < 0 || q.a >= q.o.length) throw new Error(`Hatalı soru (${L.id}): ${q.q}`);
}

const legs = `const LEGS = ${JSON.stringify(sorular)}; window.LEGS = LEGS;`;
const FONT_RE = /<link href="https:\/\/fonts\.googleapis\.com[^>]*>/;
const ortak = readFileSync('games/ortak/ortak.js', 'utf8');
const hedefler = existsSync('data/hedefler.json') ? readFileSync('data/hedefler.json', 'utf8') : '[]';
const bulut = existsSync('data/bulut.json') ? readFileSync('data/bulut.json', 'utf8').trim() : 'null';
const ortakKisisel = `window.HEDEFLER = ${hedefler.trim()};\nwindow.BULUT = ${bulut};\n` + ortak;
const ortakGenel = 'window.HEDEFLER = [];\n' + ortak.replace(/\/\*<BULUT>\*\/[\s\S]*?\/\*<\/BULUT>\*\/\n?/, '');
const exams = `const EXAMS = ${JSON.stringify(sinavlar)};`;

for (const game of readdirSync('games')) {
  const tpl = `games/${game}/template.html`;
  if (!existsSync(tpl)) continue;
  const html = yerelCDN(readFileSync(tpl, 'utf8')).replace('/*LEGS*/', () => legs).replace('/*EXAMS*/', exams).replace('/*ORTAK*/', () => ortakKisisel);
  if (html.includes('/*LEGS*/') || html.includes('/*EXAMS*/')) throw new Error(`${game}: yer tutucu kaldı`);
  writeFileSync(`games/${game}/index.html`, html);
  console.log(`✓ games/${game}/index.html`);
}
const n = sorular.reduce((s, L) => s + L.qs.length, 0);
console.log(`Soru: ${n} · Sınav: ${sinavlar.length}`);

// ---- Genel (herkese açık) sürüm: kişisel veri yok, çocuğun adı yok ----
// Kullanım: node scripts/build.mjs --genel <çıktı klasörü>
const gi = process.argv.indexOf('--genel');
// Kişisel sürümde three.js CDN yerine yerel kopya (çevrimdışı çalışsın diye)
const ayikla = (h, ad) => h.replace(new RegExp(`/\\*<${ad}>\\*/[\\s\\S]*?/\\*</${ad}>\\*/\\n?`, 'g'), '');
function yerelCDN(h, kok = '../../assets/') {
  return h.replace(FONT_RE, `<link rel="stylesheet" href="${kok}vendor/fonts.css">`).replace('https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js', `${kok}vendor/three.min.js`)
    .replace('https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/loaders/GLTFLoader.js', `${kok}vendor/GLTFLoader.js`)
    .replace('https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/exporters/STLExporter.js', `${kok}vendor/STLExporter.js`);
}
if (gi > 0) {
  const { mkdirSync, copyFileSync } = await import('node:fs');
  const out = process.argv[gi + 1];
  const REP = [['Pilot Ege', 'Pilot Kaptan'], ['Kaptan Ege', 'Kaptan'], ['astronot Ege', 'astronot kaptan'], ['Ege Pano', 'Pano'],
    ["Ege ankara'ya", "Ali ankara'ya"], ["Ege Ankara'ya", "Ali Ankara'ya"], ['(Ege, Bodrum)', '(Ali, Bodrum)'], ['pilotEge', 'mpOyun'], ['egeOrtak', 'mpOrtak'], ['Ege Oyunlar', 'MATPROSU Oyunlar']];
  const genelSorular = sorular.filter(l => l.id !== 'odev').map(l => ({ ...l, setler: undefined, qs: l.qs.filter(q => !q.set && !q.kaynak).map(({ kaynak, set, ...q }) => ({ ...q, tur: 'banka' })) }));
  const genelLegs = `const LEGS = ${JSON.stringify(genelSorular)}; window.LEGS = LEGS; window.ASSET_BASE = '../modeller/';`;
  for (const game of readdirSync('games')) {
    const tpl = `games/${game}/template.html`;
    if (!existsSync(tpl)) continue;
    let html = ayikla(yerelCDN(readFileSync(tpl, 'utf8'), '../'), 'PANO').replace('/*LEGS*/', () => genelLegs).replace('/*EXAMS*/', 'const EXAMS = [];').replace('/*ORTAK*/', () => ortakGenel);
    for (const [a, b] of REP) html = html.split(a).join(b);
    if (/\bEge\b/.test(html.replace(/Ege (Bölgesi|adaları|Denizi)|Marmara, Ege/g, ''))) throw new Error(`${game}: genel sürümde isim kaldı`);
    mkdirSync(`${out}/${game}`, { recursive: true });
    writeFileSync(`${out}/${game}/index.html`, html);
  }
  mkdirSync(`${out}/modeller/models`, { recursive: true });
  for (const f of readdirSync('assets/models')) copyFileSync(`assets/models/${f}`, `${out}/modeller/models/${f}`);
  const { cpSync } = await import('node:fs');
  cpSync('assets/vendor', `${out}/vendor`, { recursive: true });
  let hub = ayikla(readFileSync('index.html', 'utf8'), 'HEDEF').replace(FONT_RE, '<link rel="stylesheet" href="vendor/fonts.css">')
    .replace('<link rel="manifest" href="manifest.webmanifest">\n', '').replace(/\/\/ Çevrimdışı: yalnız Pano[^\n]*\n[^\n]*\n/, '');
  for (const [a, b] of REP) hub = hub.split(a).join(b);
  writeFileSync(`${out}/index.html`, hub);
  console.log(`Genel sürüm → ${out}`);
}

// ---------- Çevrimdışı (PWA) — yalnız kişisel sürüm (Pano /oyun altında) ----------
if (gi < 0) {
  const { createHash } = await import('node:crypto');
  const oyunlar = readdirSync('games').filter((g) => existsSync(`games/${g}/index.html`));
  const dosyalar = ['./', 'index.html', 'data/hedefler.json', 'manifest.webmanifest', ...oyunlar.map((g) => `games/${g}/`), ...readdirSync('assets/models').filter((f) => f.endsWith('.glb')).map((f) => `assets/models/${f}`), 'assets/vendor/three.min.js', 'assets/vendor/GLTFLoader.js', 'assets/vendor/STLExporter.js'];
  const surum = createHash('sha256').update(oyunlar.map((g) => readFileSync(`games/${g}/index.html`)).join('') + readFileSync('index.html')).digest('hex').slice(0, 10);
  const CDN = ['https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js', 'https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/loaders/GLTFLoader.js', 'https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/exporters/STLExporter.js'];
  writeFileSync('sw.js', `// Otomatik üretildi (build.mjs). Sürüm değişince eski önbellek silinir.
const SURUM='oyun-${surum}';const DOSYALAR=${JSON.stringify(dosyalar)};const CDN=${JSON.stringify(CDN)};
self.addEventListener('install',e=>{e.waitUntil(caches.open(SURUM).then(c=>Promise.all([c.addAll(DOSYALAR),...CDN.map(u=>fetch(u,{mode:'no-cors'}).then(r=>c.put(u,r)).catch(()=>{}))])).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x.startsWith('oyun-')&&x!==SURUM).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{const r=e.request;if(r.method!=='GET')return;const u=new URL(r.url);
  if(u.pathname.startsWith('/api/')||u.hostname.endsWith('supabase.co'))return; // canlı veri önbelleğe alınmaz
  if(r.mode==='navigate'){e.respondWith(fetch(r).then(x=>{const k=x.clone();caches.open(SURUM).then(c=>c.put(r,k));return x}).catch(()=>caches.match(r).then(x=>x||caches.match('./'))));return}
  e.respondWith(caches.match(r).then(x=>x||fetch(r).then(y=>{if(y.ok||y.type==='opaque'){const k=y.clone();caches.open(SURUM).then(c=>c.put(r,k))}return y})))});
`);
  writeFileSync('manifest.webmanifest', JSON.stringify({ name: 'Ege Oyunlar', short_name: 'Oyunlar', start_url: './', scope: './', display: 'standalone', orientation: 'portrait', background_color: '#0b3d91', theme_color: '#0b3d91', icons: [] }, null, 1));
  console.log('PWA sürüm', surum, '·', dosyalar.length, 'dosya');
}
