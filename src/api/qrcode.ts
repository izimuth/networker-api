
import express from 'express';
import QRCode from 'qrcode';

import sql from '../db/sql';
import { User } from '../users';

const router = express.Router();

router.get('/:code', async (req, res, next) => {
	try
	{
		// get user by their shareable code
		const [user]: [User?] = await sql`SELECT * FROM users WHERE shareable_code = ${req.params.code} AND is_active = 't' AND is_visible = 't' LIMIT 1`;

		if (user)
		{
			const url = `${process.env.QRCODE_LINK_URL}/${user.shareable_code}`;
			const qr = await QRCode.toString(url, { type: 'svg', margin: 1 });

			res.header('content-type', 'image/svg+xml');
			res.send(qr);
		}
		else
		{
			res.status(404);
			res.send({ error: 'User not found' });
		}
	}
	catch(err)
	{
		next(err);
	}
});

export default router;