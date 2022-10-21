import { format } from 'date-fns'

export default function toReadableDate(dateString) {
  try {
    return format(new Date(`${dateString.replace(/-/g, '/').replace('T', ' ')} UTC`), 'M/d - h:mm aaaa')
  } catch {
    return ''
  }
}