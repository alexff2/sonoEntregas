module.exports = {
  getDate(date = false) {
    if (date) {
      var data = new Date(date)
      data.setDate(data.getDate()+1)
      var dia  = data.getDate().toString(),
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
  },
  setDaysInDate(date, days) {
    var data, dia, diaF, mes, mesF, anoF
  
    data = new Date(date)
    data.setDate(data.getDate() + days)
    dia  = data.getDate().toString()
    diaF = (dia.length === 1) ? '0'+dia : dia
    mes  = (data.getMonth()+1).toString() //+1 pois no getMonth Janeiro começa com zero.
    mesF = (mes.length === 1) ? '0'+mes : mes
    anoF = data.getFullYear()
    date = `${anoF}-${mesF}-${diaF}`
  
    return date
  },
  getHours(){
    const date = new Date()
    var hours, minutes, seconds
    hours = date.getHours().toString()
    hours = hours.length === 1 ? `0${hours}` : hours
    minutes = date.getMinutes().toString()
    minutes = minutes.length === 1 ? `0${minutes}` : minutes
    seconds = date.getSeconds().toString()
    seconds = seconds.length === 1 ? `0${seconds}` : seconds

    return `${hours}:${minutes}:${seconds}`
  }
}