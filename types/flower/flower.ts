import { FlowerEntity } from './flower.entity';

export type CreateFlowerReq = Omit<FlowerEntity, 'id' | 'userId' >;
