create user lofigirl@localhost;
create schema lofigirl;
grant all privileges on lofigirl.* to lofigirl@localhost;

use lofigirl;

create table channels (
  id varchar(20) not null,
  guild varchar(20) not null,
  theme int default 1 not null
);

create table themes (
  id int not null AUTO_INCREMENT primary key,
  name text not null,
  url text not null
);

create table users (
  id varchar(20) not null,
  locale varchar(5)
);

insert into themes (name, url) values ('beats to relax/study to (24h)', 'https://www.youtube.com/watch?v=5qap5aO4i9A');
insert into themes (name, url) values ('beats to sleep/chill to (24h)', 'https://www.youtube.com/watch?v=DWcJFNfaw9c');
