
import sql from "./sql"

export default {
	notes: 'Create user related tables',
	
	async up() {
		// create users table
		await sql`
			CREATE TABLE IF NOT EXISTS users (
				id SERIAL PRIMARY KEY,
				email VARCHAR(60),
				password VARCHAR(255),
				display_name VARCHAR(50),
				shareable_code VARCHAR(255),
				is_visible BOOLEAN DEFAULT 't',
				is_active BOOLEAN DEFAULT 't',
				UNIQUE(email)
			)
		`;

		// create user fields
		await sql`
			CREATE TABLE IF NOT EXISTS user_fields (
				id SERIAL PRIMARY KEY,
				user_id BIGINT REFERENCES users (id) ON DELETE CASCADE,
				field_icon_type VARCHAR(50),
				field_name VARCHAR(100),
				field_content VARCHAR(500)
			)
		`;

		// create user auth token table
		await sql`
			CREATE TABLE IF NOT EXISTS user_auth_tokens (
				id SERIAL PRIMARY KEY,
				user_id INTEGER REFERENCES users (id) ON DELETE CASCADE,
				token_value VARCHAR(255),
				expires_after BIGINT
			)
		`;
	},

	async down() {
		// drop fields table
		await sql`DROP TABLE IF EXISTS user_fields`;
		
		// drop auth tokens table
		await sql`DROP TABLE IF EXISTS user_auth_tokens`;

		// drop users table
		await sql`DROP TABLE IF EXISTS users`;
	}
}