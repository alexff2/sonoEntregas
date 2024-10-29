import React from 'react'
import api from '../../../services/api'

const DeleteSerial = () => {
  const [productId, setProductId] = React.useState('')
  const [msgReturn, setMsgReturn] = React.useState('')
  const [product, setProduct] = React.useState({})
  const [serials, setSerials] = React.useState([])

  React.useEffect(() => {
    setTimeout(() => {
      document.getElementById('productId').focus()
    }, 100)
  }, [])

  const handleFindProduct = async () => {
    try {
      const {data} = await api.get('/dev/product/find/serials', {
        params: {
          productId
        }
      })

      setProduct(data.product)
      setSerials(data.serials)
    } catch (error) {
      console.error(error)
    }
  }

  const handleDeleteSerial = async (serialId) => {
    try {
      await api.delete('/dev/product/delete/serial', {
        params: {
          serialId
        }
      })

      setSerials(serials.filter(serial => serial.id !== serialId))
      setMsgReturn('Serial excluído com sucesso!')
      setProductId('')
      document.getElementById('productId').focus()
    } catch (error) {
      setMsgReturn('Error ao excluir serial!')
      console.error(error)
    }
  }

  return (
    <div>
      <h1>Delete Serial</h1>

      <p>
        Código do Produto: 
        <input
          id='productId'
          type="text"
          value={productId}
          onChange={e => setProductId(e.target.value)}
          onKeyDown={e => {
            if (e.key === 'Enter') {
              handleFindProduct()
            }
          }}
        />
        <span
          style={{
            color: msgReturn.includes('sucesso') ? 'green' : 'red'
          }}
        >
          {msgReturn}
        </span>
      </p>

      <h2>
        {product?.id} - {product?.name} - {product?.alternativeCode}
      </h2>

      { serials.length > 0
        ? <table>
          <thead>
            <tr>
              <th>Serial</th>
              <th>Excluir</th>
            </tr>
          </thead>
          <tbody>
            { serials.map(serial => (
                <tr key={serial.id}>
                  <td>{serial.serialNumber}</td>
                  <td>
                    <button
                      onClick={() => handleDeleteSerial(serial.id)}
                    >Excluir</button>
                  </td>
                </tr>
            ))}
          </tbody>
        </table>
        : <p>Nenhum serial encontrado</p>
      }
    </div>
  )
}

export default DeleteSerial