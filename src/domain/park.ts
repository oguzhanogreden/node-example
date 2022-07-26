import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm"
import { EnergyType, energyTypeTransformers } from "./energy-type"
import { Production } from "./production"

@Entity()
export class Park {
  @PrimaryGeneratedColumn()
  id!: number

  @Column()
  park_name!: string

  @Column()
  timezone!: string

  @Column({
    transformer: energyTypeTransformers
  })
  energy_type !: EnergyType

  @OneToMany(() => Production, production => production.park)
  production!: Production[]
}