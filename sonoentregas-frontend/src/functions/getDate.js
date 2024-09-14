export function convertDate(date=false, days = 0){
  let data, day, dayF, month, monthF, yearF

  if (date) {
    if(!date.includes('T')){
      date = date.concat('T00:00:00')
    }

    data = new Date(date)
    //data.setDate(data.getDate()+days)
    day  = data.getDate().toString()
    dayF = (day.length === 1) ? '0'+day : day
    month  = (data.getMonth()+1).toString() //+1 pois no getMonth Janeiro começa com zero.
    monthF = (month.length === 1) ? '0'+month : month
    yearF = data.getFullYear()
  } else { 
    data = new Date()
    data.setDate(data.getDate()+days)
    day  = data.getDate().toString()
    dayF = (day.length === 1) ? '0'+day : day
    month  = (data.getMonth()+1).toString() //+1 pois no getMonth Janeiro começa com zero.
    monthF = (month.length === 1) ? '0'+month : month
    yearF = data.getFullYear()
  }
  return { dayF, monthF, yearF }
}

export function dateSqlToReact(date = false, days = 0) {
  const { dayF, monthF, yearF } = convertDate(date, days)
  return `${dayF}/${monthF}/${yearF} `
}

export function getDateToSql(date = false, days = 0) {
  const { dayF, monthF, yearF } = convertDate(date, days)
  return `${yearF}-${monthF}-${dayF}`
}

export function dateWarranty(issue) {
  if (!issue) {
    return
  }

  issue = issue.split('/',3)
  var year = issue[2]
  year = parseInt(year) + 1
  return `${issue[0]}/${issue[1]}/${year}`
}

export function checkDateWarranty(issue) {
  if (!issue) {
    return
  }

  issue = issue.split('/',3)
  var year = issue[2]
  year = parseInt(year) + 1

  var warranty = new Date(`${year}-${issue[1]}-${issue[0]}`)
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
