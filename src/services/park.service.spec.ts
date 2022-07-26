import { parkService } from "./park.service";

jest.mock('otcDataSource');;

describe('park service', () => {
  it('should get all garages', () => {
    expect(parkService.getById(1)).resolves.toEqual(null);
  })
})