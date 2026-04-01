import { logger } from '@/utils/logger';
import { sql } from '@/lib/neon-client';

export async function seed() {
	try {
		await sql.transaction(async (tx) => {
			//#region Menu
			await tx`
				CREATE TABLE IF NOT EXISTS nav_menu (
					id SERIAL PRIMARY KEY,
					name VARCHAR(255) NOT NULL,
					icon VARCHAR(255),
					route_url VARCHAR(255) NOT NULL UNIQUE,
					is_active BOOLEAN NOT NULL DEFAULT FALSE,
					sort_order INT NOT NULL,
					createdAt TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
				)`;
			logger.info(`Created "nav_menu" table`);

			await tx`INSERT INTO nav_menu (name, icon, route_url, is_active, sort_order) VALUES ('Projects', 'bi bi-window', '/projects', true, 1) ON CONFLICT (route_url) DO NOTHING`;
			await tx`INSERT INTO nav_menu (name, icon, route_url, is_active, sort_order) VALUES ('Contact', 'bi bi-telephone', '/contact', true, 2) ON CONFLICT (route_url) DO NOTHING`;
			await tx`INSERT INTO nav_menu (name, icon, route_url, is_active, sort_order) VALUES ('Subscribe', 'bi bi-pen', '/subscribe', true, 3) ON CONFLICT (route_url) DO NOTHING`;
			logger.info(`Seeded menu items`);
			//#endregion

			//#region Footer
			await tx`
				CREATE TABLE IF NOT EXISTS nav_footer (
					id SERIAL PRIMARY KEY,
					name VARCHAR(255) NOT NULL,
					icon VARCHAR(255),
					route_url VARCHAR(255) NOT NULL UNIQUE,
					is_active BOOLEAN NOT NULL DEFAULT FALSE,
					sort_order INT NOT NULL,
					createdAt TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
				)`;
			logger.info(`Created "nav_footer" table`);

			await tx`INSERT INTO nav_footer (name, icon, route_url, is_active, sort_order) VALUES ('LinkedIn', 'https://res.cloudinary.com/dfta3fn6p/image/upload/v1676064212/public/logo/nav-icon1_dx8dcr.svg', 'https://www.linkedin.com/in/njmalaza', true, 1) ON CONFLICT (route_url) DO NOTHING`;
			await tx`INSERT INTO nav_footer (name, icon, route_url, is_active, sort_order) VALUES ('Facebook', 'https://res.cloudinary.com/dfta3fn6p/image/upload/v1676064213/public/logo/nav-icon2_j3cdqp.svg', 'https://www.facebook.com/', true, 2) ON CONFLICT (route_url) DO NOTHING`;
			await tx`INSERT INTO nav_footer (name, icon, route_url, is_active, sort_order) VALUES ('Instagram', 'https://res.cloudinary.com/dfta3fn6p/image/upload/v1676064213/public/logo/nav-icon3_k4zon2.svg', 'https://www.instagram.com/nhlanhlamalaza_', true, 3) ON CONFLICT (route_url) DO NOTHING`;
			logger.info(`Seeded footer items`);
			//#endregion

			//#region Mail Template
			await tx`
				CREATE TABLE IF NOT EXISTS mail_template (
					id SERIAL PRIMARY KEY,
					code VARCHAR(255) NOT NULL UNIQUE,
					name VARCHAR(255) NOT NULL,
					html_file_name VARCHAR(255) NOT NULL,
					send_to_email VARCHAR(255)
				)`;
			logger.info(`Created "mail_template" table`);

			await tx`INSERT INTO mail_template (code, name, html_file_name, send_to_email) VALUES ('GEN', 'General', '', 'njmcloud@gmail.com') ON CONFLICT (code) DO NOTHING`;
			logger.info(`Seeded mail template items`);
			//#endregion
		});

		logger.info('Seed completed successfully');
	} catch (error) {
		logger.error('Seed error', error);
		throw error;
	}
}

