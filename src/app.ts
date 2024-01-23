import express, { Express } from 'express';
import router from './routes/nodemailer.routes';

const app: Express = express();

app.use(express.json());

app.use('/api', router);

export default app;
