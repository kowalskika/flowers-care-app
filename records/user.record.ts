import { v4 as uuid } from 'uuid';
import { hash, genSalt } from 'bcrypt';
import { FieldPacket } from 'mysql2';
import { pool } from '../utils/db';
import { UserEntity } from '../types';
import { ValidationError } from '../utils/errors';

export const ISO_MAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,63}$/;

type MysqlUsersResponse = [UserEntity[], FieldPacket[]];

export class UserRecord implements UserEntity {
  id?: string;
  email: string;
  password: string;
  refreshToken?: string;
  allowMail: string;

  constructor(obj: UserEntity) {
    this.id = obj.id;
    this.email = obj.email;
    this.password = obj.password;
    this.refreshToken = obj.refreshToken;
    this.allowMail = obj.allowMail;
    this.validate();
  }

  private validate() {
    if (!this.email) {
      throw new ValidationError('Email is required.');
    }
    if (!this.password) {
      throw new ValidationError('Password is required.');
    }
    if (!ISO_MAIL_REGEX.test(this.email)) {
      throw new ValidationError('Email is not valid. Type correct email.');
    }
    if (this.password.length < 8) {
      throw new ValidationError('Password must be equal or longer than 8 characters.');
    }
    if (this.password.length > 100) {
      throw new ValidationError('Password is to long. Maximum characters for password is 100.');
    }
    if (!/[A-Z]/.test(this.password)) {
      throw new ValidationError('Password must contains at least one capital letter.');
    }
    if (!/[a-z]/.test(this.password)) {
      throw new ValidationError('Password must contains at least one normal letter.');
    }
    if (!/\d/.test(this.password)) {
      throw new ValidationError('Password must contains at least one number.');
    }
    if (!/[?!@#$%]/.test(this.password)) {
      throw new ValidationError('Password must contains at least one special character: "?", "!", "@", "#", "$" or "%".');
    }
  }

  async insertNewUser() {
    try {
      this.id = uuid();
      this.allowMail = this.allowMail === 'true' ? this.allowMail : 'false';
      this.password = await hash(this.password, await genSalt(10));
      await pool.execute('INSERT INTO `users` (`id`, `email`, `password`, `allowMail`) VALUES (:id, :email, :password, :allowMail)', this);

      return this.id;
    } catch (e) {
      throw new ValidationError('Email is already in use.');
    }
  }

  async updateUserData(password?: boolean) {
    if (password) {
      this.password = await hash(this.password, await genSalt(10));
      await pool.execute('UPDATE `users` SET `email` = :email, `refreshToken` = :refreshToken, `password` = :password WHERE `id` = :id', this);
    } else {
      await pool.execute('UPDATE `users` SET `email` = :email, `refreshToken` = :refreshToken WHERE `id` = :id', this);
    }
  }

  async updateUserAllowMail(value: string) {
    await pool.execute('UPDATE `users` SET `allowMail` = :allowMail WHERE `id` = :id', {
      allowMail: `${value}`, id: this.id,
    });
  }

  async deleteUser() {
    await pool.execute('DELETE FROM `users` WHERE `id` = :id', { id: this.id });
  }

  static async getUserByEmail(email: string) {
    const [res] = await pool.execute('SELECT * FROM `users` WHERE `email` = :email', { email }) as MysqlUsersResponse;

    return res[0] ? new UserRecord(res[0]) : null;
  }

  static async getUserById(id: string) {
    const [res] = await pool.execute('SELECT * FROM `users` WHERE `id` = :id', { id }) as MysqlUsersResponse;

    return res[0] ? new UserRecord(res[0]) : null;
  }
}
