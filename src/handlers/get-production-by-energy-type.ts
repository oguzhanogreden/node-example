import { Request, Response } from "express";
import { validationResult } from "express-validator";
import { Between } from "typeorm";
import { dataSource } from "../db";
import { EnergyType } from "../domain/energy-type";
import { Production } from "../domain/production";
import { aggregationService, GroupBy } from "../services/aggregation-service/aggregation.service";
import { getGroupBy, getQueryPeriodInJsDate, mapValuesToFixedPrecision } from "./utils";

// Ideally: Use another noun than "Production" - this is a bad name, it's too 'loaded'
//          for a software project. I'm not familiar with the business domain, so I ran with it.
type GetProductionQuery = {
  from: Date,
  until: Date,
  group_by: GroupBy
};

type GetProductionPathParams = {
  energyType: EnergyType
}

const handler = async function (req: Request<GetProductionPathParams, Production[], any, GetProductionQuery>, res: Response) {
  const { energyType } = req.params;
  const { from, until, group_by } = req.query;

  const validationErrors = validationResult(req)

  if (!validationErrors.isEmpty()) {
    return res.status(400).json({
      errors: validationErrors.array()
    })
  }

  // If you're editing this, consider refactoring this out of the handler:
  // it's currently left here since the API scope isn't very clear.
  const queryPeriod = getQueryPeriodInJsDate(from, until);

  const production = await dataSource.getRepository(Production).find({
    relations: {
      park: true
    },
    order: { timestamp: 'ASC' },
    where: {
      park: {
        energy_type: energyType
      },
      timestamp: Between(queryPeriod.from, queryPeriod.until)
    },
  })

  const groupBy = getGroupBy(group_by);
  const aggregated = aggregationService.aggregateByPeriod(production, groupBy);

  const aggregatedResponse = Object.fromEntries(aggregated.entries());

  res.json({
    aggregated: mapValuesToFixedPrecision(aggregatedResponse),
    query: { ...queryPeriod, group_by },
  })
}

export {
  handler as getProductionByEnergyType
};

