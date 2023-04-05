import cors from 'cors';
import { config } from './config';

export const corsConfig = cors({
  origin: config.corsOrigin,
});
