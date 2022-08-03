import { DataSource, EntityTarget } from "typeorm";

import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

export const dataSource = new DataSource({
  type: "postgres",
  host: "db",
  port: 5432,
  username: "postgres",
  password: "example",
  entities: ["src/domain/*.js"],
  logging: false,
  synchronize: true,
  namingStrategy: new SnakeNamingStrategy()
})

export function getRepository<T>(type: EntityTarget<T>) {
  return dataSource.getRepository<T>(type);
}