# Setup Postgres tables and data

### Menu

**MENU MODULE**

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

**MENU ITEM**

```sql
drop table nav_menu_item

create table nav_menu_item (
    id SERIAL PRIMARY KEY,
    parent_id INT,
    name VARCHAR(255) NOT NULL,
    icon VARCHAR(255),
    route_url VARCHAR(255) NOT NULL,
    is_active BOOLEAN NOT NULL,
    sort_order int not null,

    -- Foreign key constraint
    CONSTRAINT fk_parent_id FOREIGN KEY (parent_id) REFERENCES nav_menu(id)
)

insert into nav_menu_item
(parent_id, name, icon, route_url, is_active, sort_order)
values
()
```

### Footer

```sql
drop table nav_footer;

create table nav_footer (
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

### Email

**TEMPLATE**

```sql

drop table mail_template

create table mail_template (
    template_id SERIAL PRIMARY KEY,
    code VARCHAR(10) NOT NULL,
    name VARCHAR(200) NOT NULL,
    html_file_name VARCHAR(200) NOT NULL,
    send_to_email VARCHAR(200)
);

insert into mail_template
(code, name, html_file_name, send_to_email)
values
('GEN', 'General', '', 'njmcloud@gmail.com')
```

### Projects

```sql
# Project Table
CREATE TABLE IF NOT EXISTS project
(
    id integer NOT NULL DEFAULT nextval('project_id_seq'::regclass),
    project_group_id integer NOT NULL,
    title character varying(255) COLLATE pg_catalog."default" NOT NULL,
    description character varying(255) COLLATE pg_catalog."default" NOT NULL,
    img_url character varying(100000) COLLATE pg_catalog."default" NOT NULL,
    live_url character varying(100000) COLLATE pg_catalog."default" NOT NULL,
    is_code boolean NOT NULL,
    code_url character varying(100000) COLLATE pg_catalog."default",
    is_current_domain boolean NOT NULL,
    stack_json jsonb NOT NULL,
    is_active boolean NOT NULL,
    CONSTRAINT project_pkey PRIMARY KEY (id),
    CONSTRAINT project_project_group_id_fkey FOREIGN KEY (project_group_id)
        REFERENCES public.project_group (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)

TABLESPACE pg_default;

ALTER TABLE public.project
    OWNER to "default";
```

```sql
# Project Group Table
CREATE TABLE IF NOT EXISTS project_group
(
    id integer NOT NULL DEFAULT nextval('project_group_id_seq'::regclass),
    code character varying(50) COLLATE pg_catalog."default" NOT NULL,
    name character varying(255) COLLATE pg_catalog."default" NOT NULL,
    icon character varying(255) COLLATE pg_catalog."default" NOT NULL,
    is_active boolean NOT NULL,
    CONSTRAINT project_group_pkey PRIMARY KEY (id)
)

TABLESPACE pg_default;

ALTER TABLE public.project_group
    OWNER to "default";

```

## Views

```sql
CREATE VIEW projects AS
SELECT json_build_object(
    'project_group_name', pg.name,
    'project_group_code', pg.code,
    'project_group_icon', pg.icon,
    'projects', json_agg(
        json_build_object(
            'project_id', p.id,
            'project_group_id', p.project_group_id,
            'project_title', p.title,
            'project_description', p.description,
            'img_url', p.img_url,
            'live_url', p.live_url,
            'is_code', p.is_code,
            'code_url', p.code_url,
            'is_current_domain', p.is_current_domain,
            'stack_json', p.stack_json
        )
    )
) AS project_group_info
FROM project p
LEFT JOIN project_group pg ON p.project_group_id = pg.id
WHERE p.is_active = true
  AND pg.is_active = true
GROUP BY pg.id, pg.name, pg.code, pg.icon
ORDER BY pg.name;

```
