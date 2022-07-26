import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Park } from "./park";

export class ColumnNumericTransformer {
  to(data: number): number {
    return data;
  }
  from(data: string): number {
    return parseFloat(data);
  }
}

@Entity()
export class Production {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  park_id!: number;

  @ManyToOne(() => Park, park => park.production, { eager: false })
  park!: Park

  @Column({ nullable: false, type: 'timestamp' })
  timestamp!: Date

  // Ideally: Data would be stored in a lower dimensional manner.
  //          Units should be stored e.g. the unit in which a Park reports
  //          its production value.
  @Column('numeric', {
    precision: 11, // Ideally: I'd be more informed about the domain and choose these wisely.
    scale: 3,
    transformer: new ColumnNumericTransformer(),
  })
  value!: number;
}

/// ColumnNumericTransformer