export function getDateToSql(date = false) {
  var data, dia, diaF, mes, mesF, anoF

  if (date) {
    if(!date.includes('T')){
      date = date.concat('T00:00:00')
    }

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

export function dateSqlToReact(dateSql){
  if (!dateSql) {
    return
  }

  function adicionaZero(numero){
    if (numero <= 9) 
        return "0" + numero
    else
        return numero
  }

  if(!dateSql.includes('T')){
    dateSql = dateSql.concat('T00:00:00')
  }

  let dataAtual = new Date(dateSql)
  let dataAtualFormatada = (adicionaZero(dataAtual.getDate().toString()) + "/" + (adicionaZero(dataAtual.getMonth()+1).toString()) + "/" + dataAtual.getFullYear())

  return dataAtualFormatada
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