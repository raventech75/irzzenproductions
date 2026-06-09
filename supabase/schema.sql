-- ============================================================
-- Irzzen Productions — Schéma Supabase
-- Coller dans l'éditeur SQL de Supabase (SQL Editor > New query)
-- ============================================================

-- Extensions
create extension if not exists "uuid-ossp";

-- ============================================================
-- TABLE: clients
-- ============================================================
create table if not exists public.clients (
  id            uuid primary key default uuid_generate_v4(),
  user_id       uuid references auth.users(id) on delete cascade,
  prenom_marie1 text not null,
  prenom_marie2 text not null,
  email         text not null,
  telephone     text,
  date_mariage  date not null,
  lieu          text,
  formule       text not null default 'essentielle',
  total_ttc     integer not null default 0,
  acompte_verse boolean not null default false,
  notes_internes text,
  statut        text not null default 'prospect'
                check (statut in ('prospect','confirme','en_cours','livre','termine')),
  created_at    timestamptz not null default now()
);

-- ============================================================
-- TABLE: galeries
-- ============================================================
create table if not exists public.galeries (
  id            uuid primary key default uuid_generate_v4(),
  client_id     uuid not null references public.clients(id) on delete cascade,
  nom           text not null,
  type          text not null default 'photo'
                check (type in ('photo','video')),
  nb_fichiers   integer not null default 0,
  taille_totale bigint not null default 0,
  actif         boolean not null default false,
  created_at    timestamptz not null default now()
);

-- ============================================================
-- TABLE: fichiers
-- ============================================================
create table if not exists public.fichiers (
  id            uuid primary key default uuid_generate_v4(),
  galerie_id    uuid not null references public.galeries(id) on delete cascade,
  nom           text not null,
  url           text not null,
  url_miniature text,
  type          text not null default 'photo'
                check (type in ('photo','video')),
  taille        bigint not null default 0,
  created_at    timestamptz not null default now()
);

-- ============================================================
-- TABLE: contrats
-- ============================================================
create table if not exists public.contrats (
  id          uuid primary key default uuid_generate_v4(),
  client_id   uuid not null references public.clients(id) on delete cascade,
  titre       text not null,
  contenu_html text,
  statut      text not null default 'en_attente'
              check (statut in ('en_attente','signe','expire')),
  signe_le    timestamptz,
  pdf_url     text,
  created_at  timestamptz not null default now()
);

-- ============================================================
-- TABLE: messages (tickets support)
-- ============================================================
create table if not exists public.messages (
  id          uuid primary key default uuid_generate_v4(),
  client_id   uuid not null references public.clients(id) on delete cascade,
  auteur      text not null check (auteur in ('client','admin')),
  contenu     text not null,
  lu          boolean not null default false,
  created_at  timestamptz not null default now()
);

-- ============================================================
-- TABLE: admins (liste des comptes admin)
-- ============================================================
create table if not exists public.admins (
  id      uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade unique,
  nom     text not null,
  created_at timestamptz not null default now()
);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

alter table public.clients   enable row level security;
alter table public.galeries  enable row level security;
alter table public.fichiers  enable row level security;
alter table public.contrats  enable row level security;
alter table public.messages  enable row level security;
alter table public.admins    enable row level security;

-- Helper: est-ce un admin ?
create or replace function public.is_admin()
returns boolean language sql security definer as $$
  select exists (
    select 1 from public.admins where user_id = auth.uid()
  );
$$;

-- CLIENTS : chaque client voit seulement son dossier / admins voient tout
create policy "clients_select_own" on public.clients
  for select using (user_id = auth.uid() or public.is_admin());

create policy "clients_insert_admin" on public.clients
  for insert with check (public.is_admin());

create policy "clients_update_admin" on public.clients
  for update using (public.is_admin());

create policy "clients_delete_admin" on public.clients
  for delete using (public.is_admin());

-- GALERIES
create policy "galeries_select" on public.galeries
  for select using (
    public.is_admin() or
    exists (select 1 from public.clients c where c.id = client_id and c.user_id = auth.uid())
  );

create policy "galeries_admin_write" on public.galeries
  for all using (public.is_admin());

-- FICHIERS
create policy "fichiers_select" on public.fichiers
  for select using (
    public.is_admin() or
    exists (
      select 1 from public.galeries g
      join public.clients c on c.id = g.client_id
      where g.id = galerie_id and c.user_id = auth.uid()
    )
  );

create policy "fichiers_admin_write" on public.fichiers
  for all using (public.is_admin());

-- CONTRATS
create policy "contrats_select" on public.contrats
  for select using (
    public.is_admin() or
    exists (select 1 from public.clients c where c.id = client_id and c.user_id = auth.uid())
  );

create policy "contrats_client_sign" on public.contrats
  for update using (
    exists (select 1 from public.clients c where c.id = client_id and c.user_id = auth.uid())
  )
  with check (statut = 'signe');

create policy "contrats_admin_write" on public.contrats
  for all using (public.is_admin());

-- MESSAGES
create policy "messages_select" on public.messages
  for select using (
    public.is_admin() or
    exists (select 1 from public.clients c where c.id = client_id and c.user_id = auth.uid())
  );

create policy "messages_client_insert" on public.messages
  for insert with check (
    auteur = 'client' and
    exists (select 1 from public.clients c where c.id = client_id and c.user_id = auth.uid())
  );

create policy "messages_admin_write" on public.messages
  for all using (public.is_admin());

-- ADMINS : seuls les admins peuvent voir la table admins
create policy "admins_select" on public.admins
  for select using (public.is_admin());

-- ============================================================
-- STORAGE BUCKETS
-- ============================================================

-- Bucket galeries (photos/vidéos clients, accès authentifié)
insert into storage.buckets (id, name, public)
values ('galeries', 'galeries', false)
on conflict (id) do nothing;

-- Bucket contrats-pdf (accès authentifié)
insert into storage.buckets (id, name, public)
values ('contrats', 'contrats', false)
on conflict (id) do nothing;

-- Policies storage : clients accèdent à leur dossier, admins à tout
create policy "galeries_storage_client" on storage.objects
  for select using (
    bucket_id = 'galeries' and (
      public.is_admin() or
      (storage.foldername(name))[1] in (
        select g.id::text from public.galeries g
        join public.clients c on c.id = g.client_id
        where c.user_id = auth.uid()
      )
    )
  );

create policy "galeries_storage_admin_write" on storage.objects
  for all using (bucket_id = 'galeries' and public.is_admin());

create policy "contrats_storage_access" on storage.objects
  for select using (
    bucket_id = 'contrats' and (
      public.is_admin() or
      (storage.foldername(name))[1] in (
        select c.id::text from public.clients c where c.user_id = auth.uid()
      )
    )
  );

create policy "contrats_storage_admin_write" on storage.objects
  for all using (bucket_id = 'contrats' and public.is_admin());

-- ============================================================
-- DONNÉES DE TEST (optionnel, commenter en production)
-- ============================================================
-- Pour tester, créez d'abord un utilisateur dans Supabase Auth,
-- puis insérez un admin avec son user_id :
--
-- insert into public.admins (user_id, nom) values ('<votre-user-id>', 'Irzzen Admin');
--
-- Puis créez un client test :
-- insert into public.clients (user_id, prenom_marie1, prenom_marie2, email, date_mariage, formule, total_ttc)
-- values ('<client-user-id>', 'Sophie', 'Karim', 'test@test.com', '2025-06-15', 'prestige', 3890);
