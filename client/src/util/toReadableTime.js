import { format } from "date-fns"

export default function toReadableTime(dateString) {
  try {
    return format(new Date(`${dateString.replace(/-/g, '/').replace('T', ' ')} UTC`), 'h:mm aaaa')
  } catch {
    return ''
  }
}