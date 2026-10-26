--
-- PostgreSQL database dump
--

\restrict IevHFkvTBPwSJYeXnthUkFbttAK5RUfH310VGllhlS1Buu7N1zjh8daXe8o9gfx

-- Dumped from database version 18.6 (Debian 18.6-1.pgdg13+2)
-- Dumped by pg_dump version 18.6 (Debian 18.6-1.pgdg13+2)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Data for Name: services; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.services (id, name, price, is_active, description, category) OVERRIDING SYSTEM VALUE VALUES (1, 'Deep Clean', 49000.00, true, 'Pencucian semua bagian sepatu', 'shoes');
INSERT INTO public.services (id, name, price, is_active, description, category) OVERRIDING SYSTEM VALUE VALUES (6, 'Boots/Basketball', 54000.00, true, 'Non leather', 'shoes');
INSERT INTO public.services (id, name, price, is_active, description, category) OVERRIDING SYSTEM VALUE VALUES (2, 'Outer Clean', 34000.00, true, 'Pencucian bagian luar (upper+mid), tanpa bagian insole (dalam) dan outsole (bawah) - 4 hari', 'shoes');
INSERT INTO public.services (id, name, price, is_active, description, category) OVERRIDING SYSTEM VALUE VALUES (8, 'Woman Shoes', 39000.00, true, 'Pengerjaan 4 hari', 'shoes');
INSERT INTO public.services (id, name, price, is_active, description, category) OVERRIDING SYSTEM VALUE VALUES (10, 'Bag > 45cm', 84000.00, true, 'Pencucian tas bahan non leather', 'bag');
INSERT INTO public.services (id, name, price, is_active, description, category) OVERRIDING SYSTEM VALUE VALUES (11, 'Bag < 45cm', 59000.00, true, 'Pencucian tas bahan non leather', 'bag');
INSERT INTO public.services (id, name, price, is_active, description, category) OVERRIDING SYSTEM VALUE VALUES (9, 'Suitcase < 22"', 89000.00, true, 'Pencucian koper/suitcase', 'bag');
INSERT INTO public.services (id, name, price, is_active, description, category) OVERRIDING SYSTEM VALUE VALUES (7, 'Suitcase > 24"', 109000.00, true, 'Pengerjaan 2 hari', 'bag');
INSERT INTO public.services (id, name, price, is_active, description, category) OVERRIDING SYSTEM VALUE VALUES (3, 'Express', 49000.00, true, 'Pencucian sepatu selesai 12 jam', 'addon');
INSERT INTO public.services (id, name, price, is_active, description, category) OVERRIDING SYSTEM VALUE VALUES (4, 'One Day Service', 19000.00, true, 'Pencucian 24 jam selesai', 'addon');
INSERT INTO public.services (id, name, price, is_active, description, category) OVERRIDING SYSTEM VALUE VALUES (5, 'Whitening/Hard', 19000.00, true, 'Disertai treatment Deep Clean. Whitening: pemutihan bagian upper sepatu bahan canvas/mesh. Hard: pembersihan noda berlebih, berlumpur', 'addon');


--
-- Name: services_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.services_id_seq', 11, true);


--
-- PostgreSQL database dump complete
--

\unrestrict IevHFkvTBPwSJYeXnthUkFbttAK5RUfH310VGllhlS1Buu7N1zjh8daXe8o9gfx

