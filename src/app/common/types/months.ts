const czechMonths = [
  'Leden',
  'Únor',
  'Březen',
  'Duben',
  'Květen',
  'Červen',
  'Červenec',
  'Srpen',
  'Září',
  'Říjen',
  'Listopad',
  'Prosinec'
] as const
const englishMonths = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December'
] as const
const monthsByLanguage = {
  czech: czechMonths,
  english: englishMonths
}

export function mapMonthNameToNumber(month: Month) {
  for (const months of Object.values(monthsByLanguage)) {
    const index = months.findIndex((m) => m === month)

    if (index !== -1) {
      return index + 1
    }
  }

  return -1
}

export type Month =
  | (typeof czechMonths)[number]
  | (typeof englishMonths)[number]
