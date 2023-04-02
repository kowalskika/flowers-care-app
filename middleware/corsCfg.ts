import cors from 'cors';
import { config } from '../config/config';

export const corsCfg = cors({
  origin: config.corsOrigin,
});
