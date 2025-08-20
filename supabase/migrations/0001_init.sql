-- Clients
create table if not exists customers (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  phone text,
  first_name text,
  last_name text,
  created_at timestamptz default now()
);

-- Dossiers / réservations
create table if not exists bookings (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid references customers(id) on delete set null,
  couple_name text,           -- ex: "Justine & Feridun"
  wedding_date date,
  city text,
  venue_ceremony text,
  venue_reception text,
  total_amount integer not null,          -- en EUR
  deposit_suggested integer not null,     -- en EUR
  remaining_dayj integer not null,        -- en EUR
  stripe_session_id text,
  created_at timestamptz default now()
);

-- Ligne(s) de commande : formule + options
create table if not exists booking_items (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid references bookings(id) on delete cascade,
  label text not null,
  amount integer not null,  -- en EUR
  is_formula boolean default false
);

-- Questionnaire (réponses libres)
create table if not exists questionnaires (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid references bookings(id) on delete cascade,
  answers jsonb not null,                      -- blob JSON
  created_at timestamptz default now()
);

-- Paiements Stripe (acompte)
create table if not exists payments (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid references bookings(id) on delete set null,
  stripe_payment_intent text,
  amount integer not null,          -- en EUR
  status text not null,             -- succeeded, processing, etc.
  created_at timestamptz default now()
);