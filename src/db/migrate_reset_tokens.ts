
import sql from "./sql"

export default {
	notes: 'Add password reset token tables',
	
	async up() {
		await sql`
			CREATE TABLE IF NOT EXISTS reset_tokens (
				id SERIAL PRIMARY KEY,
				user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
				token_value VARCHAR(20),
				expires_after BIGINT
			)
		`;
	},

	async down() {
		await sql`DROP TABLE IF EXISTS reset_tokens`;
	}
}