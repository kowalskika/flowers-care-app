import { ValidationError } from './errors';
import { ISO_MAIL_REGEX, UserRecord } from '../records/user.record';

export const updateUserValidator = async ({ email, password }: { email?: string, password?: string }) => {
  if (password) {
    if (password.length < 8) {
      throw new ValidationError('Password must be equal or longer than 8 characters.');
    }
    if (password.length > 100) {
      throw new ValidationError('Password is to long. Maximum characters for password is 100.');
    }
    if (!/[A-Z]/.test(password)) {
      throw new ValidationError('Password must contains at least one capital letter.');
    }
    if (!/[a-z]/.test(password)) {
      throw new ValidationError('Password must contains at least one normal letter.');
    }
    if (!/\d/.test(password)) {
      throw new ValidationError('Password must contains at least one number.');
    }
    if (!/[?!@#$%]/.test(password)) {
      throw new ValidationError('Password must contains at least one special character: "?", "!", "@", "#", "$" or "%".');
    }
  } else if (email) {
    const existsUser = await UserRecord.getUserByEmail(email);
    if (existsUser) throw new ValidationError('Email is already taken.');
    if (!ISO_MAIL_REGEX.test(email)) {
      throw new ValidationError('Email is not valid. Type correct email.');
    }
  }
};
