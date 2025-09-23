import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from "typeorm";
import { BaseEntity } from "./base.entity.js";
import {
  LocationLGA,
  LocationState,
  LocationWards,
} from "../interfaces/location.interface.js";

@Entity("location_state")
export class LocationStateEntity extends BaseEntity implements LocationState {
  @Column({ nullable: true })
  name: string;

  @OneToMany(() => LocationLGAEntity, (lga) => lga.state, {
    cascade: true,
  })
  lgas: LocationLGAEntity[];

  constructor(data?: LocationState) {
    super();
    if (data) {
      this.name = data.name;
    }
  }
}

@Entity("location_lga")
export class LocationLGAEntity extends BaseEntity implements LocationLGA {
  @Column({ nullable: true })
  name: string;

  @ManyToOne(() => LocationStateEntity, (state) => state.lgas, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "state_id" })
  state: LocationStateEntity;

  @OneToMany(() => LocationWardsEntity, (ward) => ward.lga, {
    cascade: true,
  })
  wards: LocationWardsEntity[];

  constructor(data?: Partial<LocationLGAEntity>) {
    super();
    if (data) {
      this.name = data.name;
      this.state = data.state;
    }
  }
}

@Entity("location_wards")
export class LocationWardsEntity extends BaseEntity implements LocationWards {
  @Column({ nullable: true })
  name: string;

  @ManyToOne(() => LocationLGAEntity, (lga) => lga.wards, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "lga_id" })
  lga: LocationLGAEntity;

  constructor(data?: Partial<LocationWardsEntity>) {
    super();
    if (data) {
      this.name = data.name;
      this.lga = data.lga;
    }
  }
}
