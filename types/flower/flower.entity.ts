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
}
