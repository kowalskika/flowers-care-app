import express, { json } from 'express';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';

import 'express-async-errors';

import { handleError } from './utils/errors';
import { homeRouter } from './routes/home.router';
import { flowerRouter } from './routes/flower.router';
import { rateLimiter } from './middleware/rateLimiter';
import { corsCfg } from './middleware/corsCfg';
import { credentials } from './middleware/credentials';

const app = express();

app
  .use(cookieParser())
  .use(credentials)
  .use(corsCfg)
  .use(json())
  .use(rateLimiter)
  .use(morgan('dev'))
  .use(handleError);

app
  .use('/', homeRouter)
  .use('/flower', flowerRouter);

app.listen(3001, () => console.log('listening on port http://localhost:3001'));
