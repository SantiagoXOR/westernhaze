-- WesternHaze MVP - Esquema inicial
-- Ejecutar en el SQL Editor de tu proyecto Supabase (Dashboard > SQL Editor)

-- Extensión para UUIDs (ya suele estar en Supabase)
-- create extension if not exists "uuid-ossp";

-- Perfil extendido de usuario (auth.users lo maneja Supabase; esta tabla es para preferencias)
create table if not exists public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  display_name text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Espacios de cultivo (ej. "Carpa Indoor 1")
create table if not exists public.grow_spaces (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  name text not null,
  created_at timestamptz default now()
);

-- Reportes de escaneo (tabla principal)
create table if not exists public.scan_reports (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  grow_space_id uuid references public.grow_spaces(id) on delete set null,
  image_url text not null,
  health_score int not null check (health_score >= 0 and health_score <= 100),
  json_analysis_full jsonb not null,
  created_at timestamptz default now()
);

-- Índices para consultas frecuentes
create index if not exists idx_scan_reports_user_created on public.scan_reports(user_id, created_at desc);
create index if not exists idx_grow_spaces_user on public.grow_spaces(user_id);

-- RLS: habilitar en todas las tablas
alter table public.users enable row level security;
alter table public.grow_spaces enable row level security;
alter table public.scan_reports enable row level security;

-- Políticas: cada usuario solo ve/edita sus datos
create policy "Users can read own profile"
  on public.users for select using (auth.uid() = id);
create policy "Users can update own profile"
  on public.users for update using (auth.uid() = id);
create policy "Users can insert own profile"
  on public.users for insert with check (auth.uid() = id);

create policy "Users can manage own grow_spaces"
  on public.grow_spaces for all using (auth.uid() = user_id);

create policy "Users can manage own scan_reports"
  on public.scan_reports for all using (auth.uid() = user_id);

-- Trigger: crear fila en public.users al registrarse (Supabase Auth)
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.users (id, email)
  values (new.id, new.email);
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
