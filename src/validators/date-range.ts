import { query } from "express-validator"

const validators = [
  query('from').isISO8601().optional({ nullable: true }),
  query('until').isISO8601().optional({ nullable: true }),
]

export {
  validators as optionalDateRangeValidators
}
