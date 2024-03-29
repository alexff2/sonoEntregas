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

export function dateWarranty(issueDate) {
  if (!issueDate) {
    return
  }

  issueDate = issueDate.split('/',3)
  var ano = issueDate[2]
  ano = parseInt(ano) + 1
  return `${issueDate[0]}/${issueDate[1]}/${ano}`
}

export function checkDateWarranty(issueDate) {
  if (!issueDate) {
    return
  }

  issueDate = issueDate.split('/',3)
  var ano = issueDate[2]
  ano = parseInt(ano) + 1

  var warranty = new Date(`${ano}-${issueDate[1]}-${issueDate[0]}`)
  warranty.setDate(warranty.getDate()+1)
  warranty = warranty.setHours(0,0,0,0)

  const dateNow = new Date().setHours(0,0,0,0)  

  return warranty >= dateNow
}

export function dateAndTimeCurrent() {
  const currentDate = new Date()
  const currentMonth = currentDate.getMonth()
  const currentYears = currentDate.getFullYear()

  const month = [
    'Janeiro',
    'Fevereiro',
    'Março',
    'Abril',
    'Maio',
    'Junho',
    'Julho',
    'Agosto',
    'Setembro',
    'Outubro',
    'Novembro',
    'Dezembro'
  ]

  const monthAbbreviated = [
    'Jan',
    'Fev',
    'Mar',
    'Abr',
    'Mai',
    'Jun',
    'Jul',
    'Ago',
    'Set',
    'Out',
    'Nov',
    'Dez'
  ]

  const years = []

  for(let i = 2020; i <= currentYears; i++) {
    years.push(i)
  }

  const dateTimeBr = currentDate.toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" })

  return {
    month,
    monthAbbreviated,
    years,
    currentMonth,
    currentYears,
    dateTimeBr
  }
}