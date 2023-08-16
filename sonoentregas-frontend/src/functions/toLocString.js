export function toLocStringBr(value) {
  return value ? value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : 'R$ 0,00'
}

export function toLocString(value) {
  return value ? value.toLocaleString('pt-br', {minimumFractionDigits: 2}) : '0,00'
}