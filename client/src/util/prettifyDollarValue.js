export default function prettifyDollarValue(str) {
  return str.length > 3 ? `$${str.slice(0, -3)},${str.slice(-3)}` : `$${str}`
}