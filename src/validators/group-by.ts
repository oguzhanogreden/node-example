import { query } from "express-validator";
import { AggregationPeriodValidValues } from "../services/aggregation-service/aggregation.service.types";

const validator = query('group_by')
  .isIn(AggregationPeriodValidValues)
  .optional(true);

export { validator as optionalGroupByQueryParamValidator };
