import React, { useEffect, useState } from "react"
import { AiOutlineArrowDown, AiOutlineArrowUp, AiOutlineSearch } from 'react-icons/ai'

import api from '../../../services/api'
import { dateSqlToReact } from '../../../functions/getDate'

import { useAuthenticate } from '../../../context/authContext'
import { useModalAlert } from '../../../context/modalAlertContext'

import LoadingCircle from '../../../components/LoadingCircle'
import Status from '../../../components/Status'
import { FormatValue } from "../../../components/FormatValue"

function TdStatus({product}){
  const styleStatus = status => {
    const params = { status, type: 1, color: 1}

    status === 'Entregando' && (params.color = 2)
    status === 'Em lançamento' && (params.color = 4)
    status === 'Finalizada' && (params.color = 1)
    status === 'Devolvido' && (params.color = 3)

    return params
  }

  if(product.STATUS === 'Enviado'){
    return <td id="btnCancel">Cancelar</td>
  } else {
    return <td><Status params={styleStatus(product.STATUS)}/></td>
  }
}

function Row({ sale, cancelSubmitSales }) {
  const [open, setOpen] = React.useState(false)

  const clickProd = (e, prod) => {
    if(e.target.id === 'btnCancel') cancelSubmitSales(prod)
  }
  
  return (
    <React.Fragment>
      <tr>
        <td style={{width: 10}} onClick={() => setOpen(!open)}>
          { open ? <AiOutlineArrowUp /> : <AiOutlineArrowDown /> }
        </td>
        <td>{sale.ID_SALES}</td>
        <td>{sale.NOMECLI}</td>
        <td>{dateSqlToReact(sale.EMISSAO)}</td>
        <td>{dateSqlToReact(sale.D_ENTREGA1)}</td>
      </tr>

      <tr id="trProdId">
        <td style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={5}>
          <div className={open ? 'tabProdSeach openDiv': 'tabProdSeach'}>
            <h3>
              Produtos{ sale.HAVE_OBS2? <span style={{fontSize: 12, color: 'red', fontWeight: 100}}> - {sale.OBS2}</span>: null}
            </h3>
            <table>
              <thead>
                <tr id="trProd">
                  <td>Código</td>
                  <td>Descrição</td>
                  <td className="qtdProd">Quantidade</td>
                  <td>Valor (R$)</td>
                  <td></td>
                </tr>
              </thead>
              <tbody>
                {sale.products.map((product) => (
                  <tr key={product.CODPRODUTO} onClick={e => clickProd(e, product)}>
                    <td>{product.COD_ORIGINAL}</td>
                    <td>{product.DESCRICAO}</td>
                    <td>{product.QUANTIDADE}</td>
                    <td>{
                      <FormatValue>{product.NVTOTAL}</FormatValue>
                    }</td>
                    <TdStatus product={product}/>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </td>
      </tr>

    </React.Fragment>
  );
}

export default function TabSaleWaiting({ type }) {
  const [ loading, setLoading ] = useState(false)
  const [ sales, setSales ] = useState([])
  const [ typeSearch, setTypeSearch ] = useState(type === 'open' ? 'All': 'ID_SALES')
  const [ search, setSearch ] = useState('')
  const { setAlert } = useModalAlert()
  const { shopAuth } = useAuthenticate()
  const { cod: codLoja } = shopAuth

  useEffect(()=>{
    if (type === 'open') {
      setLoading(true)

      api
        .get(`sales/`, {
          params: {
            codLoja,
            status: 'open'
          }
        })
        .then(resp => {
          if(resp.data){
            setSales(resp.data)
          }
          setLoading(false)
        })
      .catch( e => console.log(e) )
    }
  },[codLoja, type])

  const searchSales = async () => {
    try {
      if (typeSearch !== 'All' && search === '') {
        console.log(typeSearch, search)
        setAlert('Preencha o campo de pesquisa!')
        return
      }

      const { data } = await api.get(`sales/`, {
        params: {
          codLoja,
          status: type,
          typeSearch: typeSearch === 'All' ? undefined : typeSearch,
          search: search === '' ? undefined : search
        }
      })

      if (data.length === 0){
        setAlert('Venda(s) não encontrada(s)!') 
      } else {
        setSales(data)
      }
    } catch (e) {
      console.log(e)
      setAlert("Erro ao comunicar com o Servidor")
    }
  }

  const cancelSubmitSales = async produto => {
    try {
      const {data} = await api.post(`salesshop`, produto)

      const { data: DataSales } = await api.get(`sales/STATUS/Aberta/null/${codLoja}`)
      setSales(DataSales)

      setAlert(data.msg)
    } catch (error) {
      setAlert('Erro no sistema, entrar em contato com ADM')
      console.log(error)
    }
  }

  return(
    <>
      {/*Campo de busca de vendas*/}
      <div className="fieldsSearchSales">
        <select 
          name="typeSales"
          id="typeSales" 
          className="selectSearchSales"
          onChange={e => { 
            setTypeSearch(e.target.value)
            setSearch('')
          }}
        >
          {type === 'open' && <option value={'All'}>Todos</option>}
          <option value={'ID_SALES'}>Código Venda</option>
          <option value={'NOMECLI'}>Nome Cliente</option>
          {type !== 'open' && <option value={'D_DELIVERED'}>Data</option>}
        </select>

        {(typeSearch !== 'All' && typeSearch !== 'D_DELIVERED') &&
        <div className="inputsSearchSales">
          <AiOutlineSearch />
          <input
            type="text"
            placeholder="Pesquisar…"
            onChange={e => setSearch(e.target.value)}
            onKeyPress={e => e.key === 'Enter' && searchSales()}
            value={search}
          />
        </div>
        }
        {typeSearch === 'D_DELIVERED' &&
        <div className="inputsSearchSales">
          <AiOutlineSearch />
          <input
            type="date"
            onChange={e => setSearch(e.target.value)}
            onKeyPress={e => e.key === 'Enter' && searchSales()}
            value={search}
          />
        </div>
        }

        <button onClick={searchSales}>PESQUISAR</button>
      </div>

      {/*Tabela de vendas*/}
      { loading
        ? <div className="loadingTable">
          <LoadingCircle />
        </div>
        :
        <table>
          <thead>
            <tr>
              <th id="thSales-firstItem"></th>
              <th>Código</th>
              <th>Cliente</th>
              <th>Emissão</th>
              <th>Previsão</th>
            </tr>
          </thead>
          <tbody>
            {sales.map( sale => (
              <Row 
                key={sale.ID} 
                sale={sale}
                cancelSubmitSales={cancelSubmitSales}
              />
            ))}
          </tbody>
        </table>
      }
    </>
  )
}

