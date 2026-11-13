# Lisanslar ve atıflar

| Bileşen | Lisans | Kaynak | Nerede |
|---|---|---|---|
| three.js r128 (three.min.js, GLTFLoader.js, STLExporter.js) | MIT | https://github.com/mrdoob/three.js (npm `three@0.128.0`) | `assets/vendor/`, lisans: `assets/vendor/LICENSE-three.txt` |
| Baloo 2 yazı tipi | SIL Open Font License 1.1 | https://fonts.google.com/specimen/Baloo+2 (npm `@fontsource/baloo-2`) | `assets/vendor/fonts/`, lisans: `LICENSE-OFL.txt` |
| Piper PA-28 3B modeli (`pa28.glb`) | **GPLv2** | FlightGear uçak modeli, Flightradar24 `fr24-3d-models` deposu üzerinden (glTF 1.0 → 2.0 dönüştürüldü) | `assets/models/`, lisans: `LICENSE-GPLv2.txt`, atıf: `README.md` |
| Boeing 737 3B modeli (`b737.glb`) | **GPLv2** | Aynı kaynak | Aynı |
| Hangar uçağı ve boss | Kendi kodumuz (procedural) | `games/hangar/` | Lisans sorunu yok |
| Müzik ve sesler | Kendi kodumuz (WebAudio ile üretiliyor) | `games/ortak/ortak.js` | Lisans sorunu yok |

## GPLv2 yükümlülüğü (web sürümü)
Model dosyaları değiştirilmiş biçimde (format dönüşümü) dağıtılıyor. GPLv2 gereği lisans metni modelle birlikte yayınlanıyor ve kaynak (orijinal model deposu) atıfta belirtiliyor. Matprosu'da: `oyunlar/modeller/models/LICENSE-GPLv2.txt` ve `README.md`.

## Mağaza paketi öncesi CC0 değiştirme listesi
App Store / Google Play paketi kapalı kaynak olacağından GPLv2 modeller pakete **alınmamalı**. Seçenekler:

| Öncelik | Seçenek | Lisans | Not |
|---|---|---|---|
| 1 | **Hangar'daki kendi procedural uçağımız** | Kendi kodumuz | Lisans sorunu sıfır; çocuğun kendi tasarımı oyunda uçar. Cevap Halkaları'nda PA-28 yerine bu kullanılabilir. |
| 2 | OpenGameArt "Low poly biplane airplane model" (mujtaba-io, 2024) | CC0 [D: sayfa etiketi] | https://opengameart.org/node/168011 |
| 3 | OpenGameArt "An-2 Airplane Lowpoly" (Mehozavr, 2024) | CC0 [D: sayfa etiketi] | https://opengameart.org/content/an-2-airplane-lowpoly; FBX → GLB dönüşümü gerekir |
| 4 | OpenGameArt "Low poly cartoon plane" (alpaqagames, 2014) | CC0 [D: sayfa etiketi] | https://opengameart.org/content/low-poly-cartoon-plane |
| 5 | OpenGameArt "Toy airplane lowpoly" | CC0 [D: sayfa etiketi] | https://opengameart.org/content/toy-airplane-lowpoly |
| – | Kenney / Quaternius paketleri | CC0 [D: üretici politikası] | Uçak içeren paket varlığı tek tek doğrulanmadı [?] |

Yolcu jeti (B737, koşu oyunundaki park eden uçaklar) için CC0 karşılık doğrulanmadı [?]. En güvenli yol: procedural jet (hangar motoruyla jet gövdesi) ya da sahneden çıkarmak.
Her CC0 dosya indirilirken lisans etiketi sayfanın ekran görüntüsüyle `docs/lisans-kanit/` altına kaydedilmeli.
