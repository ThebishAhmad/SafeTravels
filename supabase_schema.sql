-- Enable PostGIS extension for geolocation
create extension if not exists postgis;

-- 1. Users Table
create table users (
  id uuid references auth.users not null primary key,
  email text unique not null,
  name text,
  role text check (role in ('STUDENT', 'BUS_DRIVER', 'AUTO_DRIVER', 'ADMIN')) default 'STUDENT',
  phone text,
  department text,
  created_at timestamptz default now()
);

-- 2. Bus Routes Table
create table bus_routes (
  id text primary key, -- e.g. 'route-1'
  name text not null,
  frequency text,
  is_active boolean default true,
  created_at timestamptz default now()
);

-- 3. Route Stops Table
create table route_stops (
  id uuid default uuid_generate_v4() primary key,
  route_id text references bus_routes(id) on delete cascade,
  name text not null,
  lat double precision not null,
  lng double precision not null,
  arrival_offset int not null, -- minutes from start
  stop_order int not null
);

-- 4. Buses Table
create table buses (
  id text primary key, -- e.g. 'BUS-01'
  route_id text references bus_routes(id),
  lat double precision,
  lng double precision,
  load_status text check (load_status in ('LOW', 'MEDIUM', 'HIGH')) default 'LOW',
  last_seen text,
  last_updated timestamptz default now(),
  is_active boolean default true
);

-- 5. Rides Table (Carpooling)
create table rides (
  id uuid default uuid_generate_v4() primary key,
  host_id uuid references users(id) on delete cascade,
  dest text not null,
  departure_time timestamptz not null,
  max_passengers int default 4,
  riders_count int default 1,
  fare numeric not null,
  status text check (status in ('OPEN', 'FULL', 'COMPLETED', 'CANCELLED')) default 'OPEN',
  gender_pref text check (gender_pref in ('ANY', 'FEMALE_ONLY')) default 'ANY',
  created_at timestamptz default now()
);

-- 6. Ride Participants Table
create table ride_participants (
  ride_id uuid references rides(id) on delete cascade,
  user_id uuid references users(id) on delete cascade,
  joined_at timestamptz default now(),
  primary key (ride_id, user_id)
);

-- 7. Complaints Table
create table complaints (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references users(id),
  type text not null, -- DRIVER, BUS, RIDE, GENERAL
  target text, -- License plate or Bus ID
  description text not null,
  status text check (status in ('OPEN', 'IN_PROGRESS', 'RESOLVED', 'DISMISSED')) default 'OPEN',
  created_at timestamptz default now()
);

-- Row Level Security (RLS) Policies (Simplified for MVP)
alter table users enable row level security;
alter table bus_routes enable row level security;
alter table route_stops enable row level security;
alter table buses enable row level security;
alter table rides enable row level security;
alter table ride_participants enable row level security;
alter table complaints enable row level security;

-- Allow read access to all for now (demo mode)
create policy "Public read access" on bus_routes for select using (true);
create policy "Public read access" on route_stops for select using (true);
create policy "Public read access" on buses for select using (true);
create policy "Public read access" on rides for select using (true);
create policy "Public read access" on complaints for select using (true);

-- Allow authenticated insert
create policy "Auth insert" on rides for insert with check (auth.uid() = host_id);
create policy "Auth insert" on complaints for insert with check (auth.uid() = user_id);
