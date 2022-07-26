import { DateTime } from "luxon";
import { Reducable } from "./aggregation.service.types";

export type GroupBy = 'month' | 'year' | 'week' | 'day' | 'hour';
type AggregatedResult = Map<string, number>;

const periodSelectorFactory: (period: GroupBy) => LuxonPeriodSelector = period => {
  return (date: DateTime) => date.startOf(period);
}

function aggregateByPeriod<T extends Reducable>(objects: T[], period: GroupBy): AggregatedResult {
  const periodSelector = periodSelectorFactory(period)

  const reducer = reducerFactory<T>(periodSelector);

  const initialValue: AggregatedResult = new Map<string, number>();

  return objects.reduce(reducer, initialValue);
}

function reducerFactory<T extends Reducable>(periodSelector: LuxonPeriodSelector) {
  return (prev: AggregatedResult, curr: T) => {
    const date = DateTime.fromJSDate(curr.timestamp);

    const periodKey = periodSelector(date).toISO();
    const previousSum = prev.get(periodKey) ?? 0;

    return prev.set(periodKey, previousSum + (curr.value ?? 0));
  };
}

type LuxonPeriodSelector = (date: DateTime) => DateTime;

export const aggregationService = {
  aggregateByPeriod
};
