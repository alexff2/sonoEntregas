//@ts-check

class DateTime {
  constructor(date, onlyDate = false) {
    date = onlyDate ? date.replace('-', '/') : date

    if (date) {
      this.date = new Date(date)
    } else {
      this.date = new Date()
    }
  }

  getBRDateTime() {
    const dateString = this.date.toLocaleString("pt-BR", {timeZone: "America/Sao_Paulo"})
    const arrayDate = dateString.split(' ')

    const objDateTime =  {
      date: arrayDate[0].substring(0,10),
      time: arrayDate[1],
      dateTime: dateString
    }

    return objDateTime
  }

  getISODateTimeBr() {
    const dateTimeIso = this.date.toISOString()
    const dateStringBr = this.date.toLocaleString("pt-BR", {timeZone: "America/Sao_Paulo"})

    const dateIso = dateTimeIso.split('T')[0]
    const timeBr = dateStringBr.split(' ')[1]

    const objDateTime =  {
      date: dateIso,
      time: timeBr,
      dateTime: `${dateIso} ${timeBr}`,
      dateTimeIso
    }

    return objDateTime
  }

  getISODateTimeBr2() {
    const dateStringBr = this.date.toLocaleString("pt-BR", {timeZone: "America/Sao_Paulo"})

    const timeBr = dateStringBr.split(' ')[1]
    const dateIsoArray = dateStringBr.split(',')[0].split('/')
    const [day, month, year] = dateIsoArray

    const dateFull = `${year}-${month}-${day}`

    const objDateTime =  {
      date: dateFull,
      time: timeBr,
      dateTime: `${dateFull} ${timeBr}`,
      dateTimeIsoBr: `${dateFull}T${timeBr}`
    }

    return objDateTime
  }
}


module.exports = DateTime