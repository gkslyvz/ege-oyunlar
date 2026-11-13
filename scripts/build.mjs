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
const ortak = readFileSync('games/ortak/ortak.js', 'utf8');
const exams = `const EXAMS = ${JSON.stringify(sinavlar)};`;

for (const game of readdirSync('games')) {
  const tpl = `games/${game}/template.html`;
  if (!existsSync(tpl)) continue;
  const html = readFileSync(tpl, 'utf8').replace('/*LEGS*/', () => legs).replace('/*EXAMS*/', exams).replace('/*ORTAK*/', () => ortak);
  if (html.includes('/*LEGS*/') || html.includes('/*EXAMS*/')) throw new Error(`${game}: yer tutucu kaldı`);
  writeFileSync(`games/${game}/index.html`, html);
  console.log(`✓ games/${game}/index.html`);
}
const n = sorular.reduce((s, L) => s + L.qs.length, 0);
console.log(`Soru: ${n} · Sınav: ${sinavlar.length}`);

// ---- Genel (herkese açık) sürüm: kişisel veri yok, çocuğun adı yok ----
// Kullanım: node scripts/build.mjs --genel <çıktı klasörü>
const gi = process.argv.indexOf('--genel');
if (gi > 0) {
  const { mkdirSync, copyFileSync } = await import('node:fs');
  const out = process.argv[gi + 1];
  const REP = [['Pilot Ege', 'Pilot Kaptan'], ['Kaptan Ege', 'Kaptan'], ['astronot Ege', 'astronot kaptan'], ['Ege Pano', 'Pano'],
    ["Ege ankara'ya", "Ali ankara'ya"], ["Ege Ankara'ya", "Ali Ankara'ya"], ['(Ege, Bodrum)', '(Ali, Bodrum)'], ['pilotEge', 'mpOyun'], ['egeOrtak', 'mpOrtak'], ['Ege Oyunlar', 'MATPROSU Oyunlar']];
  const genelLegs = `const LEGS = ${JSON.stringify(sorular)}; window.LEGS = LEGS; window.ASSET_BASE = '../modeller/';`;
  for (const game of readdirSync('games')) {
    const tpl = `games/${game}/template.html`;
    if (!existsSync(tpl)) continue;
    let html = readFileSync(tpl, 'utf8').replace('/*LEGS*/', () => genelLegs).replace('/*EXAMS*/', 'const EXAMS = [];').replace('/*ORTAK*/', () => ortak);
    for (const [a, b] of REP) html = html.split(a).join(b);
    if (/\bEge\b/.test(html.replace(/Ege Bölgesi/g, ''))) throw new Error(`${game}: genel sürümde isim kaldı`);
    mkdirSync(`${out}/${game}`, { recursive: true });
    writeFileSync(`${out}/${game}/index.html`, html);
  }
  mkdirSync(`${out}/modeller/models`, { recursive: true });
  for (const f of readdirSync('assets/models')) copyFileSync(`assets/models/${f}`, `${out}/modeller/models/${f}`);
  let hub = readFileSync('index.html', 'utf8');
  for (const [a, b] of REP) hub = hub.split(a).join(b);
  writeFileSync(`${out}/index.html`, hub);
  console.log(`Genel sürüm → ${out}`);
}
