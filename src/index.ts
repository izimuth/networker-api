
import 'dotenv/config';

import express from 'express';
import fileUpload from 'express-fileupload';

import './types';
import sql from './db/sql';
import auth from './api/auth';
import profile from './api/profile';
import qrcode from './api/qrcode';
import connections from './api/connections';
import deleteAccount from './api/delete';
import passwordRecovery from './api/password-recovery';
import profileWeb from './web/profile';
import { authMiddleware } from './users';

const app = express();

app.use('/static', express.static('static'));
app.use(express.urlencoded());
app.use(express.json());
app.use(fileUpload({
	// useTempFiles: true,
	// tempFileDir: '/tmp/'
}));

app.use('/auth', auth);
app.use('/getqrcode', qrcode);
app.use('/recovery', passwordRecovery);

app.use('/profile', authMiddleware, profile);
app.use('/connections', authMiddleware, connections);
app.use('/delete', authMiddleware, deleteAccount);

app.use('/qrcode', profileWeb);

app.listen(parseInt(process.env.EXPRESS_PORT!, 10));

