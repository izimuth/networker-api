
import express from 'express';
import bcrypt from 'bcrypt';
import sql from '../db/sql';
import { User, UserField, getUserJson } from '../users';
import { DeleteObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { UploadedFile } from 'express-fileupload';

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
		let following = false;

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

				// is auth'd user following the requested one?
				following = req.user!.following.includes(user.id.toString());
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
		const fields = await sql<UserField[]>`SELECT * FROM user_fields WHERE user_id = ${user!.id} ORDER BY field_name ASC`;

		// get follower count
		const numFollowers = await sql`SELECT COUNT(*) AS num_followers FROM users WHERE ${user!.id} = ANY(following)`;

		res.send({ 
			profile: { 
				...getUserJson(user!), 
				fields,
				num_followers: numFollowers[0]?.num_followers ?? 0,
				num_following: user!.following.length,
			},
			followed: following 
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
		const fields = [];//'display_name', 'is_visible'];

		// add password to update if specified
		if (data.password)
		{
			data.password = bcrypt.hashSync(data.password, 10);
			fields.push('password');
		}

		if (data.display_name)
			fields.push('display_name');

		if (data.is_visible !== undefined)
			fields.push('is_visible');

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

// retrieve a field
router.get('/fields/:id', async (req, res, next) => {
	try
	{
		const [field]: UserField[] = await sql<UserField[]>`
			SELECT * FROM user_fields WHERE id = ${req.params.id} AND user_id = ${req.user!.id}
		`;

		if (field)
		{
			res.send({ field });
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

// upload an avatar
router.post('/photo', async (req, res, next) => {
	try
	{
		if (!req.files?.photo)
			throw new Error('No file specified');

		const photoFile = req.files!.photo! as UploadedFile;

		const s3Client = new S3Client({
			region: process.env.AWS_REGION!,
			credentials: {
				accessKeyId: process.env.AWS_ACCESS_KEY!,
				secretAccessKey: process.env.AWS_SECRET_KEY!
			}
		});

		const bucket = process.env.AWS_S3_BUCKET!;
		const key = `avatars/${req.user!.shareable_code}/${photoFile.name}`;

		// delete previous avatar if present
		const prev = req.user!.avatar_file;
		if (prev)
		{
			await s3Client.send(
				new DeleteObjectCommand({
					Bucket: bucket,
					Key: req.user!.avatar_file,
				})
			);
		}

		// upload new avatar to S3
		await s3Client.send(
			new PutObjectCommand({
				Bucket: bucket,
				Key: key,
				Body: photoFile.data,
				ContentType: photoFile.mimetype,
			})
		);

		// update user record
		await sql`UPDATE users SET avatar_file = ${key} WHERE id = ${req.user!.id}`;

		res.status(204);
		res.end();
	}
	catch(err)
	{
		next(err);
	}
});

// delete avatar
router.delete('/photo', async (req, res, next) => {
	try
	{
		// make sure there is an avatar file to delete
		if (req.user!.avatar_file)
		{
			const s3Client = new S3Client({
				region: process.env.AWS_REGION!,
				credentials: {
					accessKeyId: process.env.AWS_ACCESS_KEY!,
					secretAccessKey: process.env.AWS_SECRET_KEY!
				}
			});

			const bucket = process.env.AWS_S3_BUCKET!;

			// delete from aws
			await s3Client.send(
				new DeleteObjectCommand({
					Bucket: bucket,
					Key: req.user!.avatar_file,
				})
			);

			// update user record
			await sql`UPDATE users SET avatar_file = '' WHERE id = ${req.user!.id}`;
		}

		// we're done!
		res.status(204);
		res.end();
	}
	catch(err)
	{
		next(err);
	}
});

// add a user to following list
router.post('/followers', async (req, res, next) => {
	try
	{
		// get user with matching id
		const { id }: { id: number } = req.body;
		const [user]: [User?] = await sql`SELECT * FROM users WHERE id = ${id}`;

		// if user not found then return error
		if (!user)
		{
			res.status(404);
			res.send({ error: 'User not found' });
			return;
		}

		// otherwise if not already in the list add to following
		if (!req.user!.following.includes(id.toString()))
		{
			const updated = [...req.user!.following, id];
			
			await sql`UPDATE users SET following = ${updated} WHERE id = ${req.user!.id}`;
		}
		
		res.status(204);
		res.end();
	}
	catch(err)
	{
		next(err);
	}
});

// remove a follower from following list
router.delete('/followers/:id', async (req, res, next) => {
	try
	{
		const updated = [...req.user!.following];
		const pos = updated.indexOf(req.params.id);

		// if id is present in following list then remove it and update user
		if (pos >= 0)
		{
			updated.splice(pos, 1);
			await sql`UPDATE users SET following = ${updated} WHERE id = ${req.user!.id}`;
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