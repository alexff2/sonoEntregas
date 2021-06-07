function getDate(date = false) {
  if (date) {
    var data = new Date(date),
      dia  = data.getDate().toString(),
      diaF = (dia.length === 1) ? '0'+dia : dia,
      mes  = (data.getMonth()+1).toString(), //+1 pois no getMonth Janeiro começa com zero.
      mesF = (mes.length === 1) ? '0'+mes : mes,
      anoF = data.getFullYear()
      date = `${anoF}-${mesF}-${diaF}`
    return date
  } else { 
    var data = new Date(),
      dia  = data.getDate().toString(),
      diaF = (dia.length === 1) ? '0'+dia : dia,
      mes  = (data.getMonth()+1).toString(), //+1 pois no getMonth Janeiro começa com zero.
      mesF = (mes.length === 1) ? '0'+mes : mes,
      anoF = data.getFullYear()
      date = `${anoF}-${mesF}-${diaF}`;
    return date
  }
}

module.exports = getDate