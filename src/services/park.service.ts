import { Between } from "typeorm";
import { getRepository } from "../db";
import { Park } from "../domain/park";
import { Production } from "../domain/production";
import { aggregationService, GroupBy } from "./aggregation-service/aggregation.service";

const parkRepository = getRepository(Park);
const productionRepository = getRepository(Production);

type Properties<T> = {
  [key in keyof T]?: boolean;
};
export type Pagination = {
  skip?: number,
  take?: number
};

async function getById(parkId: number, withProperties?: Properties<Park>): Promise<Park | null> {
  return parkRepository.findOne({
    where: { id: parkId },
    relations: withProperties
  })
}

// Get all
async function getAll(pagination?: Pagination, withProperties?: Properties<Park>,) {
  const parks = parkRepository.find({
    relations: withProperties,
    ...pagination
  });

  return parks.then(parks => ({ parks, pagination }))
}

type Params = { parkId: number; aggregateBy: GroupBy; from: Date; until: Date }
async function getAggregatedProductionById(params: Params) {
  const { parkId: id, from, until, aggregateBy } = params;

  var production = await productionRepository.find({
    order: { timestamp: 'ASC' },
    where: {
      park_id: id, timestamp: Between(from, until)
    },
  })

  const aggregated = aggregationService.aggregateByPeriod(production, aggregateBy)

  return Object.fromEntries(aggregated.entries());
}

export const parkService = {
  getAll,
  getById,
  getAggregatedProductionById
}