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

  @Column({ nullable: true, type: 'timestamp' })
  timestamp!: Date

  @Column({ nullable: true, type: 'float' })
  value!: number | null;
}