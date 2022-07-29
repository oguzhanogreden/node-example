import { DateTime } from "luxon";
import { Between } from "typeorm";
import { getRepository } from "../db";
import { Park } from "../domain/park";
import { Production } from "../domain/production";
import { AggregationPeriod, aggregationService } from "./aggregation.service";

const parkRepository = getRepository(Park);
const productionRepository = getRepository(Production);

type Properties<T> = {
  [key in keyof T]?: boolean;
};
type Pagination = {
  skip: number,
  take: number
};

const defaultPagination = {
  skip: 0,
  take: 5
}
async function getById(id: number, withProperties?: Properties<Park>): Promise<Park> {
  return parkRepository.findOneOrFail({
    where: { id },
    relations: withProperties
  })
}

// Get all
async function getAll(pagination?: Pagination, withProperties?: Properties<Park>,) {
  return parkRepository.find({
    relations: withProperties,
    ...pagination
  });
}

// TODO: fix naming
type Params = { id: number; aggregationPeriod: AggregationPeriod; pagination?: Pagination; from: DateTime; until: DateTime }
async function getAggregatedProductionById(params: Params) {
  var production = await productionRepository.find({
    order: { timestamp: 'ASC' },
    where: { timestamp: Between(params.from, params.until) },
    ...params.pagination
  })

  const aggregated = aggregationService.aggregateByPeriod(production, params.aggregationPeriod)

  return Object.fromEntries(aggregated.entries());
}

export const parkService = {
  getAll,
  getById,
  getAggregatedProductionById
}