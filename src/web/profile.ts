
import express from 'express';
import fs from 'fs/promises';
import path from 'path';

import { User } from '../users';
import sql from '../db/sql';

const router = express.Router();

router.get('/:id', async (req, res, next) => {
	try
	{
		// get user with matching code
		const [user]: [User?] = await sql`SELECT * FROM users WHERE shareable_code = ${req.params.id} AND is_active = 't' AND is_visible = 't'`;

		if (user)
		{
			// get data to use
			const fields: Record<string, string> = {
				PROFILE_ID: user.id.toString(),
				PROFILE_DISPLAY_NAME: user.display_name,
				PROFILE_EMAIL: user.email,
				PROFILE_SHAREABLE_CODE: user.shareable_code,
				//PROFILE_AVATAR_FILE: user.avatar_file ? `https://${process.env.AWS_S3_BUCKET!}.s3.ca-central-1.amazonaws.com/${user.avatar_file}` : null,
			};

			if (user.avatar_file)
			{
				fields.PROFILE_AVATAR = `<img src="https://${process.env.AWS_S3_BUCKET!}.s3.ca-central-1.amazonaws.com/${user.avatar_file}">`;
			}
			else
			{
				fields.PROFILE_AVATAR = `<div class="avatar-text">${user.display_name.slice(0, 2).toUpperCase()}</div>`;
			}

			// load html template
			const template = await fs.readFile(`templates/profile.html`);
			let html = template.toString('utf-8');
			
			// replace data in template
			for(const key of Object.keys(fields)) 
			{
				const value = fields[key as keyof typeof fields].toString();
				html = html.replace(new RegExp(`\{${key}\}`, 'g'), value);
			}

			res.send(html);
		}
		else
		{
			res.status(404);
			res.send('Profile not found');
		}
	}
	catch(err)
	{
		console.log(err);
		res.status(500);
		res.send('A server error occurred');
	}
});

export default router;