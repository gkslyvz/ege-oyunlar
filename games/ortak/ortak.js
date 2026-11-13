// ===== EGE OYUNLAR ORTAK MOTORU v2 =====
// Soru seçimi (tekrarsız + aralıklı tekrar + kazanıma göre uyarlanan zorluk), matematik üreticileri,
// ipucu → açıklama geri bildirimi, kavram yanılgısı kaydı, ortak ilerleme ve ustalık, süre sınırı, müzik/ses.
// Kayıt: localStorage 'egewindow.Ortak.v1' (Bulut eşitleme varsa window.Ortak.bulut ile aynı veri yukarı/aşağı taşınır).
(function(){
const KEY='egewindow.Ortak.v1';
const today=()=>new Intl.DateTimeFormat('en-CA',{timeZone:'Europe/Istanbul'}).format(new Date());
const dayNum=d=>Math.round(Date.parse(d+'T00:00:00Z')/864e5);
const bos=()=>({v:1,q:{},son:[],xp:0,seri:{gun:null,say:0},gorev:{gun:null,yapilan:0,hedef:15,odul:false},sessiz:false,toplamDogru:0,kaz:{},yan:{},gunluk:{},usta:[],baslangic:null,guncel:Date.now()});
function load(){try{const x=JSON.parse(localStorage.getItem(KEY));if(x&&x.v===1)return Object.assign(bos(),x)}catch(e){}return bos()}
let S=load();
const save=()=>{S.guncel=Date.now();try{localStorage.setItem(KEY,JSON.stringify(S))}catch(e){}window.Ortak.bulut&&window.Ortak.bulut.yaz&&window.Ortak.bulut.yaz(S)};
const R=(a,b)=>a+Math.floor(Math.random()*(b-a+1));
const pick=a=>a[Math.floor(Math.random()*a.length)];
const shuffle=a=>{a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a};
const fmt=n=>n.toLocaleString('tr-TR');

// ---------- Matematik üreticileri (her seferinde yeni sayılar, 4 şık, yanılgı etiketli) ----------
function Q(t,k,q,dogru,yanlis,e,ip,acik){
  const o=[String(dogru)],yan={};
  for(const [v,y] of yanlis){const s=String(v);if(o.length<4&&!o.includes(s)&&!/NaN|undefined|^-/.test(s)){yan[o.length]=y;o.push(s)}}
  let n=1;while(o.length<4){const s=String(+String(dogru).replace(/\D/g,'')+n++);if(!o.includes(s)){yan[o.length]='Tahminle seçme';o.push(s)}}
  return{t,k,q,o,a:0,yan,e,ip,acik:acik===undefined?null:String(acik),zor:2}}
const GEN={
  aciTuru(){const a=pick([R(10,85),90,R(95,175),180]);const t=a<90?'Dar açı':a===90?'Dik açı':a<180?'Geniş açı':'Doğru açı';
    const Y={'Dar açı':'Açı türlerinin sınırlarını karıştırma','Dik açı':'90° sınırını yanlış uygulama','Geniş açı':'Açı türlerinin sınırlarını karıştırma','Doğru açı':'180° ile 90°\'yi karıştırma'};
    return Q('Açılar','MAT.5.3.3',`Ölçüsü ${a}° olan açı hangisidir?`,t,['Dar açı','Dik açı','Geniş açı','Doğru açı'].filter(x=>x!==t).map(x=>[x,Y[x]]),'Dar < 90° · Dik = 90° · Geniş 90°–180° · Doğru = 180°',`${a}, 90'dan küçük mü, büyük mü?`)},
  cevre(){const a=R(3,15),b=R(2,12);if(a===b)return GEN.cevre();const c=2*(a+b);
    return Q('Çevre','MAT.5.4.4',`Kenarları ${a} cm ve ${b} cm olan dikdörtgenin çevresi kaç cm'dir?`,c,[[a*b,'Çevre yerine alan hesaplama'],[a+b,'Yalnızca iki kenarı toplama'],[c+2,'İşlem hatası']],`Çevre = 2 × (${a} + ${b}) = ${c} cm`,'Dört kenarın hepsini topla.',c)},
  alan(){const a=R(3,15),b=R(2,12);if(a===b)return GEN.alan();const s=a*b;
    return Q('Alan','MAT.5.4.2',`Kenarları ${a} cm ve ${b} cm olan dikdörtgenin alanı kaç cm²'dir?`,s,[[2*(a+b),'Alan yerine çevre hesaplama'],[a+b,'Kenarları toplama'],[s+a,'Çarpma hatası']],`Alan = ${a} × ${b} = ${s} cm²`,'Kaç birim kare sığar? Uzun kenar × kısa kenar.',s)},
  cevredenKenar(){const a=R(4,15),b=R(2,a-1);const c=2*(a+b);
    return Q('Çevre','MAT.5.4.1',`Çevresi ${c} cm olan bir dikdörtgenin uzun kenarı ${a} cm ise kısa kenarı kaç cm'dir?`,b,[[c-a,'Çevreden yalnızca bir kenarı çıkarma'],[c/2,'Yarı çevreyi kenar sanma'],[c-2*a,'İkiye bölmeyi unutma']],`Yarı çevre ${c/2} cm; ${c/2} − ${a} = ${b} cm`,'Önce çevreyi ikiye böl.',b)},
  basamak(){const n=R(1000000,9999999);const s=String(n);const i=R(0,5);const d=+s[i];if(d===0)return GEN.basamak();
    const names=['milyonlar','yüz binler','on binler','binler','yüzler','onlar'];const val=d*10**(6-i);
    return Q('Basamak değeri','MAT.5.1.1',`${fmt(n)} sayısında ${names[i]} basamağındaki ${d} rakamının basamak değeri nedir?`,fmt(val),[[fmt(val*10),'Basamakları bir fazla sayma'],[fmt(val/10),'Basamakları bir eksik sayma'],[String(d),'Basamak değeri yerine sayı değerini söyleme']],`${d} × ${fmt(10**(6-i))} = ${fmt(val)}`,'Sağdan say: birler, onlar, yüzler…',val)},
  yuvarla(){const n=R(10000,99999);const r=Math.round(n/1000)*1000;const h=+String(n).slice(-3,-2);
    return Q('Yuvarlama','MAT.5.1.1',`${fmt(n)} sayısı en yakın bine yuvarlanırsa kaç olur?`,fmt(r),[[fmt(h>=5?r-1000:r+1000),'Yuvarlama yönünü ters uygulama'],[fmt(Math.round(n/100)*100),'Yüzlüğe yuvarlama'],[fmt(Math.floor(n/10000)*10000),'On bine yuvarlama']],`Yüzler basamağı ${h}: ${h>=5?'5 ve üstü → yukarı':'5\'ten küçük → aşağı'} yuvarlanır.`,'Yüzler basamağına bak.',r)},
  oncelik(){const a=R(2,20),b=R(2,9),c=R(2,9);const r=a+b*c;
    return Q('İşlem önceliği','MAT.5.2.2',`${a} + ${b} × ${c} = ?`,r,[[(a+b)*c,'Soldan sağa işlem yapma (önceliği bilmeme)'],[a*b+c,'İşlemlerin yerini karıştırma'],[r+1,'İşlem hatası']],`Önce çarpma: ${b} × ${c} = ${b*c}, sonra ${a} + ${b*c} = ${r}`,'Çarpma, toplamadan önce yapılır.',r)},
  kesirSayi(){const p=pick([2,3,4,5,6,8,10]);const k=R(1,p-1);const t=p*R(2,9);const r=t/p*k;
    return Q('Kesirler','MAT.5.1.3',`${t} sayısının ${k}/${p} kadarı kaçtır?`,r,[[t/p,'Yalnızca bir parçayı bulup payla çarpmayı unutma'],[t-r,'Kalan kısmı bulma'],[t*k,'Paydaya bölmeyi unutma'],[r+1,'İşlem hatası']],`${t} ÷ ${p} = ${t/p}, × ${k} = ${r}`,'Önce bütünü paydaya böl.',r)},
  kesirKarsilastir(){const p=pick([4,6,8,10,12]);let a=R(1,p-1),b=R(1,p-1);if(a===b)return GEN.kesirKarsilastir();const big=Math.max(a,b),sm=Math.min(a,b);
    return Q('Kesirler','MAT.5.1.4',`Paydaları eşit olan ${a}/${p} ve ${b}/${p} kesirlerinden hangisi büyüktür?`,`${big}/${p}`,[[`${sm}/${p}`,'Payı küçük olanı büyük sanma'],['İkisi eşit','Paydalar eşitse kesirleri eşit sanma'],[`${big}/${p*2}`,'Paydayı değiştirmenin etkisini bilmeme']],`Paydalar eşitse payı büyük olan kesir büyüktür.`,'Pastadan kaç dilim alıyorsun?')},
  carpma(){const a=R(12,99),b=R(3,9);const r=a*b;
    return Q('Çarpma','MAT.5.1.2',`${a} × ${b} = ?`,r,[[r+b,'Fazladan bir çarpan ekleme'],[r-a,'Bir eksik çarpma'],[a+b,'Çarpma yerine toplama']],`${a} × ${b} = ${r}`,`${a} sayısını ${b} kez topla.`,r)},
  bolme(){const b=R(3,9),q=R(12,99);const a=b*q;
    return Q('Bölme','MAT.5.1.2',`${a} ÷ ${b} = ?`,q,[[q+1,'Bölme hatası'],[q-1,'Bölme hatası'],[a-b,'Bölme yerine çıkarma']],`${q} × ${b} = ${a}, yani ${a} ÷ ${b} = ${q}`,`Hangi sayıyı ${b} ile çarparsan ${a} eder?`,q)},
  problem(){const ad=pick(['Ali','Zeynep','Can','Elif','Mert']);const kutu=R(3,9),adet=R(12,48),ver=R(5,30);const top=kutu*adet;if(ver>=top)return GEN.problem();const r=top-ver;
    return Q('Problem','MAT.5.1.2',`${ad}'in ${kutu} kutusu var; her kutuda ${adet} kalem var. ${ver} kalemi arkadaşlarına verirse kaç kalemi kalır?`,r,[[top,'Son adımı (vermeyi) unutma'],[kutu+adet-ver,'Çarpma yerine toplama'],[top+ver,'Çıkarma yerine toplama']],`${kutu} × ${adet} = ${top}; ${top} − ${ver} = ${r}`,'Önce toplam kalemi bul.',r)},
  oruntu(){const s=R(1,9),d=R(2,9);const seq=[0,1,2,3].map(i=>s+i*d);const r=s+4*d;
    return Q('Örüntü','MAT.5.2.3',`${seq.join(', ')}, … örüntüsünde sıradaki sayı kaçtır?`,r,[[r+d,'Bir adım atlama'],[r-1,'Artış miktarını yanlış bulma'],[seq[3]+d+1,'Artış miktarını yanlış bulma']],`Her adımda ${d} artıyor: ${seq[3]} + ${d} = ${r}`,'İki sayı arasındaki farka bak.',r)},
  ucgenKenar(){const t=pick(['e','i','c']);let s;
    if(t==='e'){const x=R(3,12);s=[x,x,x]}else if(t==='i'){const x=R(4,12);let y=R(2,x+3);if(y===x)y=x+1;s=[x,x,y]}else{const x=R(3,8);s=[x,x+R(1,2),x+R(3,4)];if(s[2]>=s[0]+s[1])return GEN.ucgenKenar()}
    const n={e:'Eşkenar',i:'İkizkenar',c:'Çeşitkenar'}[t];const Y={'Eşkenar':'İki ve üç eşit kenarı karıştırma','İkizkenar':'Eşit kenar sayısını yanlış sayma','Çeşitkenar':'Tanımı tersine okuma','Dik':'Kenara göre ile açıya göre adlandırmayı karıştırma'};
    return Q('Üçgenler','MAT.5.3.6',`Kenarları ${shuffle(s).join(' cm, ')} cm olan üçgen hangisidir?`,n,['Eşkenar','İkizkenar','Çeşitkenar','Dik'].filter(x=>x!==n).map(x=>[x,Y[x]]),'Eşkenar: 3 kenar eşit · İkizkenar: 2 kenar eşit · Çeşitkenar: hepsi farklı','Kaç kenar birbirine eşit?')},
  cokgen(){const c=pick([[3,'Üçgen'],[4,'Dörtgen'],[5,'Beşgen'],[6,'Altıgen'],[8,'Sekizgen']]);
    return Q('Çokgenler','MAT.5.3.6',`${c[1]}in kaç kenarı vardır?`,c[0],[[c[0]+1,'Komşu çokgenle karıştırma'],[c[0]-1,'Komşu çokgenle karıştırma'],[c[0]*2,'Kenar ile köşe+kenarı karıştırma']],`${c[1]}: ${c[0]} kenar, ${c[0]} köşe.`,'İsminde sayı saklı.',c[0])},
};
const GEN_KEYS=Object.keys(GEN);
const GEN_K={};GEN_KEYS.forEach(g=>{try{GEN_K[g]=GEN[g]().k}catch(e){}});
function uret(k){const keys=k?GEN_KEYS.filter(g=>GEN_K[g]===k):GEN_KEYS;const g=pick(keys.length?keys:GEN_KEYS);const q=GEN[g]();q.id='gen:'+g;q.gen=true;return q}

// ---------- Soru seçimi ----------
const ARALIK=[0,1,3,7,21]; // Leitner kutuları (gün)
const hash=t=>{let h=5381;for(let i=0;i<t.length;i++)h=(h*33^t.charCodeAt(i))>>>0;return h.toString(36)};
function leg(id){return (window.LEGS||[]).find(l=>l.id===id)}
function bank(legId){const L=leg(legId);if(!L)return[];return L.qs.map(q=>({...q,id:q.id||(q.set?'set:':legId+':')+hash(q.q)}))}
function kazOran(k){const s=S.kaz[k];if(!s||s.d+s.y<3)return null;return s.d/(s.d+s.y)}
function oncelik(q,now){
  const st=S.q[q.id];const recent=S.son.indexOf(q.id);
  let p;
  if(!st)p=50+Math.random()*10;
  else{const due=dayNum(st.son)+ARALIK[Math.min(st.kutu,4)]<=now;p=due?(st.kutu===0?80:40):5}
  if(recent>=0&&recent<40)p-=60-recent;
  // Uyarlama: zayıf kazanım öne; zayıfken kolay soru, güçlüyken zor soru
  const o=kazOran(q.k);
  if(o!==null){if(o<0.6)p+=25-(q.zor||2)*6;else if(o>0.85)p+=(q.zor||2)*4-4}
  if(q.set&&!st)p+=15; // yeni ödev soruları öne
  if(window.ROTA_ODAK&&q.k&&window.ROTA_ODAK.includes(q.k))p+=30; // rota (ör. DENEYAP) odak kazanımları
  return p+Math.random()*5;
}
// Hedef rotası (ör. DENEYAP): sınava yaklaştıkça yoğunlaşır
function rota(){const H=(window.HEDEFLER||[]).filter(h=>h.rota&&leg(h.rota)).map(h=>({...h,gun:dayNum(h.tarih)-dayNum(today())})).filter(h=>h.gun>=0).sort((a,b)=>a.gun-b.gun)[0];
  if(!H)return null;const g=H.gun;
  return{...H,gunluk:g<=14?10:g<=45?6:g<=90?4:2,pay:g<=14?0.3:g<=45?0.2:g<=90?0.1:0,evre:g<=14?'Son düzlük':g<=45?'Yoğun':g<=90?'Isınma':'Hazırlık'}}
function sec(legId,n=10,maxOpt=4){
  const now=dayNum(today());const L=leg(legId);
  let out=bank(legId).map(q=>({q,p:oncelik(q,now)})).sort((a,b)=>b.p-a.p).map(x=>x.q).slice(0,n);
  const R=rota();
  if(R&&R.pay&&legId!==R.rota&&legId!=='odev'){const m=Math.max(1,Math.round(n*R.pay));
    const ek=bank(R.rota).map(q=>({q,p:oncelik(q,now)})).sort((a,b)=>b.p-a.p).map(x=>x.q).slice(0,m);out=out.slice(0,n-ek.length).concat(ek)}
  if(L&&L.gen){const g=Math.round(n*0.4);out=out.slice(0,n-g);
    const zayif=Object.keys(S.kaz).filter(k=>k.startsWith('MAT')&&kazOran(k)!==null&&kazOran(k)<0.6);
    for(let i=0;i<g;i++)out.push(uret(zayif.length&&Math.random()<.6?pick(zayif):null))}
  return shuffle(out).map(q=>kirp(q,maxOpt));
}
function kirp(q,max){ // seçenek sayısını azaltır; doğru cevabı ve yanılgı eşleşmesini korur
  if(q.o.length<=max)return q;
  const wrong=shuffle(q.o.map((t,i)=>i).filter(i=>i!==q.a)).slice(0,max-1);
  const keep=shuffle([q.a,...wrong]);const yan={};
  keep.forEach((old,ni)=>{if(q.yan&&q.yan[old])yan[ni]=q.yan[old]});
  return{...q,o:keep.map(i=>q.o[i]),a:keep.indexOf(q.a),yan};
}
// Geri bildirim: 1. yanlış → ipucu, 2. yanlış → açıklama
function geriBildirim(q,secilen,deneme){
  const y=q.yan&&q.yan[secilen];
  if(secilen===q.a)return{tip:'dogru',metin:q.e};
  if(deneme<=1&&q.ip)return{tip:'ipucu',metin:q.ip,yanilgi:y};
  return{tip:'aciklama',metin:q.e,dogru:q.o[q.a],yanilgi:y};
}
function acikKontrol(q,giris){const n=s=>String(s).toLowerCase().replace(/[\s.]/g,'').replace(',','.');return q.acik!=null&&n(giris)===n(q.acik)}
function kaydet(q,dogru,ilkDeneme=true,secilen=null){
  const t=today();
  if(!q.gen){
    const st=S.q[q.id]||(S.q[q.id]={kutu:0,son:t,d:0,y:0});
    st.son=t;if(dogru){st.d++;if(ilkDeneme)st.kutu=Math.min(4,st.kutu+1)}else{st.y++;st.kutu=0}
    S.son=[q.id,...S.son.filter(x=>x!==q.id)].slice(0,120);
  }
  if(q.k){const k=S.kaz[q.k]||(S.kaz[q.k]={d:0,y:0,ilk:0,top:0,seri:0});
    if(ilkDeneme){k.top++;if(dogru)k.ilk++}
    if(dogru){k.d++;k.seri=ilkDeneme?k.seri+1:0}else{k.y++;k.seri=0}
    // Ustalık: aynı kazanımda üst üste 5 ilk-deneme doğrusu ve en az %80 ilk-deneme oranı
    if(!S.usta.includes(q.k)&&k.seri>=5&&k.ilk/k.top>=0.8){S.usta.push(q.k);S.xp+=80;window.Ortak.olay&&window.Ortak.olay('usta',q.k)}}
  if(!dogru&&secilen!=null&&q.yan&&q.yan[secilen]){const key=(q.k||'?')+'|'+q.yan[secilen];S.yan[key]=(S.yan[key]||0)+1}
  const g=S.gunluk[t]||(S.gunluk[t]={sn:0,soru:0,dogru:0,ilk:0});g.soru++;if(dogru)g.dogru++;if(dogru&&ilkDeneme)g.ilk++;
  if(dogru){S.toplamDogru++;gorevSay()}
  save();
}

// ---------- Süre sınırı (günlük 15 dk hedef, 20 dk üst sınır) ----------
const SURE={hedef:15*60,sinir:20*60};
let tik=null,tikSon=0;
function sureBasla(){if(tik)return;tikSon=Date.now();tik=setInterval(()=>{if(document.hidden){tikSon=Date.now();return}const t=today();const g=S.gunluk[t]||(S.gunluk[t]={sn:0,soru:0,dogru:0,ilk:0});
  const now=Date.now();g.sn+=Math.min(5,(now-tikSon)/1000);tikSon=now;if(Math.floor(g.sn)%15===0)save();
  if(g.sn>=SURE.sinir&&!window.Ortak._bitti){window.Ortak._bitti=true;save();window.Ortak.olay&&window.Ortak.olay('sure_bitti')}},1000)}
function sureDurum(){const g=S.gunluk[today()]||{sn:0};return{sn:Math.round(g.sn),hedef:SURE.hedef,sinir:SURE.sinir,kalan:Math.max(0,SURE.sinir-g.sn),bitti:g.sn>=SURE.sinir}}
function sureKapisi(){ // süre bittiyse nazik tam ekran uyarı; true dönerse oyun başlamamalı
  if(!sureDurum().bitti)return false;
  if(document.getElementById('sureKapi'))return true;
  const d=document.createElement('div');d.id='sureKapi';d.style.cssText='position:fixed;inset:0;z-index:99;display:grid;place-items:center;background:linear-gradient(180deg,#0b3d91,#3b8fe0);padding:20px';
  d.innerHTML='<div style="background:#fff;border-radius:24px;padding:22px;max-width:400px;text-align:center;font-family:inherit"><div style="font-size:56px">🛬</div><h2 style="margin:6px 0">Bugünkü uçuş tamam, kaptan!</h2><p>Bugün 20 dakika uçtun. Pilotlar da dinlenir. Yarın yeni görevler seni bekliyor! ✈️</p>'+ozetHTML()+'</div>';
  document.body.appendChild(d);muzikDur();return true}

// ---------- İlerleme ----------
const RUTBE=['Çırak Pilot','Yardımcı Pilot','Kaptan','Filo Komutanı','As Pilot','Gökyüzü Efsanesi'];
const seviye=()=>1+Math.floor(S.xp/150);
function xp(n){const once=seviye();S.xp+=Math.max(0,Math.round(n));seriGuncelle();save();return seviye()>once}
function seriGuncelle(){const t=today();if(S.seri.gun===t)return;const d=S.seri.gun?dayNum(t)-dayNum(S.seri.gun):99;S.seri.say=d===1?S.seri.say+1:1;S.seri.gun=t}
function gorevSay(){const t=today();if(S.gorev.gun!==t)S.gorev={gun:t,yapilan:0,hedef:15,odul:false};S.gorev.yapilan++;
  if(!S.gorev.odul&&S.gorev.yapilan>=S.gorev.hedef){S.gorev.odul=true;S.xp+=100;window.Ortak.olay&&window.Ortak.olay('gorev')}}
function durum(){const t=today();const g=S.gorev.gun===t?S.gorev:{yapilan:0,hedef:15,odul:false};
  const l=seviye();return{xp:S.xp,seviye:l,rutbe:RUTBE[Math.min(l-1,RUTBE.length-1)],ilerleme:(S.xp%150)/150,seri:S.seri.gun&&dayNum(t)-dayNum(S.seri.gun)<=1?S.seri.say:0,gorev:g,toplamDogru:S.toplamDogru,usta:S.usta.length,sure:sureDurum()}}
function ozetHTML(){const d=durum();const dk=Math.floor(d.sure.sn/60);return `<div style="display:flex;gap:6px;flex-wrap:wrap;justify-content:center;font-weight:700;font-size:13px;margin:6px 0">
  <span style="background:#10223f;color:#ffc23d;border-radius:99px;padding:4px 10px">Sv ${d.seviye} · ${d.rutbe}</span>
  <span style="background:#ff7a3d;color:#fff;border-radius:99px;padding:4px 10px">🔥 ${d.seri} gün</span>
  <span style="background:${d.gorev.odul?'#1fa35b':'#3b82f6'};color:#fff;border-radius:99px;padding:4px 10px">🎯 ${Math.min(d.gorev.yapilan,d.gorev.hedef)}/${d.gorev.hedef}${d.gorev.odul?' ✓':''}</span>
  <span style="background:#7c3aed;color:#fff;border-radius:99px;padding:4px 10px">🏅 ${d.usta} ustalık</span>
  <span style="background:#64748b;color:#fff;border-radius:99px;padding:4px 10px">⏱️ ${dk}/20 dk</span></div>`}

// ---------- Ses ve müzik (WebAudio, dosya yok) ----------
let ctx=null,master=null,muzikT=null;
function ac(){try{if(!ctx){ctx=new(window.AudioContext||window.webkitAudioContext)();master=ctx.createGain();master.gain.value=S.sessiz?0:1;master.connect(ctx.destination)}if(ctx.state==='suspended')ctx.resume()}catch(e){}sureBasla();return ctx}
function nota(f,t,d,tip='square',v=.08){if(!ctx)return;const o=ctx.createOscillator(),g=ctx.createGain();o.type=tip;o.frequency.value=f;g.gain.setValueAtTime(v,t);g.gain.exponentialRampToValueAtTime(.0008,t+d);o.connect(g).connect(master);o.start(t);o.stop(t+d+.02)}
function davul(t,tip){if(!ctx)return;const len=tip==='k'?.18:.06;const b=ctx.createBuffer(1,ctx.sampleRate*len,ctx.sampleRate);const d=b.getChannelData(0);
  for(let i=0;i<d.length;i++)d[i]=(tip==='k'?Math.sin(i/ctx.sampleRate*2*Math.PI*(120-i/d.length*80)):Math.random()*2-1)*(1-i/d.length);
  const s=ctx.createBufferSource(),g=ctx.createGain();s.buffer=b;g.gain.value=tip==='k'?.35:.06;s.connect(g).connect(master);s.start(t)}
const hz=m=>440*2**((m-69)/12);
const TEMALAR={gok:{bpm:112,kok:[60,57,65,67],mel:[0,2,4,7,9,12]},kosu:{bpm:140,kok:[57,53,55,52],mel:[0,3,5,7,10,12]},uzay:{bpm:96,kok:[62,58,60,57],mel:[0,2,3,7,9,12]}};
function muzik(tema='gok'){ac();if(!ctx)return;muzikDur();const T=TEMALAR[tema]||TEMALAR.gok;const adim=60/T.bpm/2;let n=0;let t0=ctx.currentTime+.1;
  let seed=1;const rnd=()=>(seed=(seed*16807)%2147483647)/2147483647;
  const melodi=Array.from({length:32},()=>rnd()<.7?T.mel[Math.floor(rnd()*T.mel.length)]:null);
  const zamanla=()=>{while(t0<ctx.currentTime+.6){const bar=Math.floor(n/8)%4,s=n%8;const kok=T.kok[bar];
      if(s%4===0)davul(t0,'k');if(s%4===2)davul(t0,'h');
      if(s%2===0)nota(hz(kok-24),t0,adim*1.8,'triangle',.12);
      const m=melodi[n%32];if(m!==null)nota(hz(kok+m+(bar%2?0:12)),t0,adim*.9,'square',.035);
      n++;t0+=adim}};
  zamanla();muzikT=setInterval(zamanla,200)}
function muzikDur(){clearInterval(muzikT);muzikT=null}
const SES={
  dogru(){ac();const t=ctx&&ctx.currentTime;[784,988,1319].forEach((f,i)=>nota(f,t+i*.07,.15,'square',.07))},
  yanlis(){ac();const t=ctx&&ctx.currentTime;nota(220,t,.25,'sawtooth',.08);nota(165,t+.12,.3,'sawtooth',.08)},
  ipucu(){ac();const t=ctx&&ctx.currentTime;nota(660,t,.12,'triangle',.07);nota(880,t+.1,.12,'triangle',.07)},
  altin(){ac();const t=ctx&&ctx.currentTime;nota(1319,t,.06,'square',.05);nota(1760,t+.05,.1,'square',.05)},
  zafer(){ac();const t=ctx&&ctx.currentTime;[523,659,784,1047,784,1047,1319].forEach((f,i)=>nota(f,t+i*.11,.2,'square',.07))},
  zipla(){ac();const t=ctx&&ctx.currentTime;if(!ctx)return;const o=ctx.createOscillator(),g=ctx.createGain();o.frequency.setValueAtTime(300,t);o.frequency.exponentialRampToValueAtTime(700,t+.15);g.gain.setValueAtTime(.06,t);g.gain.exponentialRampToValueAtTime(.001,t+.18);o.connect(g).connect(master);o.start(t);o.stop(t+.2)},
};
function sessiz(v){if(v===undefined)return S.sessiz;S.sessiz=v;save();if(master)master.gain.value=v?0:1}
function veri(){return S}
function veriYukle(x){if(x&&x.v===1&&(x.guncel||0)>(S.guncel||0)){S=Object.assign(bos(),x);try{localStorage.setItem(KEY,JSON.stringify(S))}catch(e){}return true}return false}

window.Ortak={rota,sec,kirp,kaydet,uret,xp,durum,ozetHTML,muzik,muzikDur,SES,sessiz,ac,bugun:today,olay:null,geriBildirim,acikKontrol,sureDurum,sureKapisi,veri,veriYukle,bulut:null,_bitti:false};
})();
