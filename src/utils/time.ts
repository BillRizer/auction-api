function addMinutes(date: Date, number: number) {
  const newDate = new Date(date);
  return new Date(newDate.setMinutes(date.getMinutes() + number));
}
function addHours(date: Date, number: number) {
  const newDate = new Date(date);
  return new Date(newDate.setHours(date.getHours() + number));
}
function addDays(date: Date, number: number) {
  const newDate = new Date(date);
  return new Date(newDate.setDate(date.getDate() + number));
}

function addMonths(date: Date, number: number) {
  const newDate = new Date(date);
  return new Date(newDate.setMonth(newDate.getMonth() + number));
}

function addYears(date: Date, number: number) {
  const newDate = new Date(date);
  return new Date(newDate.setFullYear(newDate.getFullYear() + number));
}

export function CalculateDate(date: Date, dateTime: string) {
  let number = parseInt(dateTime.match(/\d+/)[0]);

  if (dateTime.indexOf('-') != -1) number = -number;

  if (dateTime.indexOf('min') != -1) date = addMinutes(date, number);
  else if (dateTime.indexOf('hour') != -1) date = addHours(date, number);
  else if (dateTime.indexOf('day') != -1) date = addDays(date, number);
  else if (dateTime.indexOf('month') != -1) date = addMonths(date, number);
  else if (dateTime.indexOf('year') != -1) date = addYears(date, number);

  return date;
}

export function getCurrentTimeUTC(): string {
  return new Date(Date.now()).toUTCString();
}

// used in product.ends_at
//calc how long will the auction be available
export function calcLimitAuctionTime(): string {
  const now = getCurrentDateTimeUTCWithoutSec();
  return CalculateDate(new Date(now), '+1hour').toISOString();
}

// because I don't want the seconds
export function getCurrentDateTimeUTCWithoutSec(): string {
  const time = new Date(Date.now()).setSeconds(0);
  return new Date(time).toUTCString();
}
