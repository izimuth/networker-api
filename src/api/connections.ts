
import express from 'express';
import { User } from '../users';
import sql from '../db/sql';

const router = express.Router();

router.get('/following', async (req, res, next) => {
	try
	{
		if (req.user!.following.length > 0)
		{
			const following: [User] = await sql`
				SELECT id, display_name, shareable_code, avatar_file FROM users 
				WHERE id = ANY(${req.user!.following}) AND is_active = 't' AND is_visible = 't'
				ORDER BY display_name ASC
			`;

			res.send({
				users: following
			})
		}
		else
		{
			res.send({ users: [] });
		}
	}
	catch(err)
	{
		next(err);
	}
});

router.get('/followers', async (req, res, next) => {
	try
	{
		const followers: [User] = await sql`
			SELECT id, display_name, shareable_code, avatar_file FROM users 
			WHERE ${req.user!.id} = ANY(following) AND is_active = 't' AND is_visible = 't'
			ORDER BY display_name ASC
		`;

		res.send({
			users: followers
		})
	}
	catch(err)
	{
		next(err);
	}
});

export default router;