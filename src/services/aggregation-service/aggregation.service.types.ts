import { GroupBy } from "./aggregation.service";

export type Reducable = {
  timestamp: Date
  value: number
};

// Ideally: GroupBy is "leaking" through representation layer into our domain logic.
//          It's also coupled directly into a 3rd party dependency (Luxon). Tech debt,
//          albeit a small one.
export const validValues: GroupBy[] = [
  "month",
  "year",
  "week",
  "day",
  "hour"
]

export function isGroupBy(x: any): x is GroupBy {
  const validValues: GroupBy[] = [
    'day',
    'hour',
    'month',
    'week',
    'year'
  ];

  return validValues.includes(x);
}

export {
  validValues as AggregationPeriodValidValues
};
