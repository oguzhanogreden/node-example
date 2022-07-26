import { param } from "express-validator";
import { EnergyType } from "../domain/energy-type";

const validValues: EnergyType[] = [
  'solar',
  'wind'
]

const validator = param('energyType').exists().isIn(validValues)

export {
  validator as requiredEnergyTypeValidator
};

