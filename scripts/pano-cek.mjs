#!/usr/bin/env node
// Ege Pano verisini oyun verisine çevirir.
// Kullanım: node scripts/pano-cek.mjs <ege-pano/veri klasörü>
// Çıktı: data/sinavlar.json (sınav takvimi) ve data/pano-kartlari.json (soru-cevaplı tekrar kartları).
// Gizlilik: okul adı, e-posta, sınıf bilgisi gibi kişisel veriler ALINMAZ; yalnızca ders, tarih ve konu.
import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const dir = process.argv[2];
if (!dir) { console.error('Kullanım: node scripts/pano-cek.mjs <ege-pano/veri>'); process.exit(1); }

const DERS = { 'Türkçe': 'tr', 'Matematik': 'mat', 'Fen Bilimleri': 'fen' };
const files = readdirSync(dir).filter((f) => /^yukleme-.*\.json$/.test(f)).sort();
if (!files.length) { console.error('veri klasöründe yukleme-*.json bulunamadı'); process.exit(1); }

const exams = new Map();
const cards = new Map();
for (const f of files) {
  const d = JSON.parse(readFileSync(join(dir, f), 'utf8'));
  for (const e of d.exams ?? []) {
    const region = DERS[e.subject];
    if (!region || !e.date) continue;
    exams.set(e.id, { id: e.id, region, date: e.date, title: e.title.replace(/\s*\(.*?\)\s*/g, ' ').trim() });
  }
  for (const t of d.topics ?? []) {
    const region = DERS[t.subject];
    if (!region || !t.question || !t.answer) continue;
    cards.set(t.id, { id: t.id, region, t: t.title, q: t.question, answer: t.answer });
  }
}

const sinavlar = [...exams.values()].sort((a, b) => a.date.localeCompare(b.date));
writeFileSync('data/sinavlar.json', JSON.stringify(sinavlar, null, 1) + '\n');
writeFileSync('data/pano-kartlari.json', JSON.stringify([...cards.values()], null, 1) + '\n');
console.log(`Sınav: ${sinavlar.length} · Pano kartı: ${cards.size} (kaynak: ${files.join(', ')})`);
console.log('Not: pano-kartlari.json açık uçlu sorulardır; oyun için çoktan seçmeliye Claude çevirir ve data/sorular.json\'a ekler.');
