import { logger } from '@/utils/logger';
import { Pool } from 'pg';

export async function seed(pool: Pool) {
	try {
		//#region Menu

		await pool.query(`
   CREATE TABLE IF NOT EXISTS nav_menu (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      icon VARCHAR(255),
      route_url VARCHAR(255) NOT NULL UNIQUE,
      is_active BOOLEAN NOT NULL DEFAULT FALSE,
      sort_order INT NOT NULL,
      createdAt TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
     `);

		logger.info(`Created "nav_menu" table`);

		// Add UNIQUE constraint if it doesn't exist (for existing tables)
		await pool.query(`ALTER TABLE nav_menu ADD CONSTRAINT IF NOT EXISTS nav_menu_route_url_key UNIQUE (route_url)`);

		// Seed menu items sequentially to avoid AggregateError
		await pool.query(`
         INSERT INTO nav_menu 
         (name, icon, route_url, is_active, sort_order)
         VALUES
         ('Projects', 'bi bi-window', '/projects', true, 1)
         ON CONFLICT (route_url) DO NOTHING;
         `);

		await pool.query(`
         INSERT INTO nav_menu 
         (name, icon, route_url, is_active, sort_order)
         VALUES
         ('Contact', 'bi bi-telephone', '/contact', true, 2)
         ON CONFLICT (route_url) DO NOTHING;
         `);

		await pool.query(`
         INSERT INTO nav_menu 
         (name, icon, route_url, is_active, sort_order)
         VALUES
         ('Subscribe', 'bi bi-pen', '/subscribe', true, 3)
         ON CONFLICT (route_url) DO NOTHING;
         `);

		logger.info(`Seeded menu items`);

		//#endregion

		//#region Footer

		await pool.query(`
   CREATE TABLE IF NOT EXISTS nav_footer (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      icon VARCHAR(255),
      route_url VARCHAR(255) NOT NULL UNIQUE,
      is_active BOOLEAN NOT NULL DEFAULT FALSE,
      sort_order INT NOT NULL,
      createdAt TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
     `);

		logger.info(`Created "nav_footer" table`);

		// Add UNIQUE constraint if it doesn't exist (for existing tables)
		await pool.query(`ALTER TABLE nav_footer ADD CONSTRAINT IF NOT EXISTS nav_footer_route_url_key UNIQUE (route_url)`);

		// Seed footer items sequentially
		await pool.query(`
         INSERT INTO nav_footer 
         (name, icon, route_url, is_active, sort_order)
         VALUES
         ('LinkedIn', 'https://res.cloudinary.com/dfta3fn6p/image/upload/v1676064212/public/logo/nav-icon1_dx8dcr.svg', 'https://www.linkedin.com/in/njmalaza', true, 1)
         ON CONFLICT (route_url) DO NOTHING;
         `);

		await pool.query(`
         INSERT INTO nav_footer 
         (name, icon, route_url, is_active, sort_order)
         VALUES
         ('Facebook', 'https://res.cloudinary.com/dfta3fn6p/image/upload/v1676064213/public/logo/nav-icon2_j3cdqp.svg', 'https://www.facebook.com/', true, 2)
         ON CONFLICT (route_url) DO NOTHING;
         `);

		await pool.query(`
         INSERT INTO nav_footer 
         (name, icon, route_url, is_active, sort_order)
         VALUES
         ('Instagram', 'https://res.cloudinary.com/dfta3fn6p/image/upload/v1676064213/public/logo/nav-icon3_k4zon2.svg', 'https://www.instagram.com/nhlanhlamalaza_', true, 3)
         ON CONFLICT (route_url) DO NOTHING;
         `);

		logger.info(`Seeded footer items`);

		//#endregion

		//#region Mail Template

		await pool.query(`
   CREATE TABLE IF NOT EXISTS mail_template (
      id SERIAL PRIMARY KEY,
      code VARCHAR(255) NOT NULL UNIQUE,
      name VARCHAR(255) NOT NULL,
      html_file_name VARCHAR(255) NOT NULL,
      send_to_email VARCHAR(255)
      );
     `);

		logger.info(`Created "mail_template" table`);

		// Add UNIQUE constraint if it doesn't exist (for existing tables)
		await pool.query(`ALTER TABLE mail_template ADD CONSTRAINT IF NOT EXISTS mail_template_code_key UNIQUE (code)`);

		await pool.query(`
         INSERT INTO mail_template
         (code, name, html_file_name, send_to_email)
         VALUES
         ('GEN', 'General', '', 'njmcloud@gmail.com')
         ON CONFLICT (code) DO NOTHING;
         `);

		logger.info(`Seeded mail template items`);

		//#endregion
	} catch (error) {
		logger.error('Seed error', error);
		throw error;
	}
}
