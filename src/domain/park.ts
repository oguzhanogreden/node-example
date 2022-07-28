import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm"
import { Production } from "./production"

@Entity()
export class Park {
  @PrimaryGeneratedColumn()
  id!: number

  @Column()
  park_name!: string

  @Column()
  timezone!: string

  @Column()
  energy_type !: string

  @OneToMany(() => Production, production => production.park)
  production!: Production[]
}