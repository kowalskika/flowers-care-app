export interface FlowerEntity {
  id?: string;
  name: string;
  species?: string;
  info?: string;
  wateredAt: string;
  replantedAt?: string;
  fertilizedAt?: string;
  wateringInterval: number;
  isMailSent: boolean;
  nextWateringAt: string;
  userId: string;
}

export type FLowerUpdateDateReq = Pick<FlowerEntity, 'userId' | 'wateredAt'>;

export enum FlowerUpdateForm {
  name = 'name',
  wateredAt = 'wateredAt',
  info = 'info',
  species = 'species',
  replantedAt = 'replantedAt',
  fertilizedAt = 'fertilizedAt',
  wateringInterval = 'wateringInterval',
}

export type CreateFlowerReq = Omit<FlowerEntity, 'id' | 'userId' >;
