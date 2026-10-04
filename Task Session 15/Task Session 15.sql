-- DDL
-- create table if not exists members (
--     id serial primary key,
-- 	name varchar(255) not null,
-- 	email varchar(255) not null unique, 
-- 	phone varchar(50) not null,
-- 	start_date timestamp not null,
-- 	membership_plan varchar(255) not null 
-- );

-- create table if not exists trainers (
--     id serial primary key,
-- 	name varchar(255) not null,
-- 	specialty varchar(255) not null, 
-- 	years_of_experience int not null check (years_of_experience > 0)
-- );

-- create table if not exists classes (
--     id serial primary key,
-- 	trainer_id int not null references trainers(id) on delete cascade,
-- 	scheduled_time time not null,
-- 	duration interval not null check (duration >= '1 hour'::interval and duration <= '4 hour'::interval),
-- 	max_capacity int not null check (max_capacity > 9)
-- );

-- create table if not exists lockers (
--     id serial primary key,
-- 	member_id int references members(id) on delete set null
-- );

-- create table if not exists classes_members (
--     class_id int references classes(id) on delete cascade,
-- 	member_id int references members(id) on delete cascade,
-- 	primary key(class_id, member_id)
-- );

-- DML
-- INSERT INTO members (name, email, phone, start_date, membership_plan) 
-- VALUES 
--     ('Omar Hassan','omar.hassan@example.com','+20-100-234-5871','2023-02-14 09:30:00','Premium'),
--     ('Mary Johnson','mary.johnson@example.com','+1-555-203-8841','2022-11-03 17:45:00','Basic'),
--     ('Wei Chen','wei.chen@example.com','+86-138-0013-8000','2024-01-22 08:10:00','Standard'),
--     ('Fatima Ibrahim','fatima.ibrahim@example.com','+20-111-482-9034','2023-07-09 12:00:00','Family'),
--     ('Carlos Silva','carlos.silva@example.com','+55-11-98765-4321','2021-05-30 19:20:00','Premium'),
--     ('Sarah Miller','sarah.miller@example.com','+1-555-774-1290','2024-03-15 07:55:00','Student'),
--     ('Ahmed Khalil','ahmed.khalil@example.com','+20-122-665-1178','2022-08-18 14:30:00','Corporate'),
--     ('Linda Garcia','linda.garcia@example.com','+1-555-390-6612','2023-10-01 10:05:00','Basic'),
--     ('Yusuf Nasser','yusuf.nasser@example.com','+20-100-908-3347','2020-12-12 16:40:00','Premium'),
--     ('Jessica Brown','jessica.brown@example.com','+1-555-118-4720','2024-06-27 11:15:00','Standard'),
--     ('Nour Mahmoud','nour.mahmoud@example.com','+20-109-554-2216','2023-04-04 18:00:00','Student'),
--     ('David Anderson','david.anderson@example.com','+1-555-642-0983','2022-02-20 06:50:00','Family'),
--     ('Mei Wang','mei.wang@example.com','+86-139-1122-3344','2024-09-09 09:00:00','Basic'),
--     ('Robert Taylor','robert.taylor@example.com','+1-555-837-5521','2021-09-14 20:10:00','Corporate'),
--     ('Layla Salem','layla.salem@example.com','+20-115-300-7789','2023-12-25 13:25:00','Premium'),
--     ('Daniel Kim','daniel.kim@example.com','+82-10-2345-6789','2022-06-06 07:30:00','Standard'),
--     ('Sofia Martinez','sofia.martinez@example.com','+34-612-345-678','2024-02-11 15:45:00','Basic'),
--     ('Michael Lee','michael.lee@example.com','+1-555-476-3309','2020-10-19 12:35:00','Premium'),
--     ('Dina Fahmy','dina.fahmy@example.com','+20-100-771-4402','2023-05-23 17:00:00','Family'),
--     ('Thomas Moore','thomas.moore@example.com','+1-555-921-6648','2022-01-08 08:45:00','Corporate'),
--     ('Hana Aziz','hana.aziz@example.com','+20-127-418-9065','2024-04-30 19:50:00','Student'),
--     ('James Wilson','james.wilson@example.com','+1-555-205-7714','2021-03-17 10:20:00','Standard'),
--     ('Karen Thompson','karen.thompson@example.com','+1-555-683-1190','2023-08-21 14:05:00','Basic'),
--     ('Mostafa Saleh','mostafa.saleh@example.com','+20-106-259-3381','2022-09-29 06:40:00','Premium'),
--     ('Elizabeth Davis','elizabeth.davis@example.com','+1-555-352-8872','2024-07-13 16:15:00','Family'),
--     ('Tarek Mansour','tarek.mansour@example.com','+20-112-844-7706','2021-12-02 09:55:00','Standard'),
--     ('Patricia Jackson','patricia.jackson@example.com','+1-555-519-2043','2023-01-26 18:30:00','Corporate'),
--     ('Nguyen Tran','nguyen.tran@example.com','+84-90-123-4567','2024-05-19 07:05:00','Student'),
--     ('Salma Farouk','salma.farouk@example.com','+20-101-632-5518','2022-04-12 13:50:00','Basic'),
--     ('William Martin','william.martin@example.com','+1-555-760-4425','2020-07-31 11:40:00','Premium');

