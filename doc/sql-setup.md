# Setup Postgres tables and data

## Menu

```sql
drop table nav_menu;

CREATE TABLE nav_menu (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    icon VARCHAR(255),
    route_url VARCHAR(255) NOT NULL,
    is_active BOOLEAN NOT NULL,
    sort_order int not null
);

insert into nav_menu
(name , icon, route_url, is_active, sort_order)
values
('Projects', 'bi bi-window', '/projects', true, 1),
('Contact', 'bi bi-telephone', '/contact', true, 2),
('Subscribe', 'bi bi-pen', '/subscribe', true, 3);

select * from nav_menu;
```

## Footer

```sql
drop table nav_footer;

CREATE TABLE nav_footer (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    icon VARCHAR(255),
    route_url VARCHAR(255) NOT NULL,
    is_active BOOLEAN NOT NULL,
    sort_order int not null
);

insert into nav_footer
(name , icon, route_url, is_active, sort_order)
values
('LinkedIn', 'https://res.cloudinary.com/dfta3fn6p/image/upload/v1676064212/public/logo/nav-icon1_dx8dcr.svg', 'https://www.linkedin.com/in/njmalaza', true, 1),
('Facebook', 'https://res.cloudinary.com/dfta3fn6p/image/upload/v1676064213/public/logo/nav-icon2_j3cdqp.svg', 'https://www.facebook.com/', true, 2),
('Instagram', 'https://res.cloudinary.com/dfta3fn6p/image/upload/v1676064213/public/logo/nav-icon3_k4zon2.svg', 'https://www.instagram.com/nhlanhlamalaza_', true, 3);

select * from nav_footer;
```
