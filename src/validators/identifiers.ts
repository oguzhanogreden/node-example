import { param } from "express-validator";

const validator = param('id').exists().isNumeric();

export {
  validator as requiredNumericIdValidator
};
