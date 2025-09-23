import { Column, CreateDateColumn, Entity, PrimaryColumn, UpdateDateColumn } from "typeorm";
import { KVPCategory, KVP } from "../interfaces/kvp.interface.js";

export const KVPEntityTableName='kvp'
@Entity(KVPEntityTableName)
export class KVPEntity<TValue> implements KVP<TValue> {
  @Column({ type: "timestamp with time zone" })
  @CreateDateColumn()
  createdAt: Date;

  @Column({ type: "timestamp with time zone" })
  @UpdateDateColumn()
  updatedAt: Date;
  
  @Column({ nullable: true, type: "json" })
  value: TValue;

  @PrimaryColumn({ type: "enum", enum: KVPCategory })
  key: KVPCategory;
}
