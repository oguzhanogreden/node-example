import express, { Request, Response } from "express"
import { query, validationResult } from 'express-validator'
import { DateTime } from "luxon"
import { Between } from "typeorm"
import { otcDataSource } from "./db"
import { Park } from "./domain/park"
import { Production } from "./domain/production"
import { PaginationParams as PaginationQuery } from "./dto.types"
import { AggregationPeriod } from "./services/aggregation.service"
import { parkService } from "./services/park.service"

// Data source
otcDataSource.initialize()
  .then(() => console.log("init!"))
  .catch(err => console.error(err))

// create and setup express app
const app = express()
app.use(express.json())

// register routes
app.get("/parks", async function (res: Response) {
  const parks = await parkService.getAll();

  res.json(parks)
})

app.get("/park/:id", async function (req: Request<{ id: number }>, res: Response) {
  const { id } = req.params;

  const park = await parkService.getById(id);

  res.json(park)
})

type GetParkProductionParams = PaginationQuery & {
  from: Date,
  until: Date,
  period: AggregationPeriod,
};
app.get("/park/:id/production",
  query('from').isISO8601().optional({ nullable: true }),
  query('period').isIn(["monthly", "yearly", "weekly", "daily", "hourly"] as AggregationPeriod[]),
  query('until').isISO8601().optional({ nullable: true }),
  async function (req: Request<{ id: number }, Park, any, GetParkProductionParams>, res: Response) {
    const { id } = req.params
    const { skip, take, from, until, period } = req.query;

    const validationErrors = validationResult(req)

    if (!validationErrors.isEmpty()) {
      return res.status(400).json({
        errors: validationErrors.array()
      })
    }

    const pagination = (!!skip && !!take) ? { skip, take } : undefined

    const now = DateTime.now();
    const aggregated = parkService.getAggregatedProductionById({
      id,
      aggregationPeriod: period,
      from: from ? DateTime.fromJSDate(from) : now.minus({ day: 1 }),
      until: until ? DateTime.fromJSDate(until) : now,
      pagination
    })

    res.json({
      aggregated,
    })
  }
)

// TODO: Consider renaming, production is a loaded noun
type GetProductionQuery = PaginationQuery
  & {
    from: Date,
    until: Date
  };
app.get("/production",
  query('from').isISO8601().optional({ nullable: true }),
  query('until').isISO8601().optional({ nullable: true }),
  async function (req: Request<any, Production[], any, GetProductionQuery>, res: Response) {
    const { skip, take, from, until } = req.query;

    const validationErrors = validationResult(req)

    if (!validationErrors.isEmpty()) {
      return res.status(400).json({
        errors: validationErrors.array()
      })
    }

    // TODO: Move to a service
    // TODO: Also implement aggregation for this
    const response = await otcDataSource.getRepository(Production).find({
      order: { timestamp: 'ASC' },
      skip,
      take,
      where: { timestamp: Between(from, until) },
    }).then(p => p.map(p => ({ ...p, unit: "MW" }))); // TODO: Persist unit information

    res.json(response)
  })

app.listen(3000)
