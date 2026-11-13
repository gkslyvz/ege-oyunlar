# Ege Oyunlar ✈️

Ege'nin okul konularıyla oynanan eğitsel oyunlar. Sorular ve sınav takvimi **Ege Pano**'dan gelir.

| Oyun | Tür | Klasör |
|---|---|---|
| **Profesör Unutkan'dan Kaçış** | 3 şeritli koşu: doğru kapıdan geç, yakıt topla | `games/kacis` |
| **Cevap Halkaları** | 3D uçuş (gerçek PA-28 modeli) | `games/cevap-halkalari` |
| **Dünya Turu** | RPG soru düellosu, uçak kartları, sınav boss'u | `games/dunya-turu` |
| **Gökyüzü Görevi** | Basit rota oyunu (ilk sürüm) | `games/gokyuzu-gorevi` |

## Ortak motor (`games/ortak/ortak.js`)
- **Tekrarsız seçim:** görülen sorular geriye atılır; yanlışlar aralıklı tekrarla (0-1-3-7-21 gün) geri gelir.
- **Sınırsız matematik:** 13 üretici her seferinde yeni sayılarla soru yazar (açı, çevre, alan, basamak, kesir, işlem önceliği…).
- **İlerleme:** oyunlar arası ortak XP, seviye/rütbe, günlük seri, günlük görev (15 doğru).
- **Ses:** dosyasız WebAudio müzik (3 tema) ve efektler.

## Soru bankası
183 soru, 5 ders (TYMM 5. sınıf: Fen 7 ünite, Matematik 6 tema, Sosyal 6 öğrenme alanı, İngilizce temaları). Kaynak: `scripts/kaynak/banka.py` → `data/sorular.json`.

## Güncelleme akışı
```bash
node scripts/pano-cek.mjs ../ege-pano/veri   # sınav tarihleri + Pano kartları
python3 scripts/kaynak/banka.py               # soru bankasını üret
node scripts/build.mjs                        # soruları ve ortak motoru oyunlara göm
```

## Yapı
```
data/        sorular.json · sinavlar.json · pano-kartlari.json
games/       her oyun: template.html (kaynak) → index.html (üretilen)
scripts/     pano-cek.mjs · build.mjs
docs/        yol haritası ve araştırma notları
```

## Lisanslar
Kod: proje sahibine ait. `assets/models/` altındaki uçak modelleri GPLv2 (FlightGear/Flightradar24) — ayrıntı `assets/models/README.md`.
