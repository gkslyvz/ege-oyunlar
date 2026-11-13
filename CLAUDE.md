# CLAUDE.md — Ege Oyunlar

Ege'nin (5. sınıf, ~10 yaş) ödev ve sınav konularından beslenen eğitsel oyunlar. Ege uçak ve pilot meraklısı.

## Kurallar
- **Veri tek kaynaktan gelir:** sorular `data/sorular.json`, sınav takvimi `data/sinavlar.json`. Oyun HTML'leri elle düzenlenmez; `games/<oyun>/template.html` düzenlenir, sonra `node scripts/build.mjs` çalıştırılır.
- **Pano bağlantısı:** `node scripts/pano-cek.mjs <ege-pano/veri>` sınav tarihlerini ve Pano kartlarını çeker. Pano kartları açık uçludur; oyuna eklenmeden önce Claude bunları 3-4 seçenekli, tek doğru cevaplı sorulara çevirir ve `data/sorular.json`'a ekler.
- **Gizlilik (repo herkese açık):** okul adı, e-posta, sınıf/şube, not, sağlık bilgisi ASLA repoya girmez. Yalnızca ders, konu, soru ve sınav tarihi.
- **Soru kalitesi:** 5. sınıf Maarif müfredatı düzeyi; her sorunun tek doğru cevabı ve kısa, çocuk dilinde açıklaması (`e`) olur. Bilgi doğruluğu emin olunmadan soru eklenmez.
- **Çocuk dostu tasarım:** ceza yok, yanlış cevap öğretici geri bildirim + sorunun tekrar gelmesi. Büyük dokunma alanları, telefonda dikey ekran önceliği.
- **Ortak motor:** soru seçimi, ilerleme ve ses `games/ortak/ortak.js`'te; build `/*ORTAK*/` yerine gömer. Yeni oyun bu motoru kullanmalı (`Ortak.sec`, `Ortak.kaydet`, `Ortak.xp`).
- **Soru ekleme:** `scripts/kaynak/banka.py`'ye eklenir (aynı soru metni iki kez olamaz), sonra `python3 scripts/kaynak/banka.py && node scripts/build.mjs`.
- **Teknoloji:** tek dosyalık HTML + vanilla JS; 3D için Three.js r128 (cdnjs). Derleme aracı yok.
- **Test:** her değişiklikten sonra build + Playwright ile telefon boyutunda (390×844) ekran görüntüsü ve konsol hatası kontrolü.

## Soru şeması
```json
{ "t": "Konu", "q": "Soru metni", "o": ["A", "B", "C"], "a": 1, "e": "Neden doğru (kısa)" }
```
