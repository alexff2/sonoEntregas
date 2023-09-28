import React, { useEffect, useState } from 'react'

import api from '../../services/api'

import './style.css'

/* const data = {
  message: 'Sincronizado com sucesso!',
  shops: {
    'Loja 1': 'Conectado com sucesso!',
    'Loja 2': 'Conectado com sucesso!',
    'Loja 3': 'Loja demorou a responder meu parceiro!',
    'Loja 4': 'Conectado com sucesso!',
    'Loja 5': 'Conectado com sucesso!'
  }
} */

export default function ModalSync({ setIsOpenModalSync }) {
  const [ result, setResult ] = useState('Sincronizando...')
  const [ shops, setShops ] = useState({})

  useEffect(() => {
    const sync = async () => {
      try {
        const {data} = await api.post('/synchronize')

        setResult(data.message)
        setShops(data.shops)
      } catch (error) {
        console.log(error)
      }
    }

    sync()

  }, [])

  return (
    <div className='shopSync'>
      <h2 className={result === 'Sincronizando...' ? 'blink' : 'not'}>{result}</h2>

      {Object.entries(shops).map((shop) => (
        <div key={shop[0]}>
          <p>{shop[0]}: 
            <span className={`${shop[1] === 'Conectado com sucesso!' ? 'green' : 'red'}`}>
              {shop[1]}
            </span>
          </p>
        </div>
      ))}

      {Object.entries(shops).length > 0 && (
        <button className='marginTop bGgreen' onClick={() => setIsOpenModalSync(false)}>Fechar</button>
      )}
    </div>
  )
}