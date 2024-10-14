import { seed } from "@/lib/seed";
import { sql } from "@vercel/postgres";

export default async function getNavigation(tableName: string) {

   try {
      const query = `SELECT * FROM ${tableName}`;
      const data = await sql.query(query);

      return data.rows;

   } catch (e: any) {
      if (e.message.includes(`relation "${tableName}" does not exist`)) {
         console.log(
            'Table does not exist, creating and seeding it with dummy data now...'
         )

         // Table is not created yet
         await seed();

         const query = `SELECT * FROM ${tableName}`;
         const data = await sql.query(query);

         return data.rows
      } else {
         throw e
      }
   }
}
