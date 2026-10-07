-- Query 1
-- select a.name, count(b.id) number_of_books
-- from authors a
-- left join books b on a.id = b.author_id
-- group by a.name;

-- Query 2
-- select a.name, count(b.id) number_of_books
-- from authors a
-- left join books b on a.id = b.author_id
-- group by a.name
-- having count(b.id) > 3;

-- Query 3
-- select country, count(id) number_of_authors
-- from authors
-- group by country
-- having count(id) > 1;

-- Query 4
-- select c.name, sum(oi.quantity * oi.cost) total_cost
-- from customers c
-- join orders o on c.id = o.customer_id
-- join order_item oi on o.id = oi.order_id
-- group by c.name, oi.order_id
-- order by total_cost desc
-- limit 5;

-- Query 5
-- select c.name, sum(oi.quantity * oi.cost) total_cost
-- from customers c
-- join orders o on c.id = o.customer_id
-- join order_item oi on o.id = oi.order_id
-- group by c.name
-- having sum(oi.quantity * oi.cost) > 100;

-- Query 6
-- select c.name, o.id order_id
-- from customers c
-- left join orders o on c.id = o.customer_id
-- where o.id is null;

-- Query 7
-- select b.title, oi.order_id
-- from books b
-- left join order_item oi on b.id = oi.book_id
-- where oi.order_id is null;

-- Query 8
-- select a.name, sum(oi.quantity) amount_sold
-- from authors a
-- join books b on a.id = b.author_id
-- join order_item oi on b.id = oi.book_id
-- group by a.name, oi.book_id
-- order by amount_sold desc
-- limit 5;

-- Query 9
-- select a.country, sum(oi.quantity) total_books_sold
-- from authors a
-- join books b on a.id = b.author_id
-- join order_item oi on b.id = oi.book_id
-- group by a.country;

-- Query 10
-- select c.name
-- from customers c
-- left join orders o on c.id = o.customer_id
-- group by c.name
-- having count(o.customer_id) < 2;

-- Query 11
-- select order_id, count(book_id) number_of_different_books
-- from order_item
-- group by order_id
-- having count(book_id) >= 3;