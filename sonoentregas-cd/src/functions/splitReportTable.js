export default function splitReportTable(reportTable, numberRows, numberRowsHeader) {
  const splitTable = []

  splitTable.push(reportTable.filter(( item, index ) => index <= numberRowsHeader-1))

  if (reportTable.length > numberRowsHeader) {
    const numberPages = Math.ceil((reportTable.length - numberRowsHeader) / numberRows)

    for (let i = 0; i < numberPages; i++) {
      splitTable.push(reportTable.filter(( item, index ) => index > numberRowsHeader-1 + (i * numberRows) && index <= numberRowsHeader-1 + ((i+1) * numberRows)))
    }
  }

  return splitTable
}