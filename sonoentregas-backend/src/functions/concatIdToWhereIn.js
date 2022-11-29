module.exports = {
  concatIdToWhereIn(tablesAsArray, id = 'ID'){
    let ids = ''

    tablesAsArray.forEach((element, i) => {
      if ( i === 0 ){
        ids+= element[id]
      } else {
        ids+= `, ${element[id]}`
      }
    })

    return ids
  }
}