import * as express from 'express';
import * as cors from 'cors';

import connectDB from './config/connect';
import router from './routes';

export const app = express();

app.use(cors());
app.use(express.json());

app.use(router);

app.use('/uploads', express.static('uploads'));

connectDB();

/** app.use abaixo: */
