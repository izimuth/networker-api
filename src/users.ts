import bcrypt from 'bcrypt';
import { v4 as uuid } from 'uuid';
import { NextFunction, Request, Response } from 'express';

import sql from './db/sql';

export interface User
{
	id: number;
	display_name: string;
	email: string;
	password: string;
	shareable_code: string;
	is_visible: boolean;
	is_active: boolean;
}

export interface UserAuthToken
{
	id: number;
	user_id: number;
	token_value: string;
	expires_after: number;
}

export interface UserField
{
	id: number;
	user_id: number;
	field_icon_type: string;
	field_name: string;
	field_content: string;
}

export async function createUser(user: User)
{
	user.password = bcrypt.hashSync(user.password, 10);

	const result = await sql<User[]>`
		INSERT INTO users (email, password, display_name) VALUES (${user.email}, ${user.password}, ${user.display_name})
	`;

	return user;
}

export async function createAuthToken(user: User): Promise<string>
{
	const tokenValue = uuid();
	const expires = Date.now() + (86400*7*1000);

	await sql`INSERT INTO user_auth_tokens (user_id, token_value, expires_after) VALUES (${user.id}, ${tokenValue}, ${expires})`;

	return tokenValue;
}

export async function getUserById(id: number)
{
	const [user]: [User?] = await sql`SELECT * FROM users WHERE id = ${id}`;

	return user;
}

export function getUserJson(user: User): Partial<User>
{
	return {
		id: user.id,
		display_name: user.display_name,
		email: user.email,
		is_visible: user.is_visible,
		is_active: user.is_active,
		shareable_code: user.shareable_code,
	}
}

export async function authMiddleware(req: Request, res: Response, next: NextFunction)
{
	const now = Date.now();

	// look for authorization header
	if (!req.headers.authorization)
	{
		res.status(403);
		res.send({ error: 'No authorization header' });
		return;
	}

	// get auth token from header
	const [type, token] = req.headers.authorization.trim().split(/\s+/);

	// type must be bearer
	if (type.toLowerCase() != 'bearer')
	{
		res.status(400);
		res.send({ error: `Invalid authorization type: ${type}` });
		return;
	}

	// get auth token
	const [authToken]: [UserAuthToken?] = await sql`SELECT * FROM user_auth_tokens WHERE token_value = ${token}`;

	// validate token
	if (authToken && now < authToken.expires_after)
	{
		// get user
		const user = await getUserById(authToken.user_id);

		// make sure user record exists and is set to active
		if (!user || !user.is_active)
		{
			res.status(400);
			res.send({ error: 'Invalid user' });
			return;
		}

		// add user and token to request
		req.user = user;
		req.authToken = authToken;

		// continue with request
		next();
	}
	else
	{
		res.status(403);
		res.send({ error: 'Auth token expired or invalid' });		
	}
}