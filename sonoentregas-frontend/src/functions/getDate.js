export default function getDate(date = false) {
  var data, dia, diaF, mes, mesF, anoF
  if (date) {
      data = new Date(date)
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

export function getTransformDate(date, days) {
  var data, dia, diaF, mes, mesF, anoF

  data = new Date(date)
  data.setDate(data.getDate() + days)
  dia  = (data.getDate()).toString()
  diaF = (dia.length === 1) ? '0'+dia : dia
  mes  = (data.getMonth()+1).toString() //+1 pois no getMonth Janeiro começa com zero.
  mesF = (mes.length === 1) ? '0'+mes : mes
  anoF = data.getFullYear()
  date = `${anoF}-${mesF}-${diaF}`

  return date
}