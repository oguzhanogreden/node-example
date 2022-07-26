import { DateTime } from "luxon";
import { GroupBy } from "../services/aggregation-service/aggregation.service";
import { isGroupBy } from "../services/aggregation-service/aggregation.service.types";

const DefaultGroupBy: GroupBy = 'month';
const DefaultSkip = 0;
const DefaultTake = 5;
// Opinion: "Input forgiving" APIs are nice: Someone forgetting entering a param
//          can be forgiven, so long as (1) we're transparent about what we're doing
//          and (2) aware that the API isn't becoming a box full of "magical" stuff.
const DefaultDeltaFromNowInYears = 10;

const getPagination = (skip: any, take: any) => ({
  skip: typeof skip === 'number' ? skip : DefaultSkip,
  take: typeof take === 'number' ? take : DefaultTake,
})

const getGroupBy = (groupBy: any): GroupBy => {
  return isGroupBy(groupBy) ? groupBy : DefaultGroupBy;
}

const getQueryPeriodInJsDate = (from: Date, until: Date) => {
  const now = DateTime.utc();

  return {
    from: from ? from : now.minus({ year: DefaultDeltaFromNowInYears }).toJSDate(),
    until: until ? until : now.toJSDate(),
  }
}

const toFixedPrecision = (float: number): number => {
  return parseFloat(float.toFixed(3));
}

const mapValuesToFixedPrecision = (obj: { [key in any]: any }): { [key in any]: any } => {
  const entries = Object.entries(obj);

  const mappedEntries = entries.map(([key, value]) => {
    const fixedPrecisionValue = (typeof value === 'number') ? toFixedPrecision(value) : value;

    return [key, fixedPrecisionValue]
  })

  return Object.fromEntries(mappedEntries);
}

export {
  getGroupBy,
  getPagination,
  getQueryPeriodInJsDate,
  mapValuesToFixedPrecision
};

