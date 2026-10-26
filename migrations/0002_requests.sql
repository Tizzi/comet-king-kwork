create table if not exists part_requests (
  id serial primary key,
  user_id text not null,
  contact_name text not null,
  phone text not null,
  comment text not null default '',
  items text not null,
  total integer not null,
  created_at timestamptz not null default now()
);

create index if not exists part_requests_user_idx on part_requests (user_id);
