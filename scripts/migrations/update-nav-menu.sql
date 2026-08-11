-- Refresh header nav to match current site routes (run once on D1).
-- SQLite / D1: is_active 1 = true

DELETE FROM nav_menu;

INSERT INTO nav_menu (name, icon, route_url, is_active, sort_order) VALUES
  ('Services', '', '/services', 1, 1),
  ('Projects', '', '/work', 1, 2),
  ('About',    '', '/about',    1, 3),
  ('Blog',     '', '/blog',     1, 4),
  ('Contact',  '', '/contact',  1, 5);
