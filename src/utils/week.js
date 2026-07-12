export function getWeekIndexFromDay(day) {
  if (day <= 7) return 0
  if (day <= 14) return 1
  if (day <= 21) return 2
  return 3
}

export function getWeekRangeDays(year, month, weekIndex) {
  const start = weekIndex * 7 + 1
  const end =
    weekIndex === 3
      ? new Date(year, month + 1, 0).getDate()
      : start + 6

  const days = []

  for (let d = start; d <= end; d++) {
    days.push(new Date(year, month, d))
  }

  return days
}