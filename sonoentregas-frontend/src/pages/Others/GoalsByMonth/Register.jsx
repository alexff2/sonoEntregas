import React from 'react'
import api from '../../../services/api'
import { useAuthenticate } from '../../../context/authContext'

const initialFormState = {
  month: '',
  year: new Date().getFullYear().toString(),
  value_1: '',
  value_2: '',
  value_3: '',
}

const Register = ({goal, setGol}) => {
  const [formData, setFormData] = React.useState(goal ? goal : initialFormState)
  const { shopAuth } = useAuthenticate()
  const storeId = shopAuth.cod

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleCreate = async (e) => {
    e.preventDefault()

    if (!formData.month || !formData.year || !formData.value_1 || !formData.value_2 || !formData.value_3) {
      alert('Por favor, preencha todos os campos.')
      return
    }

    try {
      await api.post('/goals', {
        ...formData,
        storeId,
      })
      alert('Meta cadastrada com sucesso!')
      setFormData(initialFormState)
    } catch (error) {
      console.error('Erro ao cadastrar meta:', error)

      if (error.response.data) {
        alert(`Erro: ${error.response.data}`)
      } else {
        alert('Erro ao cadastrar meta. Tente novamente.')
      }
    }
  }

  const handleUpdate = async (e) => {
    e.preventDefault()

    if (!formData.month || !formData.year || !formData.value_1 || !formData.value_2 || !formData.value_3) {
      alert('Por favor, preencha todos os campos.')
      return
    }

    try {
      await api.put(`/goals/${goal.id}`, {
        value_1: formData.value_1,
        value_2: formData.value_2,
        value_3: formData.value_3,
      })
      alert('Meta atualizada com sucesso!')
      setFormData(initialFormState)
      setGol(null)
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
            value={formData.month.toString().padStart(2, '0')}
            onChange={handleChange}
            disabled={!!goal}
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
            disabled={!!goal}
            required
            min="2000"
            max="2100"
          />
        </div>
        <div>
          <label htmlFor="goals">Meta 1:</label>
          <input
            type="number"
            id="goals"
            name="value_1"
            value={formData.value_1}
            onChange={handleChange}
            required
            min="0"
          />
        </div>
        <div>
          <label htmlFor="goals">Meta 2:</label>
          <input
            type="number"
            id="goals"
            name="value_2"
            value={formData.value_2}
            onChange={handleChange}
            required
            min="0"
          />
        </div>
        <div>
          <label htmlFor="goals">Meta 3:</label>
          <input
            type="number"
            id="goals"
            name="value_3"
            value={formData.value_3}
            onChange={handleChange}
            required
            min="0"
          />
        </div>
      </form>
      <button
        onClick={!!goal ? handleUpdate : handleCreate}
      >{!!goal ? 'Atualizar' : 'Cadastrar'}</button>
    </div>
  )
}

export default Register