import express from "express"
import { getParkHandler, getParkProductionHandler, getParksHandler, getProductionByEnergyTypeHandler } from "./handlers"
import { optionalGroupByQueryParamValidator, optionalPaginationQueryParamValidator, requiredEnergyTypeValidator } from "./validators"
import { optionalDateRangeValidators } from "./validators/date-range"
import { requiredNumericIdValidator } from "./validators/identifiers"

// Create and setup express app
const app = express()

// Middlewares
app.use(express.json())

// Register routes
app.get("/parks",
  ...optionalPaginationQueryParamValidator,
  getParksHandler
)

app.get("/park/:id",
  requiredNumericIdValidator,
  getParkHandler
)

app.get("/park/:id/production",
  requiredNumericIdValidator,
  ...optionalDateRangeValidators,
  optionalGroupByQueryParamValidator,
  getParkProductionHandler
)

app.get("/production/:energyType",
  requiredEnergyTypeValidator,
  ...optionalDateRangeValidators,
  optionalGroupByQueryParamValidator,
  getProductionByEnergyTypeHandler
)

export {
  app
}
