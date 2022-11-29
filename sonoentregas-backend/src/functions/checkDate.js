module.exports = {
  checkDateBr(date){
    const arrayDate = date.split('/')

    let countOnlyNumber = true

    arrayDate.forEach(element => {
      if (countOnlyNumber) {
        !parseInt(element) && (countOnlyNumber = !countOnlyNumber)
      }
    })

    if (
      countOnlyNumber &&
      arrayDate.length === 3 &&
      arrayDate[0].length === 2 &&
      arrayDate[1].length === 2 &&
      arrayDate[2].length === 4
    ){
      return
    } else {
      throw {
        status: 400,
        error: {
          message: 'Informe a data no formato mes(2 char)/dia(2 char)/ano(4 char)',
        },
      }
    }
  }
}