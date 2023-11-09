
import 'dotenv/config';
import bcrypt from 'bcrypt';
import { v4 as uuid } from 'uuid';
import { createInterface } from 'readline';

import sql from './sql';

const readline = createInterface({
	input: process.stdin,
	output: process.stdout
});

function getAnswerFor(query: string)
{
	return new Promise<string>((resolve, reject) => {
		readline.question(query, answer => {
			if (answer.trim())
			{
				resolve(answer);
			}
			else
			{
				reject(new Error('Value cannot be empty'));
			}
		});
	});
}

async function seedDb()
{
	try
	{
		const username = await getAnswerFor('Email address: ');
		const password = await getAnswerFor('Password: ');
		const displayName = await getAnswerFor('Display name: ');
		const code = uuid();

		const hashedPassword = bcrypt.hashSync(password, 10);

		await sql`INSERT INTO users (email, password, display_name, shareable_code) VALUES (${username}, ${hashedPassword}, ${displayName}, gen_random_uuid())`;

		console.log('User added');
	}
	finally
	{
		readline.close();
		await sql.end();
	}
}

seedDb();


