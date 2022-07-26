import { Request, Response } from "express";
import { validationResult } from "express-validator";
import { GroupBy } from "../services/aggregation-service/aggregation.service";
import { parkService } from "../services/park.service";
import { getGroupBy, getQueryPeriodInJsDate, mapValuesToFixedPrecision } from "./utils";

type GetParkProductionParams = {
  from: Date,
  until: Date,
  group_by: GroupBy,
};

const handler = async function (req: Request<{ id: number }, any, any, GetParkProductionParams>, res: Response) {
  const { id } = req.params
  const { from, until, group_by: groupBy } = req.query;

  const validationErrors = validationResult(req)

  if (!validationErrors.isEmpty()) {
    return res.status(400).json({
      errors: validationErrors.array()
    })
  }

  const queryPeriod = getQueryPeriodInJsDate(from, until);
  const aggregateBy = getGroupBy(groupBy);
  const aggregated = await parkService.getAggregatedProductionById({
    aggregateBy,
    parkId: id,
    ...queryPeriod,
  })

  res.json({
    production: mapValuesToFixedPrecision(aggregated),
    query: { ...queryPeriod, group_by: aggregateBy },
  })
}

export { handler as getParkProduction };
