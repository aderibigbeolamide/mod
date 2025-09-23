export interface BaseInterface {
  id?: string;
  meta?: {};
  createdAt?: string;
  updatedAt?: string;
  createdBy?: string;
}

export type Coordinates = { x: number; y: number };
