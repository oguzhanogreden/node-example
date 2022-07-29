import { DateTime, DateTimeUnit } from "luxon";
import { Production } from "../domain/production";
import { Reducable } from "./aggregation.service.types";

export type AggregationPeriod = 'monthly' | 'yearly' | 'weekly' | 'daily' | 'hourly';
type AggregatedResult = Map<string, number>;
type AggregationMap<T> = Map<AggregationPeriod, (prev: AggregatedResult, curr: T) => AggregatedResult>;

// UTILS
const periodSelectorFactory: (period: AggregationPeriod) => LuxonPeriodSelector = period => {
  const periodSelector = periodMap.get(period);

  if (!periodSelector) {
    throw new Error(`Argument out of range: period. Value:${period}`);
  }

  return (date: DateTime) => date.startOf(periodSelector);
}

function aggregateByPeriod<T extends Reducable>(objects: T[], period: AggregationPeriod): AggregatedResult {
  // TODO: Don't assign at runtime
  const periodSelector = periodSelectorFactory(period)

  const reducer = reducerFactory<T>(periodSelector);

  const initialValue: AggregatedResult = new Map<string, number>();

  return objects.reduce(reducer, initialValue);
}

// TODO: Refactor into a provider or factory per aggregation period
type ProductionReducer = (prev: AggregatedResult, curr: Production) => AggregatedResult;

function reducerFactory<T extends Reducable>(periodSelector: LuxonPeriodSelector) {
  return (prev: AggregatedResult, curr: T) => {
    const date = DateTime.fromJSDate(curr.timestamp, { zone: 'utc' });

    const periodKey = periodSelector(date).toISO();
    const previousSum = prev.get(periodKey) ?? 0;

    return prev.set(periodKey, previousSum + (curr.value ?? 0));
  };
}

type LuxonPeriodSelector = (date: DateTime) => DateTime;
const periodMap: Map<AggregationPeriod, DateTimeUnit> = new Map([
  ['monthly', 'month'],
  ['weekly', 'week'],
  ['yearly', 'year'],
  ['daily', 'day'],
  ['hourly', 'hour'],
])

export const aggregationService = {
  aggregateByPeriod
};
