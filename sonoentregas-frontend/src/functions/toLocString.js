export function toLocStringBr(value) {
  return value ? value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : 'R$ 0,00'
}

export function toLocString(value) {
  return value ? value.toLocaleString('pt-br', {minimumFractionDigits: 2, maximumFractionDigits: 2}) : '0,00'
}

export function coinMask(event) {
  const onlyDigits = event.target.value
    .split("")
    .filter(s => /\d/.test(s))
    .join("")
    .padStart(3, "0")
  const digitsFloat = onlyDigits.slice(0, -2) + "." + onlyDigits.slice(-2)
  event.target.value = toLocString(parseFloat(digitsFloat))
}

export function coinToFloat(value) {
  const onlyDigits = value.replace('.', '').replace(',', '.')

  return parseFloat(onlyDigits)
}