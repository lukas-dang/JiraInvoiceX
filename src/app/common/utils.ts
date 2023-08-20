import moment, { type Moment } from 'moment'
import { mapMonthNameToNumber, type Month } from './types/months'

const dateFormat = 'YYYY-MM-DD'

function getMonth(month: Month): Moment {
  const n = mapMonthNameToNumber(month)
  return moment({ month: n - 1 }) // moment assumes that the first month number is 0
}

export function getStartOfMonth(month: Month): string {
  return getMonth(month).startOf('month').format(dateFormat)
}

export function getEndOfMonth(month: Month): string {
  return getMonth(month).endOf('month').format(dateFormat)
}
