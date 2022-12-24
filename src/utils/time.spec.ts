import { CalculateDate } from './time';

describe('CalculateDate', () => {
  it('should add and subtract minutes using CalculateDate()', () => {
    const time = 'Sat, 24 Dec 2022 05:06:38 GMT';

    const greater2min = CalculateDate(new Date(time), '+2min');
    const greater60min = CalculateDate(new Date(time), '+60min');
    const lower2min = CalculateDate(new Date(time), '-2min');
    const lower60min = CalculateDate(new Date(time), '-60min');

    expect(greater2min).toEqual(new Date('Sat, 24 Dec 2022 05:08:38 GMT'));
    expect(greater60min).toEqual(new Date('Sat, 24 Dec 2022 06:06:38 GMT'));
    expect(lower2min).toEqual(new Date('Sat, 24 Dec 2022 05:04:38 GMT'));
    expect(lower60min).toEqual(new Date('Sat, 24 Dec 2022 04:06:38 GMT'));
  });

  it('should add and subtract hours using CalculateDate()', () => {
    const time = 'Sat, 24 Dec 2022 05:06:38 GMT';

    const greater2hours = CalculateDate(new Date(time), '+2hour');
    const greater24hours = CalculateDate(new Date(time), '+24hour');
    const lower2hours = CalculateDate(new Date(time), '-2hour');
    const lower24hours = CalculateDate(new Date(time), '-24hour');

    expect(greater2hours).toEqual(new Date('Sat, 24 Dec 2022 07:06:38 GMT'));
    expect(greater24hours).toEqual(new Date('Sat, 25 Dec 2022 05:06:38 GMT'));
    expect(lower2hours).toEqual(new Date('Sat, 24 Dec 2022 03:06:38 GMT'));
    expect(lower24hours).toEqual(new Date('Sat, 23 Dec 2022 05:06:38 GMT'));
  });

  it('should add and subtract days using CalculateDate()', () => {
    const time = 'Sat, 24 Dec 2022 05:06:38 GMT';

    const greater2days = CalculateDate(new Date(time), '+2day');
    const lower2days = CalculateDate(new Date(time), '-2day');

    expect(greater2days).toEqual(new Date('Sat, 26 Dec 2022 05:06:38 GMT'));
    expect(lower2days).toEqual(new Date('Sat, 22 Dec 2022 05:06:38 GMT'));
  });
});
