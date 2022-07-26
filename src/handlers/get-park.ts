import { Request, Response } from "express";
import { validationResult } from "express-validator";
import { PaginationQueryParams } from "../dto.types";
import { parkService } from "../services/park.service";

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

