# Ödev → Oyun akışı (otomatik)

Amaç: Veli hiç soru yazmadan, ödev fotoğrafı/PDF'i ya da öğretmenin Classroom materyali oyuna dönüşsün.

## Girdiler
1. **Drive klasörü** "Ege Ödev → Oyun (fotoğraf/PDF yükle)" (id `1PBVjvJEo5bDvH9FZPbkDvLoy-TIBTaiY`, veli hesabı). Veli telefondan fotoğraf/PDF atar.
2. **Classroom** (okul hesabı, Chrome'da `u/1`): sınıf çalışmaları sayfasındaki yeni PDF materyalleri. Yalnızca masaüstü uygulaması açıkken ve Chrome erişilebilirken işlenir.
3. **Not girişi:** veli sohbette "Fen 85" gibi bir satır ya da sınav kâğıdı fotoğrafı gönderir → Pano'daki sınav kaydına `puan` alanı olarak işlenir (bkz. "Notlar").

## İşlenen kayıt
`data/islenen.json`: `{ "drive": {fileId: setId}, "classroom": {fileId: setId} }`. Aynı dosya iki kez işlenmez.

## Bir dosyayı işleme adımları
1. Dosyayı oku (PDF metni; metin yoksa sayfa görüntüsü). Ders ve konuyu belirle; kazanım kodlarını `scripts/kaynak/v2/kazanim.py`'den seç.
2. `scripts/kaynak/v2/set_<tarih>-<ders>-<kısa>.py` yaz (örnek: `set_sos_mebi1.py`). Üç tür soru:
   - **odev:** ödevin kendi soruları (açık uçlular 4 şıklıya çevrilir); en az 6.
   - **benzer:** aynı kazanımda farklı bağlam; en az 3.
   - **hazirlik:** müfredatta sıradaki konu (kazanım sırası `sira`); en az 2.
   Her soru: 4 şık, tipik hatadan çeldirici + yanılgı etiketi, kısa çocuk dilinde açıklama, cevabı vermeyen ipucu, sayısal cevaplarda `acik`. Soru, resim olmadan cevaplanabilir olmalı (gerekirse hikâye/veri soru köküne yazılır).
3. **Gizlilik:** okul adı, öğretmen adı, öğrenci adı/numarası, sınıf-şube, not hiçbir alana yazılmaz. `kaynak` alanı genel ifade: "Fen MEBİ çalışma kâğıdı (öğretmen PDF'i)".
4. **Bağımsız doğrulama:** ayrı bir doğrulama ajanı her soruyu kendisi çözer; rapor `docs/dogrulama/rapor-<tarih>-<set>.json`. Kritik hata varsa set yayınlanmaz; orta/düşük öneriler uygulanır.
5. `python3 scripts/kaynak/banka.py && node scripts/build.mjs` → Playwright 390×844 duman testi (konsol hatası yok).
6. Commit + push (repo private olmalı; değilse push edilmez). Kişisel sürüm yeniden yayınlanır (Pano `/oyun` ya da artifact). Genel sürüm (Matprosu) ödev setlerini zaten içermez.
7. İndirilen geçici dosyalar silinir (Mac'te İndirilenler dahil).

## Notlar (sınav sonuçları)
- Kaynak: veli mesajı. e-Okul kullanılmaz.
- Pano `state.exams[i].puan` (0–100) ve `puanGiris` (tarih). Ingest ucu (`/api/ingest`, `INGEST_TOKEN`) ek alanları birleştirir.
- Veli raporu: sınav öncesi 14 günde ilgili dersin kazanım başarı oranı ↔ sınav puanı (önce/sonra).

## Sıklık
Günlük, 18:40 (İstanbul). Yeni dosya yoksa hiçbir şey yapılmaz ve bildirim gönderilmez.
