
import express from 'express';
import sql from '../db/sql';
import { DeleteObjectCommand, S3Client } from '@aws-sdk/client-s3';

const router = express.Router();

async function deleteAvatar(key: string)
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
			Key: key,
		})
	);
}

router.get('/account', async (req, res, next) => {
	try
	{
		// delete avatar image if present
		if (req.user!.avatar_file)
		{
			await deleteAvatar(req.user!.avatar_file);
		}

		// delete auth tokens
		await sql`DELETE FROM user_auth_tokens WHERE user_id = ${req.user!.id}`;
		
		// delete fields
		await sql`DELETE FROM user_fields WHERE user_id = ${req.user!.id}`;

		// delete user record
		await sql`DELETE FROM users WHERE id = ${req.user!.id}`;

		res.status(204);
		res.end();
	}
	catch(err)
	{
		next(err);
	}
});

export default router;