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