import express, { json, Router } from 'express';
import fileUpload from 'express-fileupload';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import 'express-async-errors';


const app = express();
app
  .use(cors({
    origin: ['http://localhost:3000', 'http://192.168.100.39:3000',
    ],
  }))
  .use(json())
  .use(rateLimit({
    windowMs: 5 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
  }))
  .use(fileUpload());


app.listen(3001, () => console.log('listening on port http://localhost:3001'));
