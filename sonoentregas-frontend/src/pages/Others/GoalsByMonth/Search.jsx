import React from 'react'
import { FiEdit } from 'react-icons/fi'

import api from '../../../services/api'

import { useAuthenticate } from '../../../context/authContext'

const months = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
]

const SearchCommissions = ({ setRegisterSelected }) => {
  const [year, setYear] = React.useState(new Date().getFullYear().toString())
  const [month, setMonth] = React.useState('')
  const [results, setResults] = React.useState([])
  const { shopAuth } = useAuthenticate()
  const { cod } = shopAuth

  const handleSearch = async () => {
    try {
      const { data } = await api.get('/goals', {
        params: { year, storeId: cod }
      })

      const filteredResults = data.filter((result) => {
        return (
          (year ? result.year === Number(year) : true) &&
          (month ? result.month === Number(month) : true)
        )
      })

      setResults(filteredResults)
    } catch (error) {
      if (error.response.data) {
        alert(`Erro: ${error.response.data}`)
      } else {
        alert('Erro ao buscar metas. Tente novamente mais tarde.')
      }
      console.log('Erro ao buscar metas:', error.response)
    }
  }

  return (
    <div>
      <h2>Consultar Metas</h2>
      <div style={{ display: 'flex', gap: '16px' }}>
        <label>
          Ano: &nbsp;
          <input
            type="number"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            onKeyUp={(e) => { if (e.key === 'Enter') handleSearch() }}
            placeholder="Digite o ano"
          />
        </label>
        <label>
          Mês: &nbsp;
          <input
            type="number"
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
              <th>Ano</th>
              <th>Mês</th>
              <th>Meta 1</th>
              <th>Meta 2</th>
              <th>Meta 3</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {results.length > 0 ? (
              results.map((result, index) => (
                <tr key={index}>
                  <td>{result.year}</td>
                  <td>{result.month} - {months[result.month - 1]}</td>
                  <td>
                    {result.value_1.toLocaleString('pt-BR', {
                      style: 'currency',
                      currency: 'BRL',
                    })}
                  </td>
                  <td>
                    {result.value_2.toLocaleString('pt-BR', {
                      style: 'currency',
                      currency: 'BRL',
                    })}
                  </td>
                  <td>
                    {result.value_3.toLocaleString('pt-BR', {
                      style: 'currency',
                      currency: 'BRL',
                    })}
                  </td>
                  <td>
                    <FiEdit onClick={() => setRegisterSelected(result)} />
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