
import sql from "./sql"

export default {
	notes: 'Add following column to users table',
	
	async up() {
		await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS following BIGINT[] DEFAULT array[]::bigint[]`;
	},

	async down() {
		await sql`ALTER TABLE users DROP COLUMN IF EXISTS following`;
	}
}