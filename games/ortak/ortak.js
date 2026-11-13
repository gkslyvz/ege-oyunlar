// ===== EGE OYUNLAR ORTAK MOTORU =====
// Soru seçimi (tekrarsız + aralıklı tekrar), matematik soru üreticileri, ortak ilerleme, müzik ve ses.
// Tüm oyunlar aynı tarayıcıda aynı kaydı paylaşır (localStorage 'egeOrtak.v1').
(function(){
const KEY='egeOrtak.v1';
const today=()=>new Intl.DateTimeFormat('en-CA',{timeZone:'Europe/Istanbul'}).format(new Date());
const dayNum=d=>Math.round(Date.parse(d+'T00:00:00Z')/864e5);
function load(){try{const x=JSON.parse(localStorage.getItem(KEY));if(x&&x.v===1)return x}catch(e){}return{v:1,q:{},son:[],xp:0,seri:{gun:null,say:0},gorev:{gun:null,yapilan:0,hedef:15,odul:false},sessiz:false,toplamDogru:0}}
let S=load();
const save=()=>{try{localStorage.setItem(KEY,JSON.stringify(S))}catch(e){}};
const R=(a,b)=>a+Math.floor(Math.random()*(b-a+1));
const pick=a=>a[Math.floor(Math.random()*a.length)];
const shuffle=a=>{a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a};
const fmt=n=>n.toLocaleString('tr-TR');

// ---------- Matematik üreticileri (her seferinde yeni sayılar) ----------
function opts(correct,wrongs,n=4){
  const set=[String(correct)];
  for(const w of shuffle(wrongs)){const s=String(w);if(!set.includes(s)&&set.length<n)set.push(s)}
  return set; // doğru cevap 0. indekste; oyun seçenekleri karıştırır
}
const GEN={
  aciTuru(){const a=pick([R(10,85),90,R(95,175),180]);const t=a<90?'Dar açı':a===90?'Dik açı':a<180?'Geniş açı':'Doğru açı';
    return{t:'Açılar',q:`Ölçüsü ${a}° olan açı hangisidir?`,o:opts(t,['Dar açı','Dik açı','Geniş açı','Doğru açı']),a:0,e:'Dar < 90° · Dik = 90° · Geniş 90°–180° · Doğru = 180°'}},
  ucgenAci(){const x=R(25,80),y=R(25,170-x-10),z=180-x-y;
    return{t:'Üçgenler',q:`Bir üçgenin iki açısı ${x}° ve ${y}°. Üçüncü açı kaç derecedir?`,o:opts(z+'°',[z+10,z-10,360-x-y,x+y].filter(v=>v>0).map(v=>v+'°')),a:0,e:`Üçgende iç açılar toplamı 180°: 180 − ${x} − ${y} = ${z}°`}},
  dortgenAci(){const a=R(60,120),b=R(60,120),c=R(60,120),d=360-a-b-c;if(d<=20||d>=180)return GEN.dortgenAci();
    return{t:'Dörtgenler',q:`Bir dörtgenin üç açısı ${a}°, ${b}° ve ${c}°. Dördüncü açı kaç derecedir?`,o:opts(d+'°',[d+10,d-10,180-a-b+c,d+20].filter(v=>v>0).map(v=>v+'°')),a:0,e:`Dörtgende iç açılar toplamı 360°: 360 − ${a} − ${b} − ${c} = ${d}°`}},
  cevre(){const a=R(3,15),b=R(2,12);if(a===b)return GEN.cevre();const c=2*(a+b);
    return{t:'Çevre',q:`Kenarları ${a} cm ve ${b} cm olan dikdörtgenin çevresi kaç cm'dir?`,o:opts(c,[a*b,a+b,c+2,c-2]),a:0,e:`Çevre = 2 × (${a} + ${b}) = ${c} cm`}},
  alan(){const a=R(3,15),b=R(2,12);if(a===b)return GEN.alan();const s=a*b;
    return{t:'Alan',q:`Kenarları ${a} cm ve ${b} cm olan dikdörtgenin alanı kaç cm²'dir?`,o:opts(s,[2*(a+b),a+b,s+a,s-b]),a:0,e:`Alan = ${a} × ${b} = ${s} cm²`}},
  basamak(){const n=R(1000000,9999999);const s=String(n);const i=R(0,5);const d=+s[i];if(d===0)return GEN.basamak();
    const names=['milyonlar','yüz binler','on binler','binler','yüzler','onlar'];const val=d*10**(6-i);
    return{t:'Basamak değeri',q:`${fmt(n)} sayısında ${names[i]} basamağındaki ${d} rakamının basamak değeri nedir?`,o:opts(fmt(val),[fmt(val*10),fmt(val/10),String(d),fmt(d*10**(5-i))].filter(v=>v!=='0')),a:0,e:`${d} × ${fmt(10**(6-i))} = ${fmt(val)}`}},
  yuvarla(){const n=R(10000,99999);const r=Math.round(n/1000)*1000;
    return{t:'Yuvarlama',q:`${fmt(n)} sayısı en yakın bine yuvarlanırsa kaç olur?`,o:opts(fmt(r),[fmt(r+1000),fmt(r-1000),fmt(Math.round(n/100)*100),fmt(Math.floor(n/10000)*10000)]),a:0,e:`Yüzler basamağına bakılır: ${String(n).slice(-3,-2)} ${+String(n).slice(-3,-2)>=5?'≥ 5 → yukarı':'< 5 → aşağı'} yuvarlanır.`}},
  oncelik(){const a=R(2,20),b=R(2,9),c=R(2,9);const r=a+b*c;
    return{t:'İşlem önceliği',q:`${a} + ${b} × ${c} = ?`,o:opts(r,[(a+b)*c,a*b+c,r+1,r-1]),a:0,e:`Önce çarpma: ${b} × ${c} = ${b*c}, sonra ${a} + ${b*c} = ${r}`}},
  kesirSayi(){const p=pick([2,3,4,5,6,8,10]);const k=R(1,p-1);const t=p*R(2,9);const r=t/p*k;
    return{t:'Kesirler',q:`${t} sayısının ${k}/${p} kadarı kaçtır?`,o:opts(r,[t/p,r+t/p,t-r,k*p,r+1,r*2,r+k+1]),a:0,e:`${t} ÷ ${p} = ${t/p}, × ${k} = ${r}`}},
  carpma(){const a=R(12,99),b=R(3,9);const r=a*b;
    return{t:'Çarpma',q:`${a} × ${b} = ?`,o:opts(r,[r+b,r-a,r+10,a*(b+1)]),a:0,e:`${a} × ${b} = ${r}`}},
  bolme(){const b=R(3,9),q=R(12,99);const a=b*q;
    return{t:'Bölme',q:`${a} ÷ ${b} = ?`,o:opts(q,[q+1,q-1,q+10,b*2]),a:0,e:`${q} × ${b} = ${a}, yani ${a} ÷ ${b} = ${q}`}},
  ucgenKenar(){const t=pick(['e','i','c']);let s;
    if(t==='e'){const x=R(3,12);s=[x,x,x]}else if(t==='i'){const x=R(3,12);let y=R(2,12);if(y===x)y++;if(y>=2*x)y=x+1;s=[x,x,y]}else{const x=R(3,8);s=[x,x+R(1,3),x+R(4,6)];if(s[2]>=s[0]+s[1])return GEN.ucgenKenar()}
    const n={e:'Eşkenar',i:'İkizkenar',c:'Çeşitkenar'}[t];
    return{t:'Üçgenler',q:`Kenarları ${shuffle(s).join(' cm, ')} cm olan üçgen hangisidir?`,o:opts(n,['Eşkenar','İkizkenar','Çeşitkenar']),a:0,e:'Eşkenar: 3 kenar eşit · İkizkenar: 2 kenar eşit · Çeşitkenar: hepsi farklı'}},
  cokgen(){const c=pick([[3,'Üçgen'],[4,'Dörtgen'],[5,'Beşgen'],[6,'Altıgen'],[8,'Sekizgen']]);
    return{t:'Çokgenler',q:`${c[1]}in kaç kenarı vardır?`,o:opts(c[0],[c[0]+1,c[0]-1,c[0]+2]),a:0,e:`${c[1]}: ${c[0]} kenar, ${c[0]} köşe.`}},
};
const GEN_KEYS=Object.keys(GEN);
function uret(){const k=pick(GEN_KEYS);const q=GEN[k]();q.id='gen:'+k;q.gen=true;return q}

// ---------- Soru seçimi ----------
const ARALIK=[0,1,3,7,21]; // Leitner kutuları (gün)
const hash=t=>{let h=5381;for(let i=0;i<t.length;i++)h=(h*33^t.charCodeAt(i))>>>0;return h.toString(36)};
function bank(legId){const L=(window.LEGS||[]).find(l=>l.id===legId);if(!L)return[];return L.qs.map(q=>({...q,id:q.id||legId+':'+hash(q.q)}))}
function oncelik(q,now){
  const st=S.q[q.id];const recent=S.son.indexOf(q.id); // son görülenler listesinde ne kadar yakın
  if(!st)return 50+Math.random()*10;                  // hiç görülmemiş
  const due=dayNum(st.son)+ARALIK[Math.min(st.kutu,4)]<=now;
  let p=due?(st.kutu===0?80:40):5;                     // vakti gelmiş yanlışlar en önde
  if(recent>=0&&recent<40)p-=60-recent;               // yakın zamanda sorulanı geriye at
  return p+Math.random()*5;
}
function sec(legId,n=10,maxOpt=4){
  const now=dayNum(today());
  let pool=bank(legId).map(q=>({q,p:oncelik(q,now)})).sort((a,b)=>b.p-a.p).map(x=>x.q);
  const L=(window.LEGS||[]).find(l=>l.id===legId);
  let out=pool.slice(0,n);
  if(L&&L.gen){const g=Math.round(n*0.4);out=out.slice(0,n-g);for(let i=0;i<g;i++)out.push(uret())}
  return shuffle(out).map(q=>kirp(q,maxOpt));
}
function kirp(q,max){ // seçenek sayısını azaltır, doğru cevabı korur
  if(q.o.length<=max)return q;
  const wrong=shuffle(q.o.map((t,i)=>i).filter(i=>i!==q.a)).slice(0,max-1);
  const keep=shuffle([q.a,...wrong]);
  return{...q,o:keep.map(i=>q.o[i]),a:keep.indexOf(q.a)};
}
function kaydet(q,dogru,ilkDeneme=true){
  if(!q.gen){
    const st=S.q[q.id]||(S.q[q.id]={kutu:0,son:today(),d:0,y:0});
    st.son=today();if(dogru){st.d++;if(ilkDeneme)st.kutu=Math.min(4,st.kutu+1)}else{st.y++;st.kutu=0}
    S.son=[q.id,...S.son.filter(x=>x!==q.id)].slice(0,120);
  }
  if(dogru){S.toplamDogru++;gorevSay()}
  save();
}

// ---------- İlerleme ----------
const RUTBE=['Çırak Pilot','Yardımcı Pilot','Kaptan','Filo Komutanı','As Pilot','Gökyüzü Efsanesi'];
const seviye=()=>1+Math.floor(S.xp/150);
function xp(n){const once=seviye();S.xp+=Math.max(0,Math.round(n));seriGuncelle();save();return seviye()>once}
function seriGuncelle(){const t=today();if(S.seri.gun===t)return;const d=S.seri.gun?dayNum(t)-dayNum(S.seri.gun):99;S.seri.say=d===1?S.seri.say+1:1;S.seri.gun=t}
function gorevSay(){const t=today();if(S.gorev.gun!==t)S.gorev={gun:t,yapilan:0,hedef:15,odul:false};S.gorev.yapilan++;
  if(!S.gorev.odul&&S.gorev.yapilan>=S.gorev.hedef){S.gorev.odul=true;S.xp+=100;Ortak.olay&&Ortak.olay('gorev')}}
function durum(){const t=today();const g=S.gorev.gun===t?S.gorev:{yapilan:0,hedef:15,odul:false};
  const l=seviye();return{xp:S.xp,seviye:l,rutbe:RUTBE[Math.min(l-1,RUTBE.length-1)],ilerleme:(S.xp%150)/150,seri:S.seri.gun&&dayNum(t)-dayNum(S.seri.gun)<=1?S.seri.say:0,gorev:g,toplamDogru:S.toplamDogru}}
function ozetHTML(){const d=durum();return `<div style="display:flex;gap:8px;flex-wrap:wrap;justify-content:center;font-weight:700;font-size:14px">
  <span style="background:#10223f;color:#ffc23d;border-radius:99px;padding:4px 10px">Sv ${d.seviye} · ${d.rutbe}</span>
  <span style="background:#ff7a3d;color:#fff;border-radius:99px;padding:4px 10px">🔥 ${d.seri} gün seri</span>
  <span style="background:${d.gorev.odul?'#1fa35b':'#3b82f6'};color:#fff;border-radius:99px;padding:4px 10px">🎯 Günlük görev ${Math.min(d.gorev.yapilan,d.gorev.hedef)}/${d.gorev.hedef}${d.gorev.odul?' ✓':''}</span></div>`}

// ---------- Ses ve müzik (WebAudio, dosya yok) ----------
let ctx=null,master=null,muzikT=null;
function ac(){try{if(!ctx){ctx=new(window.AudioContext||window.webkitAudioContext)();master=ctx.createGain();master.gain.value=S.sessiz?0:1;master.connect(ctx.destination)}if(ctx.state==='suspended')ctx.resume()}catch(e){}return ctx}
function nota(f,t,d,tip='square',v=.08){if(!ctx)return;const o=ctx.createOscillator(),g=ctx.createGain();o.type=tip;o.frequency.value=f;g.gain.setValueAtTime(v,t);g.gain.exponentialRampToValueAtTime(.0008,t+d);o.connect(g).connect(master);o.start(t);o.stop(t+d+.02)}
function davul(t,tip){if(!ctx)return;const len=tip==='k'?.18:.06;const b=ctx.createBuffer(1,ctx.sampleRate*len,ctx.sampleRate);const d=b.getChannelData(0);
  for(let i=0;i<d.length;i++)d[i]=(tip==='k'?Math.sin(i/ctx.sampleRate*2*Math.PI*(120-i/d.length*80)):Math.random()*2-1)*(1-i/d.length);
  const s=ctx.createBufferSource(),g=ctx.createGain();s.buffer=b;g.gain.value=tip==='k'?.35:.06;s.connect(g).connect(master);s.start(t)}
const hz=m=>440*2**((m-69)/12);
const TEMALAR={ // akor kökleri ve melodi dizisi (pentatonik), tempo
  gok:{bpm:112,kok:[60,57,65,67],mel:[0,2,4,7,9,12]},
  kosu:{bpm:140,kok:[57,53,55,52],mel:[0,3,5,7,10,12]},
  uzay:{bpm:96,kok:[62,58,60,57],mel:[0,2,3,7,9,12]},
};
function muzik(tema='gok'){ac();if(!ctx)return;muzikDur();const T=TEMALAR[tema]||TEMALAR.gok;const adim=60/T.bpm/2;let n=0;let t0=ctx.currentTime+.1;
  let seed=1;const rnd=()=>(seed=(seed*16807)%2147483647)/2147483647; // tekrar eden ama akılda kalan melodi
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
  altin(){ac();const t=ctx&&ctx.currentTime;nota(1319,t,.06,'square',.05);nota(1760,t+.05,.1,'square',.05)},
  zafer(){ac();const t=ctx&&ctx.currentTime;[523,659,784,1047,784,1047,1319].forEach((f,i)=>nota(f,t+i*.11,.2,'square',.07))},
  zipla(){ac();const t=ctx&&ctx.currentTime;if(!ctx)return;const o=ctx.createOscillator(),g=ctx.createGain();o.frequency.setValueAtTime(300,t);o.frequency.exponentialRampToValueAtTime(700,t+.15);g.gain.setValueAtTime(.06,t);g.gain.exponentialRampToValueAtTime(.001,t+.18);o.connect(g).connect(master);o.start(t);o.stop(t+.2)},
};
function sessiz(v){if(v===undefined)return S.sessiz;S.sessiz=v;save();if(master)master.gain.value=v?0:1}

window.Ortak={sec,kirp,kaydet,uret,xp,durum,ozetHTML,muzik,muzikDur,SES,sessiz,ac,bugun:today,olay:null};
})();
