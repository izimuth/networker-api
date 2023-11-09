
import 'dotenv/config';

import express from 'express';

import './types';
import auth from './api/auth';
import profile from './api/profile';
import { authMiddleware } from './users';
import sql from './db/sql';

const app = express();

app.use(express.urlencoded());
app.use(express.json());
app.use(auth);
app.use('/profile', authMiddleware, profile);

app.get('/', (req, res) => {
	res.send({ hello: 'world' });
});

app.listen(3000);

