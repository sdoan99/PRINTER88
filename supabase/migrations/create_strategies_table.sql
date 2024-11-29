-- Create strategies table
create table public.strategies (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  name text not null,
  description text not null,
  market_types text[] not null,
  timeframes text[] not null,
  categories text[] not null,
  total_pnl decimal(15,2) default 0,
  win_rate decimal(5,2) default 0,
  avg_win decimal(15,2) default 0,
  avg_loss decimal(15,2) default 0,
  profit_factor decimal(8,2) default 0,
  avg_pnl_per_day decimal(15,2) default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security
alter table public.strategies enable row level security;

-- Create policies
create policy "Users can view their own strategies"
  on public.strategies for select
  using (auth.uid() = user_id);

create policy "Users can insert their own strategies"
  on public.strategies for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own strategies"
  on public.strategies for update
  using (auth.uid() = user_id);

create policy "Users can delete their own strategies"
  on public.strategies for delete
  using (auth.uid() = user_id);

-- Create indexes
create index strategies_user_id_idx on public.strategies(user_id);
create index strategies_market_types_idx on public.strategies using gin(market_types);
create index strategies_categories_idx on public.strategies using gin(categories);

-- Set up trigger for updated_at
create trigger handle_updated_at
  before update on public.strategies
  for each row
  execute procedure public.handle_updated_at();