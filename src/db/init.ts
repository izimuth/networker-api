
import 'dotenv/config';
import sql from "./sql";

async function initDb()
{
	try
	{
		// delete migration table if present
		await sql`DROP TABLE IF EXISTS db_migrations;`

		// create migration tracking table
		await sql`
			CREATE TABLE IF NOT EXISTS db_migrations (
				id SERIAL PRIMARY KEY,
				notes TEXT,
				number BIGINT
			);
		`;

		console.log('Database initialized');
	}
	finally
	{
		await sql.end();
	}
}

initDb();

