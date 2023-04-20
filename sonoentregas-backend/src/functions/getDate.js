class objDate {
  getObjDate(date){
    const arrayDate = date.split('-')

    const dateObj = new Date(`${arrayDate[1]}/${arrayDate[2]}/${arrayDate[0]}`)

    const dayFinal = new Date(parseInt(arrayDate[0]), parseInt(arrayDate[1]), 0)

    if (parseInt(arrayDate[2]) < 1 || parseInt(arrayDate[2]) > dayFinal.getDate()) {
      throw {
        status: 400,
        error: {
          message: 'Invalid day for selected month!',
        },
      }
    }

    if (
      !(arrayDate.length === 3 &&
      arrayDate[0].length === 4 &&
      arrayDate[1].length === 2 &&
      arrayDate[2].length === 2 &&
      dateObj.setHours(0,0,0,0))
    ) {
      throw {
        status: 400,
        error: {
          message: 'Enter the date in format: year(4 char)/month(2 char)/day(2 char). Example: 2000-12-01',
        },
      }
    }

    return dateObj
  }

  getDate(date = false, isObjDate = false) {
    if (date) {
      var data = isObjDate ? date : this.getObjDate(date)

      data.setDate(data.getDate())

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
  }

  setDaysInDate(date, days) {
    var data, dia, diaF, mes, mesF, anoF
  
    data = this.getObjDate(date)
    data.setDate(data.getDate() + days)
    dia  = data.getDate().toString()
    diaF = (dia.length === 1) ? '0'+dia : dia
    mes  = (data.getMonth()+1).toString() //+1 pois no getMonth Janeiro começa com zero.
    mesF = (mes.length === 1) ? '0'+mes : mes
    anoF = data.getFullYear()
    date = `${anoF}-${mesF}-${diaF}`
  
    return date
  }

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

  convertMillisecondsToDays(milliseconds){
    return milliseconds / 86400000
  }

  subtractDate(majorDate, minusDate) {
    console.log(majorDate)
    const dif = majorDate - minusDate

    return this.convertMillisecondsToDays(dif)
  }

  difDate(date1, date2){
    let difDays
    
    if (date1 < date2) {
      //console.log( )
      difDays = (date2-date1)/86400000
    } else {
      difDays = (date1-date2)/86400000
    }

    return difDays
  }
}

module.exports = new objDate()