export function parseLocalDate(dateString) {
  const [year, month, day] = dateString.split('-').map(Number)
  return new Date(year, month - 1, day)
}

export function formatDateKey(date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function getLocalDateKey(date = new Date()) {
  return formatDateKey(date)
}

export function getDaysInMonth(year, month) {
  const lastDay = new Date(year, month + 1, 0).getDate()
  const days = []

  for (let day = 1; day <= lastDay; day++) {
    const date = new Date(year, month, day)
    date.setHours(0, 0, 0, 0)
    days.push(date)
  }

  return days
}

export function formatMonthDayLabel(date, index, every = 2) {
  if (index % every !== 0) return ''

  return new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    day: 'numeric',
  }).format(date)
}
export function isSameDay(dateA, dateB) {
  return (
    dateA.getFullYear() === dateB.getFullYear() &&
    dateA.getMonth() === dateB.getMonth() &&
    dateA.getDate() === dateB.getDate()
  )
}