create table if not exists users (
    user_id integer primary key autoincrement,
    username text not null unique,
    role text check(role in ('admin', 'base commander', 'logistics officer')),
    password text not null
);

create table if not exists bases (
    base_id integer primary key autoincrement,
    base_name text not null unique,
    base_commander_id integer unique,
    created_date datetime default current_timestamp,
    foreign key (base_commander_id) references users(user_id)
);

create table if not exists assets(
    asset_id integer primary key autoincrement,
    asset_name text not null unique,
    asset_type text not null check(asset_type in ('vehicle', 'weapon', 'ammunition', 'communication'))
);

create table if not exists asset_storage(
    storage_id integer primary key autoincrement,
    asset_id integer not null,
    base_id integer not null,
    available integer default 0,
    foreign key (asset_id) references assets(asset_id),
    foreign key (base_id) references bases(base_id),
    unique(asset_id, base_id)
);

create table if not exists transactions(
    transaction_id integer primary key autoincrement,
    asset_id integer not null,
    base_id integer not null,
    base_to_id integer ,
    quantity integer not null,
    status text check(status in ('purchase', 'transfer-in', 'transfer-out')),
    date timestamp default current_timestamp,
    foreign key( asset_id) references assets(asset_id),
    foreign key( base_id) references bases(base_id)
);