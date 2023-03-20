import { v4 as uuid } from 'uuid';
import { FieldPacket } from 'mysql2';
import { FlowerEntity } from '../types/flower/flower.entity';
import { ValidationError } from '../utils/errors';
import { pool } from '../utils/db';

type FlowerRecordResult = [FlowerRecord[], FieldPacket[]];

export class FlowerRecord {
  public id?: string;
  public name: string;
  public species?: string;
  public info?: string;
  public wateredAt: string;
  public replantedAt?: string;
  public fertilizedAt?: string;
  public wateringInterval: number;
  public isMailSent: boolean = false;

  constructor(obj: FlowerEntity) {
    this.id = obj.id;
    this.name = obj.name;
    this.species = obj.species;
    this.info = obj.info;
    this.wateredAt = obj.wateredAt;
    this.replantedAt = obj.replantedAt;
    this.fertilizedAt = obj.fertilizedAt;
    this.wateringInterval = obj.wateringInterval;
    this.isMailSent = obj.isMailSent;

    if (!this.name || this.name.length < 3 || this.name.length > 50) {
      throw new ValidationError('Incorrect child name. Name should have at least 3 characters and at most 50 characters.');
    }
  }

  public static async listAll(): Promise<FlowerRecord[]> {
    const [childrenList] = (await pool.execute('SELECT * FROM `flowers` ORDER BY `name` ASC')) as FlowerRecordResult;
    return childrenList.map((flower: FlowerRecord) => new FlowerRecord(flower));
  }

  public async insert(): Promise<string> {
    this.id = this.id ?? uuid();
    this.species = this.species ?? '';
    this.info = this.info ?? '';
    this.replantedAt = this.replantedAt ?? '';
    this.fertilizedAt = this.fertilizedAt ?? '';
    await pool.execute('INSERT INTO `flowers` (`id`, `name`) VALUES (:id, :name, :species, :info, :wateredAt, :replantedAt, :fertilizedAt, :wateringInterval, :isMailSent)', {
      id: this.id,
      name: this.name,
      species: this.species,
      info: this.info,
      wateredAt: this.wateredAt,
      replantedAt: this.replantedAt,
      fertilizedAt: this.fertilizedAt,
      wateringInterval: this.wateringInterval,
      isMailSent: this.isMailSent,
    });
    return this.id;
  }

  public async mailReminderSent(): Promise<void> {
    await pool.execute('UPDATE `flowers` SET `isMailSent`= "true" WHERE `id` = :id', {
      id: this.id,
    });
  }
}
