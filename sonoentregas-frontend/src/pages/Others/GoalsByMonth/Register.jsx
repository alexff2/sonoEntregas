import React from 'react'
import api from '../../../services/api'
import { useAuthenticate } from '../../../context/authContext'

const Register = () => {
  const [formData, setFormData] = React.useState({
    month: '',
    year: new Date().getFullYear().toString(),
    value: '',
  })
  const { shopAuth } = useAuthenticate()
  const storeId = shopAuth.cod

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.month || !formData.year || !formData.value) {
      alert('Por favor, preencha todos os campos.')
      return
    }

    try {
      await api.post('/goals', {
        ...formData,
        storeId,
      })
      alert('Meta cadastrada com sucesso!')
      setFormData({ month: '', year: new Date().getFullYear().toString(), value: '' })
    } catch (error) {
      console.error('Erro ao cadastrar meta:', error)

      if (error.response.data) {
        alert(`Erro: ${error.response.data}`)
      } else {
        alert('Erro ao cadastrar meta. Tente novamente.')
      }
    }
  }

  return (
    <div className="register-gols">
      <h2>Cadastro de Meta por Mês</h2>
      <form className='form-gols'>
        <div>
          <label htmlFor="month">Mês:</label>
          <select
            id="month"
            name="month"
            value={formData.month}
            onChange={handleChange}
            required
          >
            <option value="">Selecione o mês</option>
            <option value="01">Janeiro</option>
            <option value="02">Fevereiro</option>
            <option value="03">Março</option>
            <option value="04">Abril</option>
            <option value="05">Maio</option>
            <option value="06">Junho</option>
            <option value="07">Julho</option>
            <option value="08">Agosto</option>
            <option value="09">Setembro</option>
            <option value="10">Outubro</option>
            <option value="11">Novembro</option>
            <option value="12">Dezembro</option>
          </select>
        </div>
        <div>
          <label htmlFor="year">Ano:</label>
          <input
            type="number"
            id="year"
            name="year"
            value={formData.year}
            onChange={handleChange}
            required
            min="2000"
            max="2100"
          />
        </div>
        <div>
          <label htmlFor="goals">Meta:</label>
          <input
            type="number"
            id="goals"
            name="value"
            value={formData.value}
            onChange={handleChange}
            required
            min="0"
          />
        </div>
      </form>
      <button onClick={handleSubmit}>Cadastrar</button>
    </div>
  )
}

export default Register