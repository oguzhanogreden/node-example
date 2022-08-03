import { Request, Response } from "express";
import { validationResult } from "express-validator";
import { parkService } from "../services/park.service";
import { PaginationQueryParams } from "./handler.types";

type GetParkPathParams = {
  id: number
}
const handler = async function (req: Request<GetParkPathParams, any, any, PaginationQueryParams>, res: Response) {
  const validationErrors = validationResult(req)

  if (!validationErrors.isEmpty()) {
    return res.status(400).json({
      errors: validationErrors.array()
    })
  }

  const { id } = req.params;

  const park = await parkService.getById(id);

  if (!park) {
    return res.status(404).json();
  }

  res.json(park)
}

export { handler as getPark };

