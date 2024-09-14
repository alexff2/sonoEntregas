import React, { useState } from 'react'
import { AiOutlineSearch } from 'react-icons/ai'

import LoadingCircle from '../../../components/LoadingCircle'
import { getDateToSql } from '../../../functions/getDate'
import { useAuthenticate } from '../../../context/authContext'
import { useModalAlert } from '../../../context/modalAlertContext'
import api from '../../../services/api'

const startSearch = { dateStart: getDateToSql(), dateFinish: getDateToSql()}

function Row({sale, handleSelectSaleReturn}) {
  const [ openProducts, setOpenProducts ] = useState(false)

  return (
    <React.Fragment >
      <tr>
        <td
          onClick={() => setOpenProducts(!openProducts)}
          style={{cursor: 'pointer'}}
        >
          { openProducts ? ' - ' : ' + '}
        </td>
        <td>{sale.originalReturnId}</td>
        <td>{sale.originalSaleId}</td>
        <td>{sale.client}</td>
        <td>{sale.dtReturnToLocale}</td>
        <td>{sale.issue}</td>
        <td>
          { !sale.isSendReturn
            ? <input type="checkbox" onClick={() => handleSelectSaleReturn(sale)}/> 
            : 'Enviado'}
        </td>
      </tr>
      { openProducts &&
        <tr>
          <td colSpan={7} style={{padding: 0}}>
            <table>
              <tbody>
                {
                  sale.products.map(product => (
                    <tr key={product.alternativeCode}>
                      <td></td>
                      <td></td>
                      <td>{product.alternativeCode}</td>
                      <td>{product.name}</td>
                      <td>{product.quantity}</td>
                      <td></td>
                    </tr>
                  ))
                }
              </tbody>
            </table>
          </td>
        </tr>
      }
    </React.Fragment>
  )
}

const Search = ({ handleSelectSaleReturn }) => {
  const [ loading, setLoading ] = useState(false)
  const [ typeSearch, setTypeSearch] = useState('date')
  const [ search, setSearch] = useState(startSearch)
  const [ salesReturns, setSalesReturns ] = useState([])
  const { shopAuth } = useAuthenticate()
  const { setAlert } = useModalAlert()

  const searchSales = async () => {
    try {
      setLoading(true)
      const { data } = await api.get('/returns/sce', {
        params: {
          typeSearch,
          search,
          dateStart: search.dateStart,
          dateFinish: search.dateFinish,
          shopId: shopAuth.cod
        }
      })
      setSalesReturns(data.salesReturns)
      setLoading(false)
    } catch (error) {
      setLoading(false)
      console.log(error)
      if (!error.response) {
        setAlert('rede!')
        return
      }
      setAlert('Sem evidências!')
    }
  }

  return (
    <div className="sales-modaL" style={{ minHeight: 600, minWidth: 800 }}>
      <div className="fieldsSearchSales">
        <select 
          name="typeSales"
          id="typeSales" 
          className="selectSearchSales"
          onChange={e => { 
            setTypeSearch(e.target.value)
            if (e.target.value === 'date') {
              setSearch({
                dateStart: getDateToSql(),
                dateFinish: getDateToSql()
              })
            } else {
              setSearch('')
            }
          }}
        >
          <option value={'date'}>Data</option>
          <option value={'ID_SALES'}>Código Venda</option>
          <option value={'NOMECLI'}>Nome Cliente</option>
        </select>

        {typeSearch !== 'date' &&
        <div className="inputsSearchSales">
          <AiOutlineSearch />
          <input
            type="text"
            placeholder="Pesquisar…"
            onChange={e => setSearch(e.target.value)}
            value={search}
          />
        </div>
        }
        {typeSearch === 'date' &&
        <>
          <div className="inputsSearchSales">
            <AiOutlineSearch />
            <input
              type="date"
              onChange={e => setSearch({...search, dateStart: e.target.value})}
              value={search.dateStart}
            />
          </div>
          <span style={{margin: '0 4px 0 8px', color: 'white'}}>A</span>
          <div className="inputsSearchSales">
            <AiOutlineSearch />
            <input
              type="date"
              onChange={e => setSearch({...search, dateFinish: e.target.value})}
              value={search.dateFinish}
            />
          </div>
        </>
        }

        <button onClick={searchSales} disabled={loading}>PESQUISAR</button>
      </div>
      { loading 
        ?<div className='loadingTable' >
          <LoadingCircle/>
        </div>
        :<table className="table-modal-product">
          <thead>
            <tr>
              <th></th>
              <th>Código</th>
              <th>DAV</th>
              <th>Cliente</th>
              <th>Dt devolução</th>
              <th>Dt Emissão</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
          {salesReturns.map(sale => (
            <Row
              key={sale.originalReturnId}
              sale={sale}
              handleSelectSaleReturn={handleSelectSaleReturn}
            />
          ))}
          </tbody>
        </table>
      }
    </div>
  )
}

export default Search