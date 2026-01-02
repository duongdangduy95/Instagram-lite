export function formatTime(date: string | Date) {
  const d = new Date(date)
  return d.toLocaleTimeString('vi-VN', {
    hour: '2-digit',
    minute: '2-digit'
  })
}

export function formatDate(date: string | Date) {
  const d = new Date(date)
  return d.toLocaleDateString('vi-VN', {
    weekday: 'long',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
}

export function isNewDay(
  current: string | Date,
  previous?: string | Date
) {
  if (!previous) return true

  const c = new Date(current)
  const p = new Date(previous)

  return (
    c.getDate() !== p.getDate() ||
    c.getMonth() !== p.getMonth() ||
    c.getFullYear() !== p.getFullYear()
  )
}
