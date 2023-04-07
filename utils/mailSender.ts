import { schedule } from 'node-cron';
import { FlowerRecord } from '../records/flower.record';
import { mailCallBack, mailOptions, transporter } from './mail-config';
import { UserRecord } from '../records/user.record';

export const task = schedule('0 16 */2 * *', async () => {
  const records = await FlowerRecord.listAll();
  const usersToWater: any[] = [];
  (records).forEach((record) => {
    if (new Date(record.nextWateringAt) < new Date()) {
      const { userId } = record;
      const existingUser = usersToWater.find((user) => user.userId === userId);
      if (existingUser) {
        existingUser.flowersToWater += 1;
      } else {
        usersToWater.push({ userId, flowersToWater: 1 });
      }
    }
  });

  async function getEmail(userId: string) {
    const userData = await UserRecord.getUserById(userId);
    return { email: userData.email, allowMail: userData.allowMail };
  }

  Promise.all(usersToWater.map((user) => getEmail(user.userId)))
    .then((emails) => {
      for (let i = 0; i < emails.length; i++) {
        const mailSentence = 'Drogi użytkowniku, pamiętaj o swoich kwiatkach :)! Aktualnie masz';
        const email = emails[i];
        const user = usersToWater[i];
        if (email.allowMail === 'true') {
          if (user.flowersToWater > 4) {
            mailOptions.text = `${mailSentence} ${user.flowersToWater} kwiatków do podlania.`;
          } else {
            mailOptions.text = user.flowersToWater > 1 ? `${mailSentence} ${user.flowersToWater} kwiatki do podlania.` : `${mailSentence} ${user.flowersToWater} kwiatek do podlania.`;
          }
          mailOptions.to = email.email;
          transporter.sendMail(mailOptions, mailCallBack);
        }
      }
    })
    .catch((error) => console.error(error));
});
