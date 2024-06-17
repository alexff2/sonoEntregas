class TransformCoin {
  decimalToCoin(value){
    return value ? value.toLocaleString('pt-br', {minimumFractionDigits: 2, maximumFractionDigits: 2}) : '0,00'
  }

  decimalToCoinSymbol(value){
    return value ? value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : 'R$ 0,00'
  }
}

module.exports = new TransformCoin()
