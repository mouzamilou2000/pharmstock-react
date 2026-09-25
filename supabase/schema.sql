-- ════════════════════════════════════════════════════════
--  PharmStock — Schéma Supabase
--  À exécuter dans l'éditeur SQL de Supabase (Project > SQL Editor)
-- ════════════════════════════════════════════════════════

-- Extension pour uuid
create extension if not exists "pgcrypto";

-- ── MÉDICAMENTS ──────────────────────────────────────────
create table if not exists medicaments (
  id uuid primary key default gen_random_uuid(),
  nom text not null,
  categorie text,
  forme text default 'Comprimés',
  quantite integer not null default 0,
  seuil integer not null default 5,
  prix numeric default 0,
  peremption date,
  lot text,
  fournisseur text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ── FOURNISSEURS ─────────────────────────────────────────
create table if not exists fournisseurs (
  id uuid primary key default gen_random_uuid(),
  nom text not null,
  contact text,
  tel text,
  adresse text,
  created_at timestamptz not null default now()
);

-- ── ENTRÉES DE STOCK ─────────────────────────────────────
create table if not exists entrees (
  id uuid primary key default gen_random_uuid(),
  med_id uuid references medicaments(id) on delete set null,
  qty integer not null,
  date date not null default current_date,
  fournisseur text,
  lot text,
  created_at timestamptz not null default now()
);

-- ── SORTIES / VENTES ─────────────────────────────────────
create table if not exists sorties (
  id uuid primary key default gen_random_uuid(),
  med_id uuid references medicaments(id) on delete set null,
  qty integer not null,
  date date not null default current_date,
  motif text default 'Vente',
  created_at timestamptz not null default now()
);

-- ── INDEX ────────────────────────────────────────────────
create index if not exists idx_entrees_med_id on entrees(med_id);
create index if not exists idx_sorties_med_id on sorties(med_id);
create index if not exists idx_medicaments_categorie on medicaments(categorie);

-- ── updated_at auto ──────────────────────────────────────
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_medicaments_updated_at on medicaments;
create trigger trg_medicaments_updated_at
  before update on medicaments
  for each row execute function set_updated_at();

-- ── ROW LEVEL SECURITY ───────────────────────────────────
-- Activé par défaut. Ci-dessous une politique simple qui autorise
-- tout accès aux utilisateurs authentifiés (à affiner selon vos besoins:
-- par pharmacie/organisation, par rôle, etc.)

alter table medicaments enable row level security;
alter table fournisseurs enable row level security;
alter table entrees enable row level security;
alter table sorties enable row level security;

create policy "authenticated full access" on medicaments
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

create policy "authenticated full access" on fournisseurs
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

create policy "authenticated full access" on entrees
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

create policy "authenticated full access" on sorties
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

-- Si vous voulez tester SANS authentification pendant le développement,
-- remplacez temporairement les 4 policies ci-dessus par :
--   create policy "public dev access" on <table> for all using (true) with check (true);
-- puis réactivez l'auth avant la mise en production.

-- ── FONCTIONS RPC : mouvements de stock atomiques ────────
-- Insère la ligne de mouvement ET met à jour la quantité en une seule
-- transaction, pour éviter les incohérences si un appel échoue en cours de route.

create or replace function enregistrer_entree(
  p_med_id uuid, p_qty integer, p_date date, p_fournisseur text, p_lot text
) returns entrees as $$
declare
  new_row entrees;
begin
  update medicaments set quantite = quantite + p_qty where id = p_med_id;
  insert into entrees (med_id, qty, date, fournisseur, lot)
  values (p_med_id, p_qty, p_date, p_fournisseur, p_lot)
  returning * into new_row;
  return new_row;
end;
$$ language plpgsql security definer;

create or replace function enregistrer_sortie(
  p_med_id uuid, p_qty integer, p_date date, p_motif text
) returns sorties as $$
declare
  new_row sorties;
  current_qty integer;
begin
  select quantite into current_qty from medicaments where id = p_med_id for update;
  if current_qty is null then
    raise exception 'Médicament introuvable';
  end if;
  if current_qty < p_qty then
    raise exception 'Stock insuffisant (disponible : %)', current_qty;
  end if;
  update medicaments set quantite = quantite - p_qty where id = p_med_id;
  insert into sorties (med_id, qty, date, motif)
  values (p_med_id, p_qty, p_date, p_motif)
  returning * into new_row;
  return new_row;
end;
$$ language plpgsql security definer;

grant execute on function enregistrer_entree to authenticated;
grant execute on function enregistrer_sortie to authenticated;

-- ── REALTIME (optionnel) ─────────────────────────────────
-- Pour que les changements se reflètent en direct entre plusieurs postes :
alter publication supabase_realtime add table medicaments;
alter publication supabase_realtime add table entrees;
alter publication supabase_realtime add table sorties;
alter publication supabase_realtime add table fournisseurs;
