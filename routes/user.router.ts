import { Router } from 'express';
import { compare } from 'bcrypt';

import { UserRecord } from '../records/user.record';
import { ValidationError } from '../utils/errors';
import { updateUserValidator } from '../utils/updateUserValidator';

export const userRouter = Router();

userRouter
  .post('/', async (req, res) => {
    const userReq = req.body as UserRecord;
    const user = new UserRecord(userReq);
    console.log(user);
    await user.insertNewUser();
    res.sendStatus(201);
  })

  .patch('/:userId', async (req, res) => {
    const { userId } = req.params;
    const { password, newPassword, newEmail } = req.body as { password: string, newEmail?: string, newPassword?: string };
    const user = await UserRecord.getUserById(userId);
    if (!user) throw new Error('No user with that id');
    const match = await compare(password, user.password);
    if (!match) {
      throw new ValidationError('Wrong password.');
    }
    if (newEmail) {
      if (user.email === newEmail) throw new ValidationError('You have already this email.');
      await updateUserValidator({ email: newEmail });
      user.email = newEmail;
      await user.updateUserData();
    } else if (newPassword) {
      if (await compare(newPassword, user.password)) {
        throw new ValidationError('You have already this password.');
      }
      await updateUserValidator({ password: newPassword });
      user.password = newPassword;
      await user.updateUserData(true);
    } else {
      throw new ValidationError('All data are required.');
    }
    res.sendStatus(200);
  })

  .delete('/:userId', async (req, res) => {
    const { userId } = req.params;
    const user = await UserRecord.getUserById(userId);
    await user.deleteUser();
    res.sendStatus(200);
  });
