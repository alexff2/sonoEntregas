export function convertDate(date=false){
  var data, dia, diaF, mes, mesF, anoF
  if (date) {
    
    data = new Date(date)
    data.setDate(data.getDate()+1)
    dia  = data.getDate().toString()
    diaF = (dia.length === 1) ? '0'+dia : dia
    mes  = (data.getMonth()+1).toString() //+1 pois no getMonth Janeiro começa com zero.
    mesF = (mes.length === 1) ? '0'+mes : mes
    anoF = data.getFullYear()
    return {diaF, mesF, anoF}
  } else { 
    data = new Date()
    dia  = data.getDate().toString()
    diaF = (dia.length === 1) ? '0'+dia : dia
    mes  = (data.getMonth()+1).toString() //+1 pois no getMonth Janeiro começa com zero.
    mesF = (mes.length === 1) ? '0'+mes : mes
    anoF = data.getFullYear()
    return {diaF, mesF, anoF}
  }
}

export function getDateBr(date = false) {
  const { diaF, mesF, anoF } = convertDate(date)
  return `${diaF}-${mesF}-${anoF} `
}

export function getDateSql(date = false) {
  const { diaF, mesF, anoF } = convertDate(date)
  return `${anoF}-${mesF}-${diaF} `
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
