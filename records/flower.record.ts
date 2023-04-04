import { v4 as uuid } from 'uuid';
import { FieldPacket } from 'mysql2';
import { FlowerEntity } from '../types';
import { ValidationError } from '../utils/errors';
import { pool } from '../utils/db';
import { addDays } from '../utils/addDays';
import { dateStringToDBDateString } from '../utils/dateStringToDBDateString';
import { dateToLocaleDateString } from '../utils/dateToLocaleDateString';

type FlowerRecordResult = [FlowerEntity[], FieldPacket[]];

export class FlowerRecord implements FlowerEntity {
  public id?: string;
  public name: string;
  public species?: string;
  public info?: string;
  public wateredAt: string;
  public replantedAt?: string;
  public fertilizedAt?: string;
  public wateringInterval: number;
  public isMailSent: boolean = false;
  public nextWateringAt: string;
  public userId: string;

  constructor(obj: FlowerEntity) {
    this.userId = obj.userId;
    this.id = obj.id;
    this.name = obj.name;
    this.species = obj.species;
    this.info = obj.info;
    this.wateredAt = obj.wateredAt;
    this.replantedAt = obj.replantedAt;
    this.fertilizedAt = obj.fertilizedAt;
    this.wateringInterval = obj.wateringInterval;
    this.isMailSent = obj.isMailSent;
    this.nextWateringAt = obj.nextWateringAt;

    if (!this.name || this.name.length < 3 || this.name.length > 50) {
      throw new ValidationError('Incorrect child name. Name should have at least 3 characters and at most 50 characters.');
    }
  }

  public static async listAll(userId: string): Promise<FlowerRecord[]> {
    const [flowersList] = (await pool.execute('SELECT * FROM `flowers` WHERE `userId` = :userId ORDER BY `name` ASC', { userId })) as FlowerRecordResult;
    console.log(flowersList);
    return flowersList.map((flower: FlowerRecord) => new FlowerRecord(
      {
        ...flower,
        wateredAt: dateToLocaleDateString(flower.wateredAt),
        nextWateringAt: addDays(new Date(flower.wateredAt), Number(flower.wateringInterval)).toLocaleDateString('fr-CH'),
      },
    ));
  }

  public static async getOne(id: string): Promise<FlowerRecord> {
    const [flower] = (await pool.execute('SELECT * FROM `flowers` WHERE `id` = :id', {
      id,
    })) as FlowerRecordResult;
    if (flower[0]) {
      const { fertilizedAt, replantedAt } = flower[0];
      return new FlowerRecord({
        ...flower[0],
        wateredAt: new Date(flower[0].wateredAt).toLocaleDateString('fr-CH'),
        fertilizedAt: fertilizedAt ? new Date(flower[0].fertilizedAt).toLocaleDateString('fr-CH') : null,
        replantedAt: replantedAt ? new Date(flower[0].replantedAt).toLocaleDateString('fr-CH') : null,
        nextWateringAt: addDays(new Date(flower[0].wateredAt), Number(flower[0].wateringInterval)).toLocaleDateString('fr-CH'),
      });
    }
    return null;
  }

  public async delete(): Promise<void | null> {
    await pool.execute('DELETE FROM `flowers` WHERE `id` = :id', {
      id: this.id,
    });
  }
  public async updateDate(updatedWateredAt: string): Promise<string> {
    this.nextWateringAt = addDays(new Date(), Number(this.wateringInterval)).toISOString().slice(0, 19).replace('T', ' ');
    await pool.execute('UPDATE `flowers` SET `wateredAt`= :wateredAt, `nextWateringAt` = :nextWateringAt WHERE `id` = :flowerId', {
      wateredAt: updatedWateredAt,
      nextWateringAt: this.nextWateringAt,
      flowerId: this.id,
    });

    return this.nextWateringAt;
  }

  public async updateFlowerInfo(flower: FlowerEntity): Promise<void> {
    const {
      info, wateredAt, replantedAt, fertilizedAt, wateringInterval, nextWateringAt, species, name,
    } = flower;
    const { id } = this;
    await pool.execute('UPDATE `flowers` SET `name`=:name, `species`=:species, `wateredAt`= :wateredAt, `replantedAt`=:replantedAt, `fertilizedAt`=:fertilizedAt, `nextWateringAt` = :nextWateringAt, `wateringInterval`=:wateringInterval, `info`=:info WHERE `id` = :flowerId', {
      name,
      species,
      wateredAt: dateStringToDBDateString(wateredAt),
      replantedAt: replantedAt ? dateStringToDBDateString(replantedAt) : null,
      fertilizedAt: fertilizedAt ? dateStringToDBDateString(fertilizedAt) : null,
      nextWateringAt: dateStringToDBDateString(nextWateringAt),
      wateringInterval,
      info,
      flowerId: id,
    });
  }

  public async insert(): Promise<string> {
    this.id = this.id ?? uuid();

    this.nextWateringAt = addDays(new Date(this.wateredAt), Number(this.wateringInterval)).toISOString().slice(0, 19).replace('T', ' ');

    await pool.execute('INSERT INTO `flowers` (`id`, `userId`, `name`, `species`, `info`, `wateredAt`, `replantedAt`, `fertilizedAt`, `wateringInterval`, `isMailSent`, `nextWateringAt` ) VALUES (:id, :userId, :name, :species, :info, :wateredAt, :replantedAt, :fertilizedAt,:wateringInterval, :isMailSent, :nextWateringAt)', {
      id: this.id,
      userId: this.userId,
      name: this.name,
      species: this.species ? this.species : null,
      info: this.info ? this.info : null,
      wateredAt: this.wateredAt,
      replantedAt: this.replantedAt ? this.replantedAt : null,
      fertilizedAt: this.fertilizedAt ? this.fertilizedAt : null,
      wateringInterval: this.wateringInterval,
      isMailSent: this.isMailSent,
      nextWateringAt: this.nextWateringAt,
    });

    return this.id;
  }

  public async mailReminderSent(): Promise<void> {
    await pool.execute('UPDATE `flowers` SET `isMailSent`= "true" WHERE `id` = :id', {
      id: this.id,
    });
  }
}
