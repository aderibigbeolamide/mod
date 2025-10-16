export interface BaseInterface {
  id?: string;
  meta?: {};
  createdAt?: Date;
  updatedAt?: Date;
  createdBy?: string;
}

export type Coordinates = { x: number; y: number };
