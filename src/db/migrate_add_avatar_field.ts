
import sql from "./sql"

export default {
	notes: 'Add avatar field to user table',
	
	async up() {
		// add sql for new database features here
		await sql`ALTER TABLE users ADD COLUMN avatar_file TEXT`;
	},

	async down() {
		// add sql to remove added database functions here
		await sql`ALTER TABLE users DROP COLUMN IF EXISTS avatar_file`;
	}
}