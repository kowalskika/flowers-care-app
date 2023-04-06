import express, { json, urlencoded } from 'express';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';

import 'express-async-errors';

import { handleError } from './utils/errors';
import { rateLimiter } from './middleware/rateLimiter';
import { credentials } from './middleware/credentials';
import { corsConfig } from './config/cors.config';
import { homeRouter } from './routes/home.router';
import { flowerRouter } from './routes/flower.router';
import { userRouter } from './routes/user.router';
import { sessionRouter } from './routes/session.router';
import { uploadRouter } from './routes/upload.router';

const app = express();

app
  .use(cookieParser())
  .use(credentials)
  .use(corsConfig)
  .use(json({ limit: '25mb' }))
  .use(urlencoded({ limit: '25mb' }))
  .use(rateLimiter)
  .use(morgan('dev'))
  .use(handleError);

app
  .use('/', homeRouter)
  .use('/flower', flowerRouter)
  .use('/user', userRouter)
  .use('/session', sessionRouter)
  .use('/upload', uploadRouter);

app.listen(3001, () => console.log('listening on port http://localhost:3001'));
