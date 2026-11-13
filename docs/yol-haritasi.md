# Yol haritası

## Şimdi (hazır)
- 3 oyun tek veri kaynağından derleniyor (`data/`).
- Pano → oyun köprüsü: sınav tarihleri otomatik; Sınav Boss'u sınava 0–3 gün kala açılır.

## Sonraki adımlar (etki / emek sırasıyla)
1. **GitHub Pages yayını** — repo herkese açık; Pages açılınca oyunlar sabit linkten oynanır.
2. **Pano'dan otomatik besleme** — Pano'ya oyun için salt okunur, kişisel veri içermeyen bir uç (`/api/oyun`) eklenir; oyun her açılışta güncel sınavları çeker.
3. **Fotoğraftan soru** — ödev kâğıdı fotoğrafı → Claude soru setine çevirir → `data/sorular.json`.
4. **Gerçek 3D modeller** — Blender + Blender MCP ile Hürjet/KAAN gibi low-poly uçak modelleri (GLB) → Cevap Halkaları'nda seçilebilir uçak.
5. **Three.js oyun skill'leri** — `majidmanzarpour/threejs-game-skills` (oyun yönetmeni, grafik, QA) Claude Code'a kurulur.

## Araştırma notları (Kasım 2026)
- Tarayıcı + Three.js, Claude ile en verimli 3D yol (fly.pieter.com örneği; Simon Willison deneyimi).
- Unity MCP (AI Game Developer, açık kaynak) konsol kalitesine yakın ama kurulum ve öğrenme maliyeti yüksek; şimdilik ertelendi.
- Çalışma şekli: önce oynanabilir çekirdek, sonra küçük adımlar; somut oyun testi geri bildirimi.
