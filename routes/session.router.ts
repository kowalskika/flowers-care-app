import { Router } from 'express';
import { compare } from 'bcrypt';
import { sign, verify } from 'jsonwebtoken';
import { UserRecord } from '../records/user.record';
import { ValidationError } from '../utils/errors';
import { config } from '../config/config';

export const sessionRouter = Router();

sessionRouter
  .post('/', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) throw new ValidationError('Email and password are required.');

    const user = await UserRecord.getUserByEmail(email);
    if (!user) throw new ValidationError('Wrong email or password');

    const match = await compare(password, user.password);
    if (!match) throw new ValidationError('Wrong email or password');

    const accessToken = sign({ id: user.id }, config.ACCESS_TOKEN_SECRET, { expiresIn: '15min' });
    const refreshToken = sign({ id: user.id }, config.REFRESH_TOKEN_SECRET, { expiresIn: '7d' });
    user.refreshToken = refreshToken;
    await user.updateUserData();
    res.cookie('__refresh', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: 1000 * 60 * 60 * 24 * 7,
    });
    res.json({ id: user.id, accessToken });
  });

sessionRouter
  .patch('/', async (req, res) => {
    try {
      const refreshToken = req.cookies.__refresh;
      if (!refreshToken) return res.sendStatus(401);

      const { id } = verify(refreshToken, config.REFRESH_TOKEN_SECRET) as { id: string };
      const user = await UserRecord.getUserById(id);
      if (!user) return res.sendStatus(403);

      const accessToken = sign({ id }, config.ACCESS_TOKEN_SECRET, { expiresIn: '15min' });
      user.refreshToken = sign({ id: user.id }, config.REFRESH_TOKEN_SECRET, { expiresIn: '7d' });
      await user.updateUserData();
      res.json(accessToken);
    } catch (e) {
      if (e.message === 'invalid token') {
        res.sendStatus(403);
      } else res.sendStatus(500);
    }
  });

sessionRouter
  .delete('/', async (req, res) => {
    const refreshToken = req.cookies.__refresh;
    if (!refreshToken) return res.sendStatus(200);

    const { id } = verify(refreshToken, config.REFRESH_TOKEN_SECRET) as { id: string };
    const user = await UserRecord.getUserById(id);
    if (!user) return res.sendStatus(200);

    user.refreshToken = null;
    await user.updateUserData();

    res.clearCookie('__refresh', {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: 1000 * 60 * 60 * 24 * 7,
    });
    res.sendStatus(200);
  });
