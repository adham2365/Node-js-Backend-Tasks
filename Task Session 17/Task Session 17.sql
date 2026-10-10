create type todo_status as enum('yes', 'no');
create table if not exists todo(
    id serial primary key,
	title varchar(255) not null unique,
	body varchar(255) not null,
	created_at timestamp default current_timestamp,
	done todo_status default 'no'
);