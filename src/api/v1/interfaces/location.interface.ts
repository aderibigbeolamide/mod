import { TransactionTypes } from "../enums/transaction.types.enums.js";
import { LeaseTerms } from "../enums/lease.terms.enum.js";
import { AvailabilityStatuses } from "../enums/availability.statuses.enum.js";
import { EPropertyType } from "../enums/property.enums.js";
import { PropertyUnit, PropertyUnitAnalytics } from "./unit.interface.js";
import { BaseInterface, Coordinates } from "./base.interface.js";
import { LocationLGAEntity, LocationStateEntity } from "../entities/location.entity.js";

export interface LocationState {
  name: string;
}

export interface LocationLGA {
  name: string;
  state: LocationStateEntity;
}

export interface LocationWards {
  name: string;
  lga: LocationLGAEntity;
}
