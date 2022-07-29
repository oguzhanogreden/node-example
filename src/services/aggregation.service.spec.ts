import { DateTime } from "luxon";
import { aggregationService } from "./aggregation.service";
import { Reducable } from "./aggregation.service.types";


describe("yearly aggregation", () => {
  test('when data is empty map is empty too', () => {
    const result = aggregationService.aggregateByPeriod([], 'yearly');

    expect(result.size).toEqual(0);
  })

  test('complete data is aggregated correctly', () => {
    const year = 2022;
    const key = DateTime.fromObject({ year }, { zone: 'utc' }).toISO();

    const result = aggregationService.aggregateByPeriod(yearData(year), 'yearly');

    expect(result.size).toEqual(1)
    expect(result.get(key)).toEqual(6)
  })

  // test('value is null ??')

  // test('value timestamp is  null ??')
})

const getDate = (year: number, month: number, day: number) => DateTime
  .fromObject({ year, month, day }, { zone: 'utc' })
  .toJSDate();

const yearData: (year: number) => Reducable[] = (year: number) => [{
  timestamp: getDate(2022, 2, 1),
  value: 1
}, {
  timestamp: getDate(2022, 2, 1),
  value: 2
}, {
  timestamp: getDate(2022, 12, 1),
  value: 3
}
]