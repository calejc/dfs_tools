export default function prettifyDollarValue(str) {
  return `$${str.slice(0, -3)},${str.slice(-3)}`
}