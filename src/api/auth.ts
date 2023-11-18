
import express from 'express';
import bcrypt from 'bcrypt';

import sql from '../db/sql';
import { User, authMiddleware, createAuthToken } from '../users';

const router = express.Router();

router.post('/login', async (req, res, next) => {
	try
	{
		const email = req.body.email;
		const password = req.body.password;

		// look for user with matching email address
		const [user]: [User?] = await sql`SELECT * FROM users WHERE email = ${email} LIMIT 1`;

		// verify password if found
		if (user && bcrypt.compareSync(password, user.password))
		{
			// create auth token
			const token = await createAuthToken(user);

			res.send({ success: true, token, user });
		}
		else
		{
			res.send({ success: false });
		}
	}
	catch(err)
	{
		next(err);
	}
});

router.post('/create', async (req, res, next) => {
	try
	{
		let { display_name, email, password } = req.body;

		password = bcrypt.hashSync(password, 10);

		await sql`
			INSERT INTO users (email, password, display_name, shareable_code, is_visible, is_active) 
			VALUES (
				${email},
				${password},
				${display_name},
				gen_random_uuid(),
				'f',
				't'
			)
		`;

		res.status(204);
		res.end();
	}
	catch(err)
	{
		next(err);
	}
});

router.post('/logout', authMiddleware, async (req, res, next) => {
	try
	{
		const fromAll = req.body.fromAll === 'yes';

		// delete the current auth token
		await sql`DELETE FROM user_auth_tokens WHERE token_value = ${req.authToken!.token_value}`;

		// sign out from any other device as well
		if (fromAll)
		{
			await sql`DELETE FROM user_auth_tokens WHERE user_id = ${req.authToken!.user_id}`;
		}

		res.status(204);
		res.end();
	}
	catch(err)
	{
		next(err);
	}
});

export default router;