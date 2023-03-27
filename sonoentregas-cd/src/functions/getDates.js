export function getObjDate(date){
  const arrayDate = date.split('-')

  const dateObj = new Date(`${arrayDate[1]}/${arrayDate[2]}/${arrayDate[0]}`)

  const dayFinal = new Date(parseInt(arrayDate[0]), parseInt(arrayDate[1]), 0)

  if (parseInt(arrayDate[2]) < 1 || parseInt(arrayDate[2]) > dayFinal.getDate()) {
    throw new Error('Invalid day for selected month!')
  }

  if (
    !(arrayDate.length === 3 &&
    arrayDate[0].length === 4 &&
    arrayDate[1].length === 2 &&
    arrayDate[2].length === 2 &&
    dateObj.setHours(0,0,0,0))
  ) {
    throw new Error('Enter the date in format: year(4 char)/month(2 char)/day(2 char). Example: 2000-12-01')
  }

  return dateObj
}

export function convertDate(date=false, days = 0){
  let data, dia, diaF, mes, mesF, anoF

  if (date) {
    if(!date.includes('T')){
      date = date.concat('T00:00:00')
    }

    data = new Date(date)
    //data.setDate(data.getDate()+days)
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
    if(!date.includes('T')){
      date = date.concat('T00:00:00')
    }

    data = new Date(date)
    data.setDate(data.getDate()+days)
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
