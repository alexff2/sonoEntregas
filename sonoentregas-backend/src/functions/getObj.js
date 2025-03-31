function getObj(obj, separate=', ', toCompare = '='){
  let values = ''

  Object.entries(obj).forEach(([key,value], i, vet) => {
    if (key === 'in') {
      Object.entries(obj.in).forEach(([keyIn,arrayValueIn], indexIn) => {
        let valueIn

        if (indexIn === 0) {
          arrayValueIn.forEach((el, ind) => {
            ind === 0
              ? valueIn = `'${el}'`
              : valueIn += `, '${el}'`
          })

          vet.length === i + 1
            ? values += `${keyIn} IN (${valueIn.toString()})`
            : values += `${keyIn} IN (${valueIn.toString()})${separate} `
        } else {
          arrayValueIn.forEach((el, ind) => {
            ind === 0
              ? valueIn = `'${el}'`
              : valueIn += `, '${el}'`
          })

          vet.length === i + 1
            ? values += `AND ${keyIn} IN (${valueIn.toString()})`
            : values += `AND ${keyIn} IN (${valueIn.toString()})${separate} `
        }
      })
    } else if (key === 'isNull') {
      vet.length === i + 1 
        ? values += `${value} is null` 
        : values += `${value} is null${separate} `
    } else if (key === 'isNotNull') {
      vet.length === i + 1 
        ? values += `${value} is not null` 
        : values += `${value} is not null${separate} `
    } else {
      let keyValue
      if (value === 'CURRENT_TIMESTAMP'){
        keyValue = toCompare === '=' ? `${key} = ${value}` : `${key} LIKE ${value}%`
      } else if (value === 'NULL') {
        keyValue = `${key} = ${value}`
      } else {
        keyValue = toCompare === '=' ? `${key} = '${value}'` : `${key} LIKE '${value}%'`
      }

      vet.length === i + 1 
        ? values += keyValue 
        : values += `${keyValue}${separate} `
    }
  })

  return values
}

module.exports = getObj