-- INSERT INTO trainers (name, specialty, years_of_experience) 
-- VALUES 
--     ('Khaled Farouk','Strength Training',12),
--     ('Sarah Bennett','Yoga',8),
--     ('Mostafa Aziz','CrossFit',6),
--     ('Dina Saleh','Pilates',10),
--     ('Jordan Reed','Boxing',15),
--     ('Salma Mansour','Zumba',4),
--     ('Chris Carter','HIIT',7),
--     ('Tarek Fahmy','Spinning',9),
--     ('Morgan Ward','Stretching & Mobility',3),
--     ('Layla Brooks','Functional Training',11);
 
-- INSERT INTO classes (trainer_id,scheduled_time,duration,max_capacity)
-- VALUES
--     (1,'06:00:00','01:00:00',15),
--     (2,'07:30:00','01:30:00',20),
--     (3,'08:00:00','01:00:00',12),
--     (4,'09:00:00','02:00:00',18),
--     (5,'10:30:00','01:30:00',10),
--     (6,'12:00:00','01:00:00',25),
--     (7,'13:15:00','01:00:00',14),
--     (8,'14:00:00','02:00:00',30),
--     (9,'15:30:00','01:30:00',16),
--     (10,'16:00:00','03:00:00',22),
--     (1,'17:00:00','01:00:00',12),
--     (2,'17:45:00','01:30:00',24),
--     (3,'18:00:00','04:00:00',10),
--     (4,'18:30:00','01:00:00',20),
--     (5,'19:00:00','02:00:00',15),
--     (6,'19:30:00','01:30:00',35),
--     (7,'20:00:00','01:00:00',18),
--     (8,'07:00:00','01:00:00',28),
--     (9,'11:00:00','02:30:00',13),
--     (10,'21:00:00','01:30:00',40);

-- INSERT INTO lockers (member_id) 
-- VALUES 
--     (4),
--     (9),
--     (15),
--     (22),
--     (1),
--     (30),
--     (NULL),
--     (12),
--     (7),
--     (NULL),
--     (19),
--     (26),
--     (NULL),
--     (11),
--     (28),
--     (NULL),
--     (17),
--     (5),
--     (NULL),
--     (NULL);

-- INSERT INTO classes_members (class_id,member_id)
-- VALUES
--     (1,3),
--     (1,7),
--     (1,12),
--     (2,1),
--     (2,5),
--     (2,22),
--     (3,8),
--     (3,14),
--     (3,19),
--     (4,2),
--     (4,9),
--     (4,25),
--     (5,4),
--     (5,11),
--     (5,30),
--     (6,6),
--     (6,13),
--     (6,17),
--     (7,10),
--     (7,15),
--     (7,28),
--     (8,3),
--     (8,18),
--     (8,24),
--     (9,5),
--     (9,20),
--     (9,27),
--     (10,1),
--     (10,16),
--     (10,26),
--     (11,7),
--     (11,21),
--     (11,29),
--     (12,2),
--     (12,12),
--     (12,23),
--     (13,9),
--     (13,14),
--     (13,30),
--     (14,4),
--     (14,19),
--     (14,22),
--     (15,8),
--     (15,11),
--     (15,25),
--     (16,6),
--     (16,17),
--     (16,28),
--     (17,13),
--     (17,20),
--     (17,24),
--     (18,10),
--     (18,15),
--     (18,27),
--     (19,1),
--     (19,18),
--     (19,29),
--     (20,16),
--     (20,21),
--     (20,26);

-- UPDATE members
-- SET membership_plan = 'VIP'
-- WHERE membership_plan = 'Family';

-- this update is needed for query 5
-- UPDATE classes
-- SET trainer_id = 5
-- WHERE scheduled_time = '07:30:00'::time;


-- DQL


-- Query 1 — Filtering + sorting
-- Find all members whose membership plan is Premium or VIP,
-- and display them ordered by their start_date from the most recent to the oldest.

-- select * 
-- from members
-- where membership_plan in ('Premium', 'VIP')
-- order by start_date desc;


-- Query 2 — Aggregation
-- Find the number of classes assigned to each trainer.

-- select t.name, count(c.trainer_id) as classes
-- from trainers as t
-- join classes as c on c.trainer_id = t.id
-- group by t.name;


-- Query 3 — JOIN
-- Find the names of all members who are registered for a class,
-- along with the class ID and scheduled time.

-- select m.name, cm.class_id, c.scheduled_time
-- from members as m
-- join classes_members as cm on m.id = cm.member_id
-- join classes as c on cm.class_id = c.id;


-- Query 4 — GROUP BY + HAVING
-- Find all classes that have more than 2 registered members.

-- select cm.class_id, count(cm.member_id) as registered_members
-- from classes_members as cm
-- group by cm.class_id
-- having count(cm.member_id) > 2;


-- Query 5 — More challenging 🔥
-- Find the trainer(s) who have the highest number of classes.
-- Your result should contain the trainer's name and their number of classes.

-- with trainer_classes as (
--      select t.name, count(c.id) as number_of_classes
--      from trainers as t
--      join classes as c on t.id = c.trainer_id
--      group by t.name
-- 	 )
-- select *
-- from trainer_classes
-- where number_of_classes = (select max(number_of_classes) from trainer_classes);