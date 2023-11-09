
import express from 'express';
import bcrypt from 'bcrypt';

import sql from '../db/sql';
import { User, createAuthToken } from '../users';

const router = express.Router();

router.post('/authenticate', async (req, res, next) => {
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

			res.send({ sucess: true, token });
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

export default router;