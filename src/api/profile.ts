
import express from 'express';
import bcrypt from 'bcrypt';
import sql from '../db/sql';
import { User, UserField, getUserJson } from '../users';

const router = express.Router();

interface UpdateProfileFields
{
	display_name: string;
	is_visible: string | boolean;
	password?: string;
}


// retrieve user profile
router.get('/:id', async (req, res, next) => {
	try
	{
		let user: User | undefined;

		// if the id is self then just use the currently authenticated user
		if (req.params.id == 'self')
		{
			user = req.user!;
		}
		// otherwise look for a user with a matching public code
		else
		{
			// pull user based on code
			const result = await sql<User[]>`SELECT * FROM users WHERE is_visible = 't' AND is_active = 't' AND shareable_code = ${req.params.id}`;

			// if found use that result
			if (result.length > 0)
			{
				user = result[0];
			}
			// otherwise return 404
			else
			{
				res.status(404);
				res.send({ error: 'User not found' });
				return;
			}
		}

		// get user fields
		const fields = await sql<UserField[]>`SELECT * FROM user_fields WHERE user_id = ${user.id} ORDER BY field_name ASC`;

		res.send({ 
			profile: { ...getUserJson(user), fields }
		});
	}
	catch(err)
	{
		next(err);
	}
});

// update authenticated user's profile
router.post('/', async (req, res, next) => {
	try
	{
		const data: UpdateProfileFields = req.body;
		const fields = ['display_name', 'is_visible'];

		// force visibility to boolean value so that it properly updates below
		data.is_visible = data.is_visible === 'true';

		// add password to update if specified
		if (data.password)
		{
			data.password = bcrypt.hashSync(data.password, 10);
			fields.push('password');
		}

		// update user
		// @ts-ignore
		await sql`UPDATE users SET ${sql(data, fields)} WHERE id = ${req.user!.id}`;

		// we're done!
		res.status(204);
		res.end();
	}
	catch(err)
	{
		next(err);
	}
});

// create a new field
router.post('/fields', async (req, res, next) => {
	try
	{
		const data: Partial<UserField> = req.body;

		// create field
		await sql`INSERT INTO user_fields ${
			sql({ ...data, user_id: req.user!.id }, 'user_id', 'field_content', 'field_icon_type', 'field_name')
		}`;

		res.status(204);
		res.end();
	}
	catch(err)
	{
		next(err);
	}
});

// update existing field
router.put('/fields/:id', async (req, res, next) => {
	try
	{
		const data: Partial<UserField> = req.body;
		const [field]: [UserField?] = await sql`SELECT * FROM user_fields WHERE id = ${req.params.id} AND user_id = ${req.user!.id}`;

		if (field)
		{
			// update field
			await sql`UPDATE user_fields SET ${
				sql(data, 'field_content', 'field_icon_type', 'field_name')
			} WHERE id = ${field.id}`;

			res.status(204);
			res.end();
		}
		else
		{
			res.status(404);
			res.send({ error: 'Field not found' });
		}
	}
	catch(err)
	{
		next(err);
	}
});

// delete field
router.delete('/fields/:id', async (req, res, next) => {
	try
	{
		await sql`DELETE FROM user_fields WHERE id = ${req.params.id} AND user_id = ${req.user!.id}`;

		res.status(204);
		res.end();
	}
	catch(err)
	{
		next(err);
	}
});

export default router;