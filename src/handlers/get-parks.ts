import { Request, Response } from "express";
import { validationResult } from "express-validator";
import { parkService } from "../services/park.service";
import { PaginationQueryParams } from "./handler.types";
import { getPagination } from "./utils";

const handler = async function (req: Request<any, any, any, PaginationQueryParams>, res: Response) {
  const validationErrors = validationResult(req)

  if (!validationErrors.isEmpty()) {
    return res.status(400).json({
      errors: validationErrors.array()
    })
  }

  const { skip, take } = req.query;

  const pagination = getPagination(skip, take);

  const response = await parkService.getAll(pagination);

  res.json(response)
}

export { handler as getParks };
