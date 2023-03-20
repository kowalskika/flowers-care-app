import express, { json } from 'express';
import fileUpload from 'express-fileupload';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import 'express-async-errors';
import { config } from './config/config';
import { handleError } from './utils/errors';
import { homeRouter } from './routes/home';
import { flowerRouter } from './routes/flower';

const app = express();
app
  .use(cors({
    origin: config.corsOrigin,
  }))
  .use(json())
  .use(rateLimit({
    windowMs: 5 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
  }))
  .use(fileUpload())
  .use(handleError);

app
  .use('/', homeRouter)
  .use('/flower', flowerRouter);

app.listen(3001, () => console.log('listening on port http://localhost:3001'));
