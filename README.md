# Ege Oyunlar ✈️

Ege'nin okul konularıyla oynanan eğitsel oyunlar. Sorular ve sınav takvimi **Ege Pano**'dan gelir.

| Oyun | Tür | Klasör |
|---|---|---|
| **Cevap Halkaları** | 3D uçuş: doğru cevabın halkasından geç | `games/cevap-halkalari` |
| **Dünya Turu** | RPG soru düellosu, uçak kartları, sınav boss'u | `games/dunya-turu` |
| **Gökyüzü Görevi** | Basit rota oyunu (ilk sürüm) | `games/gokyuzu-gorevi` |

## Güncelleme akışı
```bash
node scripts/pano-cek.mjs ../ege-pano/veri   # sınav tarihleri + Pano kartları
node scripts/build.mjs                        # soruları oyunlara göm
```

## Yapı
```
data/        sorular.json · sinavlar.json · pano-kartlari.json
games/       her oyun: template.html (kaynak) → index.html (üretilen)
scripts/     pano-cek.mjs · build.mjs
docs/        yol haritası ve araştırma notları
```
