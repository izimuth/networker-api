
import express from 'express';
import bcrypt from 'bcrypt';

import { PasswordResetToken, User, isValidPassword } from '../users';
import sql from '../db/sql';

const router = express.Router();

function createCode(length: number, chars: string)
{
	let code = '';

	for(let i=0; i<length; i++)
	{
		let pos = Math.round(Math.random() * (chars.length-1));
		code += chars[pos];
	}

	return code;
}

// create a reset token for a user with the given email address
router.post('/request_reset_token', async (req, res, next) => {
	try
	{
		const { email } = req.body;
		const [user]: [User?] = await sql`SELECT * FROM users WHERE email = ${email} AND is_active = 't'`;

		if (user)
		{
			// create reset token
			const code = createCode(6, '0123456789');
			const expiresAfter = Date.now() + 300000;

			await sql`
				INSERT INTO reset_tokens (user_id, token_value, expires_after) 
				VALUES (${user.id}, ${code}, ${expiresAfter})
			`;

			res.send({ success: true });
		}
		else
		{
			res.send({ success: false, error: 'No user found with that email address' });
		}
	}
	catch(err)
	{
		next(err);
	}
});

// reset a user's password
router.post('/reset_password', async (req, res, next) => {
	try
	{
		const { email, code, password } = req.body;
		const [user]: [User?] = await sql`SELECT * FROM users WHERE email = ${email} AND is_active = 't'`;

		// make sure a valid user was found
		if (!user)
		{
			res.send({ success: false, error: 'Invalid email or reset code' });
			return;
		}

		// validate the supplied reset code
		const [token]: [PasswordResetToken?] = await sql`
			SELECT * FROM reset_tokens WHERE user_id = ${user.id} AND token_value = ${code}
		`;

		// if invalid or expired return false
		if (!token || token.expires_after <= Date.now())
		{
			res.send({ success: false, error: 'Invalid email or reset code' });
			return;
		}

		// make sure password is valid
		if (!isValidPassword)
		{
			res.send({ success: false, error: 'Invalid password' });
			return;
		}

		// finally reset the password
		const hashed = bcrypt.hashSync(password, 10);
		await sql`UPDATE users SET password = ${hashed} WHERE user_id = ${user.id}`;

		res.status(204);
		res.end();
	}
	catch(err)
	{
		next(err);
	}
});


export default router;