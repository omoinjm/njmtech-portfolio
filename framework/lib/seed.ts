import { sql } from "@vercel/postgres";
import { logger } from "@/utils/logger";

export async function seed() {
  //#region Menu

  const menuTable = await sql`
   CREATE TABLE IF NOT EXISTS nav_menu (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      icon VARCHAR(255),
      route_url VARCHAR(255) NOT NULL,
      is_active BOOLEAN NOT NULL DEFAULT FALSE,
      sort_order INT NOT NULL,
      createdAt TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
     `;

  logger.info(`Created "nav_menu" table`);

  const menu = await Promise.all([
    sql`
         INSERT INTO nav_menu 
         (name, icon, route_url, is_active, sort_order)
         VALUES 
         ('Projects', 'bi bi-window', '/projects', true, 1)
         ON CONFLICT (route_url) DO NOTHING;
         `,
    sql`
         INSERT INTO nav_menu 
         (name, icon, route_url, is_active, sort_order)
         VALUES 
         ('Contact', 'bi bi-telephone', '/contact', true, 2)
         ON CONFLICT (route_url) DO NOTHING;
         `,
    sql`
         INSERT INTO nav_menu 
         (name, icon, route_url, is_active, sort_order)
         VALUES 
         ('Subscribe', 'bi bi-pen', '/subscribe', true, 3)
         ON CONFLICT (route_url) DO NOTHING;
         `,
  ]);

  logger.info(`Seeded ${menu.length} menu items`);

  //#endregion

  //#region Footer

  const footerTable = await sql`
   CREATE TABLE IF NOT EXISTS nav_footer (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      icon VARCHAR(255),
      route_url VARCHAR(255) NOT NULL,
      is_active BOOLEAN NOT NULL DEFAULT FALSE,
      sort_order INT NOT NULL,
      createdAt TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
     `;

  logger.info(`Created "nav_footer" table`);

  const footer = await Promise.all([
    sql`
         INSERT INTO nav_footer 
         (name, icon, route_url, is_active, sort_order)
         VALUES 
         ('LinkedIn', 'https://res.cloudinary.com/dfta3fn6p/image/upload/v1676064212/public/logo/nav-icon1_dx8dcr.svg', 'https://www.linkedin.com/in/njmalaza', true, 1)
         ON CONFLICT (route_url) DO NOTHING;
         `,
    sql`
         INSERT INTO nav_footer 
         (name, icon, route_url, is_active, sort_order)
         VALUES
         ('Facebook', 'https://res.cloudinary.com/dfta3fn6p/image/upload/v1676064213/public/logo/nav-icon2_j3cdqp.svg', 'https://www.facebook.com/', true, 2),
         ON CONFLICT (route_url) DO NOTHING;
         `,
    sql`
         INSERT INTO nav_footer 
         (name, icon, route_url, is_active, sort_order)
         VALUES
         ('Instagram', 'https://res.cloudinary.com/dfta3fn6p/image/upload/v1676064213/public/logo/nav-icon3_k4zon2.svg', 'https://www.instagram.com/nhlanhlamalaza_', true, 3);
         ON CONFLICT (route_url) DO NOTHING;
         `,
  ]);

  logger.info(`Seeded ${footer.length} footer items`);

  //#endregion

  //#region Mail Template

  const mailTemplateTable = await sql`
   CREATE TABLE IF NOT EXISTS mail_template (
      id SERIAL PRIMARY KEY,
      code VARCHAR(255) NOT NULL,
      name VARCHAR(255) NOT NULL,
      html_file_name VARCHAR(255) NOT NULL,
      send_to_email VARCHAR(255)
      );
     `;

  logger.info(`Created "mail_template" table`);

  const template = await Promise.all([
    sql`
         INSERT INTO mail_template
         (code, name, html_file_name, send_to_email)
         VALUES 
         ('GEN', 'General', '', 'njmcloud@gmail.com')
         ON CONFLICT (route_url) DO NOTHING;
         `,
  ]);

  logger.info(`Seeded ${template.length} mail template items`);

  //#endregion
}
