export function convertDate(date=false, days = 0){
  let data, dia, diaF, mes, mesF, anoF
  if (date) {
    
    data = new Date(date)
    data.setDate(data.getDate()+1+days)
    dia  = data.getDate().toString()
    diaF = (dia.length === 1) ? '0'+dia : dia
    mes  = (data.getMonth()+1).toString() //+1 pois no getMonth Janeiro começa com zero.
    mesF = (mes.length === 1) ? '0'+mes : mes
    anoF = data.getFullYear()
  } else { 
    data = new Date()
    data.setDate(data.getDate()+days)
    dia  = data.getDate().toString()
    diaF = (dia.length === 1) ? '0'+dia : dia
    mes  = (data.getMonth()+1).toString() //+1 pois no getMonth Janeiro começa com zero.
    mesF = (mes.length === 1) ? '0'+mes : mes
    anoF = data.getFullYear()
  }
  return { diaF, mesF, anoF }
}

export function getDateBr(date = false, days = 0) {
  const { diaF, mesF, anoF } = convertDate(date, days)
  return `${diaF}/${mesF}/${anoF} `
}

export function getDateSql(date = false, days = 0) {
  const { diaF, mesF, anoF } = convertDate(date, days)
  return `${anoF}-${mesF}-${diaF}`
}

export function setDate(days, date = false) {
  var data, dia, diaF, mes, mesF, anoF
  if (date) {
    data = new Date(date)
    data.setDate(data.getDate()+days+1)
    dia  = data.getDate().toString()
    diaF = (dia.length === 1) ? '0'+dia : dia
    mes  = (data.getMonth()+1).toString() //+1 pois no getMonth Janeiro começa com zero.
    mesF = (mes.length === 1) ? '0'+mes : mes
    anoF = data.getFullYear()
    date = `${diaF}-${mesF}-${anoF}`
    return date
  } else {
    data = new Date()
    data.setDate(data.getDate()+days)
    dia  = data.getDate().toString()
    diaF = (dia.length === 1) ? '0'+dia : dia
    mes  = (data.getMonth()+1).toString() //+1 pois no getMonth Janeiro começa com zero.
    mesF = (mes.length === 1) ? '0'+mes : mes
    anoF = data.getFullYear()
    date = `${diaF}-${mesF}-${anoF}`
    return date
  }
}
