# Soru şeması v2 yardımcıları
def S(t, k, q, dogru, yanlislar, e, ip, zor=2, tur="banka", kaynak=None, acik=None):
    """dogru: doğru şık metni; yanlislar: [(şık, kavram yanılgısı), ...] (3 adet -> 4 şık)"""
    o = [dogru] + [y[0] for y in yanlislar]
    yan = {str(i + 1): y[1] for i, y in enumerate(yanlislar)}
    d = {"t": t, "k": k, "q": q, "o": o, "a": 0, "yan": yan, "e": e, "ip": ip, "zor": zor, "tur": tur}
    if kaynak: d["kaynak"] = kaynak
    if acik is not None: d["acik"] = acik  # açık uçlu kabul edilen cevap (sayı/metin)
    return d
