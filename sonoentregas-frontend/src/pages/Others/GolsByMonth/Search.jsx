import React from 'react'

const SearchCommissions = () => {
  const [year, setYear] = React.useState('')
  const [month, setMonth] = React.useState('')
  const [results, setResults] = React.useState([])

  const handleSearch = () => {
    // Simulação de dados para demonstração
    const mockData = [
      { month: 'Janeiro', year: '2023', goal: 1000 },
      { month: 'Fevereiro', year: '2023', goal: 1200 },
      { month: 'Março', year: '2023', goal: 1100 },
      { month: 'Abril', year: '2023', goal: 1300 },
      { month: 'Maio', year: '2023', goal: 1400 },
      { month: 'Junho', year: '2023', goal: 1500 },
      { month: 'Julho', year: '2023', goal: 1600 },
      { month: 'Agosto', year: '2023', goal: 1700 },
      { month: 'Setembro', year: '2023', goal: 1800 },
      { month: 'Outubro', year: '2023', goal: 1900 },
      { month: 'Novembro', year: '2023', goal: 2000 },
      { month: 'Dezembro', year: '2023', goal: 2100 },
    ]

    const filteredResults = mockData.filter((data) => {
      return (
        (year ? data.year === year : true) &&
        (month ? data.month.toLowerCase() === month.toLowerCase() : true)
      )
    })

    setResults(filteredResults)
  }

  return (
    <div>
      <h2>Consultar Metas</h2>
      <div style={{ display: 'flex', gap: '16px' }}>
        <label>
          Ano: &nbsp;
          <input
            type="text"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            onKeyUp={(e) => { if (e.key === 'Enter') handleSearch() }}
            placeholder="Digite o ano"
          />
        </label>
        <label>
          Mês: &nbsp;
          <input
            type="text"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            onKeyUp={(e) => { if (e.key === 'Enter') handleSearch() }}
            placeholder="Digite o mês"
          />
        </label>
        <button onClick={handleSearch}>Buscar</button>
      </div>

      <div className="table-gols-container">
        <table className='table-gols'>
          <thead>
            <tr>
              <th>Mês</th>
              <th>Ano</th>
              <th>Meta</th>
            </tr>
          </thead>
          <tbody>
            {results.length > 0 ? (
              results.map((result, index) => (
                <tr key={index}>
                  <td>{result.month}</td>
                  <td>{result.year}</td>
                  <td>
                    {result.goal.toLocaleString('pt-BR', {
                      style: 'currency',
                      currency: 'BRL',
                    })}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" style={{ textAlign: 'center' }}>
                  Nenhum resultado encontrado
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default SearchCommissions