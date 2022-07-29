import { DataSource, EntityTarget } from "typeorm";

import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

export const otcDataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "postgres",
  password: "example",
  // database: "park_info",
  entities: ["src/domain/*.js"],
  logging: true,
  synchronize: true,
  namingStrategy: new SnakeNamingStrategy()
})

export function getRepository<T>(type: EntityTarget<T>) {
  return otcDataSource.getRepository<T>(type);
}