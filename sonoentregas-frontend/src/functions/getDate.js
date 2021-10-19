export function getDateToSql(date = false) {
  var data, dia, diaF, mes, mesF, anoF
  if (date) {
      data = new Date(date)
      data.setDate(data.getDate()+1)
      dia  = data.getDate().toString()
      diaF = (dia.length === 1) ? '0'+dia : dia
      mes  = (data.getMonth()+1).toString() //+1 pois no getMonth Janeiro começa com zero.
      mesF = (mes.length === 1) ? '0'+mes : mes
      anoF = data.getFullYear()
      date = `${anoF}-${mesF}-${diaF}`
    return date
  } else { 
    data = new Date()
    dia  = data.getDate().toString()
    diaF = (dia.length === 1) ? '0'+dia : dia
    mes  = (data.getMonth()+1).toString() //+1 pois no getMonth Janeiro começa com zero.
    mesF = (mes.length === 1) ? '0'+mes : mes
    anoF = data.getFullYear()
    date = `${anoF}-${mesF}-${diaF}`
    return date
  }
}

export function dateSqlToReact(dateSql){
  function adicionaZero(numero){
    if (numero <= 9) 
        return "0" + numero
    else
        return numero
  }
  let dataAtual = new Date(dateSql)
  dataAtual.setDate(dataAtual.getDate()+1)
  let dataAtualFormatada = (adicionaZero(dataAtual.getDate().toString()) + "/" + (adicionaZero(dataAtual.getMonth()+1).toString()) + "/" + dataAtual.getFullYear())
  return dataAtualFormatada
}