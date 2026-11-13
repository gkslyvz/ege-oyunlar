-- Ege Oyunlar ilerleme deposu — Matematop Supabase projesinde AYRI şema.
-- İsim / kişisel veri YOK: yalnız rastgele profil kimliği (uuid) + oyun ilerleme JSON'u.
-- Tablolar dışarıya açık DEĞİL (RLS açık, politika yok). Erişim yalnız aşağıdaki SECURITY DEFINER fonksiyonlarla,
-- ve fonksiyonlar profil uuid'sini bilen istemciye çalışır (uuid = gizli anahtar).

create schema if not exists oyun;
revoke all on schema oyun from public, anon, authenticated;

create table if not exists oyun.ilerleme (
  profil uuid primary key,
  veri   jsonb not null default '{}'::jsonb,
  guncel timestamptz not null default now()
);
create table if not exists oyun.anlik (          -- günlük anlık görüntü: haftalık rapor ve önce/sonra karşılaştırma
  profil uuid not null,
  gun    date not null,
  veri   jsonb not null,
  primary key (profil, gun)
);
alter table oyun.ilerleme enable row level security;
alter table oyun.anlik    enable row level security;
revoke all on all tables in schema oyun from public, anon, authenticated;

-- Yazma: tam durum JSON'u (kaz, yan, gunluk, usta, xp...). 300 KB sınırı; isim alanı reddedilir.
create or replace function api.oyun_kaydet(p_profil uuid, p_veri jsonb)
returns timestamptz language plpgsql security definer set search_path = '' as $$
declare t timestamptz := now();
begin
  if p_profil is null then raise exception 'profil gerekli'; end if;
  if pg_column_size(p_veri) > 300000 then raise exception 'veri çok büyük'; end if;
  if p_veri ?| array['ad','isim','name','okul','sinif','email'] then raise exception 'kişisel alan kabul edilmez'; end if;
  insert into oyun.ilerleme(profil, veri, guncel) values (p_profil, p_veri, t)
    on conflict (profil) do update set veri = excluded.veri, guncel = t;
  insert into oyun.anlik(profil, gun, veri) values (p_profil, (t at time zone 'Europe/Istanbul')::date, p_veri)
    on conflict (profil, gun) do update set veri = excluded.veri;
  return t;
end $$;

-- Okuma: son durum
create or replace function api.oyun_oku(p_profil uuid)
returns jsonb language sql security definer set search_path = '' stable as $$
  select jsonb_build_object('veri', veri, 'guncel', guncel) from oyun.ilerleme where profil = p_profil
$$;

-- Rapor: son N günün anlık görüntüleri (en fazla 120)
create or replace function api.oyun_gecmis(p_profil uuid, p_gun int default 14)
returns table(gun date, veri jsonb) language sql security definer set search_path = '' stable as $$
  select gun, veri from oyun.anlik
  where profil = p_profil and gun >= (now() at time zone 'Europe/Istanbul')::date - least(greatest(p_gun,1),120)
  order by gun
$$;

revoke all on function api.oyun_kaydet(uuid, jsonb), api.oyun_oku(uuid), api.oyun_gecmis(uuid, int) from public;
grant execute on function api.oyun_kaydet(uuid, jsonb), api.oyun_oku(uuid), api.oyun_gecmis(uuid, int) to anon, authenticated;
notify pgrst, 'reload schema';
