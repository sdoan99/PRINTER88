-- Create BetsPage table
create table public.bets_page (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  strategy_id text not null,
  date_time timestamp with time zone not null,
  market text not null,
  sector text,
  symbol text not null,
  expiration timestamp with time zone,
  risk decimal(15,2) not null,
  return decimal(15,2) default 0,
  return_percentage decimal(8,2) default 0,
  status text check (status in ('Open', 'Closed', 'Won', 'Lost', 'Push')) not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create BetsNew table for individual bet legs
create table public.bets_new (
  id uuid default uuid_generate_v4() primary key,
  bet_id uuid references public.bets_page(id) on delete cascade not null,
  date_time timestamp with time zone not null,
  quantity decimal(15,4) not null,
  position text check (position in ('Buy', 'Sell')) not null,
  price decimal(15,2) not null,
  risk decimal(15,2) not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security
alter table public.bets_page enable row level security;
alter table public.bets_new enable row level security;

-- Create policies for BetsPage
create policy "Users can view their own bets"
  on public.bets_page for select
  using (auth.uid() = user_id);

create policy "Users can insert their own bets"
  on public.bets_page for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own bets"
  on public.bets_page for update
  using (auth.uid() = user_id);

create policy "Users can delete their own bets"
  on public.bets_page for delete
  using (auth.uid() = user_id);

-- Create policies for BetsNew
create policy "Users can view their own bet legs"
  on public.bets_new for select
  using (exists (
    select 1 from public.bets_page
    where id = bet_id and user_id = auth.uid()
  ));

create policy "Users can insert their own bet legs"
  on public.bets_new for insert
  with check (exists (
    select 1 from public.bets_page
    where id = bet_id and user_id = auth.uid()
  ));

create policy "Users can update their own bet legs"
  on public.bets_new for update
  using (exists (
    select 1 from public.bets_page
    where id = bet_id and user_id = auth.uid()
  ));

create policy "Users can delete their own bet legs"
  on public.bets_new for delete
  using (exists (
    select 1 from public.bets_page
    where id = bet_id and user_id = auth.uid()
  ));

-- Create indexes
create index bets_page_user_id_idx on public.bets_page(user_id);
create index bets_page_strategy_id_idx on public.bets_page(strategy_id);
create index bets_new_bet_id_idx on public.bets_new(bet_id);

-- Set up triggers for updated_at
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger handle_bets_page_updated_at
  before update on public.bets_page
  for each row
  execute procedure public.handle_updated_at();

create trigger handle_bets_new_updated_at
  before update on public.bets_new
  for each row
  execute procedure public.handle_updated_at();