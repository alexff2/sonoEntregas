import React, { useEffect, useState } from 'react'

import api from '../../../services/api'
import { coinMask, coinToFloat } from '../../../functions/toLocString'

import { dateAndTimeCurrent } from '../../../functions/getDate'

export default function ModalCreate({ setIsOpenModalCreateGoals, getGoals }){
  const [ shops, setShops ] = useState([])
  const [ isDisabled, setIsDisabled ] = useState(false)
  const [ shopId, setShopId ] = useState('')
  const [ month, setMonth ] = useState('')
  const [ year, setYear ] = useState('')
  const [ goalValue, setGoalValue ] = useState('')
  const { months, currentYears, currentMonth } = dateAndTimeCurrent()

  useEffect(() => {
    api.get('/shops').then(({ data }) => setShops(data))
  }, [])

  const onSubmit = async e => { 
    try {
      e.preventDefault()
      setIsDisabled(true)

      const monthYear = `${month === '' ? months[currentMonth].number : month }-${year === '' ? currentYears : year}`
      const idShop = shopId === '' ? shops[0].CODLOJA : shopId

      await api.post('/goals', {idShop, monthYear, value: goalValue})

      getGoals()

      setIsOpenModalCreateGoals(false)
    } catch (error) {
      console.log(error)
    }
  }

  return(
    <>
      <h2>Cadastro de Metas</h2>

      <form onSubmit={onSubmit} className="flexRowSpaceBetween">
        <div className='fieldGoal'>
          <label htmlFor="shops">Loja: </label>
          <select id='shops' onChange={ e => setShopId(e.target.value)} required>
            {shops.map(shop => (
              <option key={shop.CODLOJA} value={shop.CODLOJA}>{shop.DESCRICAO}</option>
            ))}
          </select>
        </div>

        <div className='fieldGoal'>
          <label htmlFor='month'>Mês: </label>
          <select
            id='month'
            onChange={e => setMonth(e.target.value)}
            defaultValue={months[currentMonth].number}
            required
          >
            {months.map(month => (
              <option key={month.number} value={month.number}>{month.description}</option>
            ))}
          </select>
        </div>

        <div className='fieldGoal field'>
          <label htmlFor='years'>Ano: </label>
          <input
            type='number'
            id='years'
            min={currentYears}
            defaultValue={currentYears}
            onChange={e => setYear(e.target.value)}
            required
          />
        </div>

        <div className='fieldGoal field'>
          <label htmlFor="goal">Meta: </label>
          <input id='goal' type='text' onInput={coinMask} onChange={e => setGoalValue(coinToFloat(e.target.value))} required/>
        </div>

        <div>
          <button className='btnAdd' type='submit' disabled={isDisabled}>+</button>
        </div>
      </form>

      <hr />

    </>
  )
}