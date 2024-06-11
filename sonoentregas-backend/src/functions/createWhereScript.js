function createWhereScript({ modelSearch, typeSearch, search }, whereField) {
  console.log('chegou')
  let like

  if (modelSearch) {
    if (modelSearch === 'beginsWith') {
      like = `${search}%`
    } else if (modelSearch === 'contain') {
      like = `%${search}%`
    } else if (modelSearch === 'endsWith') {
      like = `%${search}`
    }
  }

  const where = !typeSearch ? '' : `AND ${whereField[typeSearch]} LIKE '${like}'`

  return where
}

module.exports = {createWhereScript}
