CREATE TABLE public.pedestrian (
	id serial NOT NULL,
	mail varchar NOT NULL,
	pass varchar NOT NULL,
	gen varchar NULL,
	age int4 NULL,
	CONSTRAINT pedestrian_pk PRIMARY KEY (id)
);

CREATE TABLE public.route (
	geom geometry NOT NULL,
	id serial4 NOT NULL,
	pedestrian_id int4 NOT NULL,
	CONSTRAINT route_pk PRIMARY KEY (id)
);

CREATE TABLE public.form (
	id serial NOT NULL,
	geom geometry NOT NULL,
	pedestrian_id int4 NOT NULL,
	route_id int4 NOT NULL,
	CONSTRAINT form_pk PRIMARY KEY (id),
	CONSTRAINT form_fk FOREIGN KEY (pedestrian_id) REFERENCES public.pedestrian(id),
	CONSTRAINT form_fk_1 FOREIGN KEY (route_id) REFERENCES public.route(id)
);

CREATE TABLE public.quest1 (
	id serial NOT NULL,
	answer varchar NOT NULL,
	CONSTRAINT quest1_pk PRIMARY KEY (id)
);

CREATE TABLE public.quest2 (
	id serial NOT NULL,
	answer varchar NOT NULL,
	CONSTRAINT quest2_pk PRIMARY KEY (id)
);
