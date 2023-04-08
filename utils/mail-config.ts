import nodemailer, { SentMessageInfo } from 'nodemailer';
import { config } from '../config/config';

export const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: config.mailUser,
    pass: config.mailPass,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

export const mailCallBack = (error: Error, info: SentMessageInfo) => {
  if (error) {
    console.log(error);
  } else {
    console.log(`Email sent: ${info.response}`);
  }
};

export const mailOptions = {
  from: config.mailUser,
  to: '',
  subject: config.mailTopic,
  text: '',
};
