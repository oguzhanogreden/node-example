import { query } from "express-validator";

const validators = [
  query('skip').isNumeric().optional(true),
  query('take').isNumeric().optional(true),
]

export { validators as optionalPaginationQueryParamValidator };

