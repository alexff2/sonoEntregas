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

export function dateSqlToReact(date = false, days = 0) {
  const { diaF, mesF, anoF } = convertDate(date, days)
  return `${diaF}/${mesF}/${anoF} `
}

export function getDateToSql(date = false, days = 0) {
  const { diaF, mesF, anoF } = convertDate(date, days)
  return `${anoF}-${mesF}-${diaF}`
}

export function dateWarranty(emissao) {
  if (!emissao) {
    return
  }

  emissao = emissao.split('/',3)
  var ano = emissao[2]
  ano = parseInt(ano) + 1
  return `${emissao[0]}/${emissao[1]}/${ano}`
}

export function checkDateWarranty(emissao) {
  if (!emissao) {
    return
  }

  emissao = emissao.split('/',3)
  var ano = emissao[2]
  ano = parseInt(ano) + 1

  var warranty = new Date(`${ano}-${emissao[1]}-${emissao[0]}`)
  warranty.setDate(warranty.getDate()+1)
  warranty = warranty.setHours(0,0,0,0)

  const dateNow = new Date().setHours(0,0,0,0)  

  return warranty >= dateNow
}

export function dateAndTimeCurrent() {
  const currentDate = new Date()
  const currentMonth = currentDate.getMonth()
  const currentYears = currentDate.getFullYear()

  const months = [
    {description: 'Janeiro', number: '01'},
    {description: 'Fevereiro', number: '02'},
    {description: 'Março', number: '03'},
    {description: 'Abril', number: '04'},
    {description: 'Maio', number: '05'},
    {description: 'Junho', number: '06'},
    {description: 'Julho', number: '07'},
    {description: 'Agosto', number: '08'},
    {description: 'Setembro', number: '09'},
    {description: 'Outubro', number: '10'},
    {description: 'Novembro', number: '11'},
    {description: 'Dezembro', number: '12'}
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
    months,
    monthAbbreviated,
    years,
    currentMonth,
    currentYears,
    dateTimeBr
  }
}
