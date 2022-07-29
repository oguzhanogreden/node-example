import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Park } from "./park";

@Entity()
export class Production {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  park_id!: number;

  @ManyToOne(() => Park, park => park.production, { eager: true })
  park!: Park

  @Column({ nullable: false, type: 'timestamp' })
  timestamp!: Date

  @Column({ nullable: false, type: 'float' })
  value!: number;
}