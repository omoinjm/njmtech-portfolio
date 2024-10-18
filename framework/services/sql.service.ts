import { seed } from "@/lib/seed";
import { sql } from "@vercel/postgres";

export async function getList(tblName: string) {
   try {
      const data = await sql.query(`SELECT * FROM ${tblName}`);

      return data.rows;

   } catch (err: any) {
      handleError(err, tblName)
   }
}

export async function getRecord(tblName: string) {
   try {
      const data = await sql.query(`SELECT * FROM ${tblName}`);

      return data.rows[0];

   } catch (err: any) {
      handleError(err, tblName)
   }
}


async function handleError(err: any, tblName: string) {
   if (err.message.includes(`relation "${tblName}" does not exist`)) {

      console.log('Table does not exist, creating and seeding it with dummy data now...');

      // Table is not created yet
      await seed();

      const data = await sql.query(`SELECT * FROM ${tblName}`);

      return data.rows
   } else {
      throw err
   }
}