import { v4 as uuid } from 'uuid';
import { FieldPacket } from 'mysql2';

import { FlowerEntity } from '../types';
import { ValidationError } from '../utils/errors';
import { pool } from '../utils/db';
import {
  addDaysToDbString, addDaysToLocaleDateString, dateToLocaleDateString, dateStringToDBDateString,
} from '../utils/dateOperations';

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
  public nextWateringAt: string;
  public userId: string;
  public photosUrl: string | string[];

  constructor(obj: FlowerEntity) {
    this.id = obj.id;
    this.userId = obj.userId;
    this.name = obj.name;
    this.species = obj.species;
    this.info = obj.info;
    this.wateredAt = obj.wateredAt;
    this.replantedAt = obj.replantedAt;
    this.fertilizedAt = obj.fertilizedAt;
    this.wateringInterval = obj.wateringInterval;
    this.nextWateringAt = obj.nextWateringAt;
    this.photosUrl = obj.photosUrl;

    if (!this.name || this.name.length < 3 || this.name.length > 100) {
      throw new ValidationError('Incorrect child name. Name should have at least 3 characters and at most 50 characters.');
    }
  }

  public static async listAll(): Promise<FlowerRecord[]> {
    const [flowersList] = (await pool.execute('SELECT * FROM `flowers` ORDER BY `name` ASC')) as FlowerRecordResult;

    return flowersList.map((flower: FlowerRecord) => new FlowerRecord(flower));
  }

  public static async listAllByUserId(userId: string): Promise<FlowerRecord[]> {
    const [flowersList] = (await pool.execute('SELECT * FROM `flowers` WHERE `userId` = :userId ORDER BY `name` ASC', { userId })) as FlowerRecordResult;

    return flowersList.map((flower: FlowerRecord) => new FlowerRecord(
      {
        ...flower,
        wateredAt: dateToLocaleDateString(flower.wateredAt),
        nextWateringAt: addDaysToLocaleDateString(new Date(flower.wateredAt), Number(flower.wateringInterval)),
      },
    ));
  }

  public static async getOne(id: string): Promise<FlowerRecord | null> {
    const [flower] = (await pool.execute('SELECT * FROM `flowers` WHERE `id` = :id', {
      id,
    })) as FlowerRecordResult;

    if (flower[0]) {
      const {
        fertilizedAt, replantedAt, wateredAt, wateringInterval,
      } = flower[0];

      return new FlowerRecord({
        ...flower[0],
        wateredAt: dateToLocaleDateString(wateredAt),
        fertilizedAt: fertilizedAt ? dateToLocaleDateString(fertilizedAt) : null,
        replantedAt: replantedAt ? dateToLocaleDateString(replantedAt) : null,
        nextWateringAt: addDaysToLocaleDateString(new Date(wateredAt), Number(wateringInterval)),
      });
    }
    return null;
  }

  public async delete(): Promise<void> {
    await pool.execute('DELETE FROM `flowers` WHERE `id` = :id', {
      id: this.id,
    });
  }

  public async updateDate(updatedWateredAt: string): Promise<string> {
    this.nextWateringAt = addDaysToDbString(new Date(), Number(this.wateringInterval));

    await pool.execute('UPDATE `flowers` SET `wateredAt`= :wateredAt, `nextWateringAt` = :nextWateringAt WHERE `id` = :flowerId', {
      wateredAt: updatedWateredAt,
      nextWateringAt: this.nextWateringAt,
      flowerId: this.id,
    });

    return this.nextWateringAt;
  }

  public async updatePhotosArr(photosUrl: string, flowerId: string): Promise<string> {
    await pool.execute('UPDATE `flowers` SET `photosUrl`= :photosUrl WHERE `id` = :flowerId', {
      photosUrl,
      flowerId,
    });

    return this.nextWateringAt;
  }

  public async updateFlowerInfo(flower: FlowerEntity): Promise<void> {
    const {
      info, wateredAt, replantedAt, fertilizedAt, wateringInterval, nextWateringAt, species, name, photosUrl,
    } = flower;

    await pool.execute('UPDATE `flowers` SET `name`=:name, `species`=:species, `wateredAt`= :wateredAt, `replantedAt`=:replantedAt, `fertilizedAt`=:fertilizedAt, `nextWateringAt` = :nextWateringAt, `wateringInterval`=:wateringInterval, `photosUrl`=:photosUrl,`info`=:info WHERE `id` = :flowerId', {
      name,
      species,
      wateredAt,
      replantedAt: replantedAt || null,
      fertilizedAt: fertilizedAt || null,
      nextWateringAt: dateStringToDBDateString(nextWateringAt),
      wateringInterval,
      photosUrl,
      info,
      flowerId: this.id,
    });
  }

  public async insert(): Promise<string> {
    this.id = this.id ?? uuid();
    this.nextWateringAt = addDaysToDbString(new Date(this.wateredAt), Number(this.wateringInterval));
    console.log(this);
    await pool.execute('INSERT INTO `flowers` (`id`, `userId`, `name`, `species`, `info`, `wateredAt`, `replantedAt`, `fertilizedAt`, `wateringInterval`, `nextWateringAt` ) VALUES (:id, :userId, :name, :species, :info, :wateredAt, :replantedAt, :fertilizedAt,:wateringInterval, :nextWateringAt)', {
      id: this.id,
      userId: this.userId,
      name: this.name,
      species: this.species ? this.species : null,
      info: this.info ? this.info : null,
      wateredAt: this.wateredAt,
      replantedAt: this.replantedAt ? this.replantedAt : null,
      fertilizedAt: this.fertilizedAt ? this.fertilizedAt : null,
      wateringInterval: this.wateringInterval,
      nextWateringAt: this.nextWateringAt,
    });

    return this.id;
  }
}
