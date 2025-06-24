import React, { useEffect, useState } from "react"
import { AiOutlineArrowDown, AiOutlineArrowUp, AiOutlineSearch } from 'react-icons/ai'

import api from '../../../services/api'
import { dateSqlToReact, getDateToSql } from '../../../functions/getDate'

import { useAuthenticate } from '../../../context/authContext'
import { useModalAlert } from '../../../context/modalAlertContext'

import LoadingCircle from '../../../components/LoadingCircle'
import Status from '../../../components/Status'
import ConfirmDialog from "../../../components/ConfirmDialog"

import ModalSaleDetail from '../ModalSaleDetail'

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
  } else if(product.STATUS === 'Finalizada' && product.DOWN_EST){
    return <td id="btnEstornar">Estornar estoque</td>
  } else {
    return <td><Status params={styleStatus(product.STATUS)}/></td>
  }
}

function Row({ sale, cancelSubmitSales, reverseStock, saleDetail, updateAddress }) {
  const [open, setOpen] = useState(false)

  const clickProd = (e, prod) => {
    if(e.target.id === 'btnCancel') cancelSubmitSales(prod)
    else if(e.target.id === 'btnEstornar') reverseStock(prod)
    else saleDetail(sale, prod)
  }

  const styleDateDelivery = () => {
    // VERIFICAR
    var dateDelivery, dateNow, dateAlert
    dateDelivery = new Date(sale.D_ENTREGA1)
    dateDelivery.setHours(0,0,0,0)

    dateNow = new Date().setHours(0,0,0,0)

    dateAlert = new Date()
    dateAlert.setDate(dateAlert.getDate()+2)
    dateAlert.setHours(0,0,0,0)

    if (sale.D_ENTREGA1 === null) {
      return { color: 'blue' }
    } else if (dateDelivery < dateNow) {
      return { color: 'red' }
    } else if (dateDelivery >= dateNow && dateDelivery <= dateAlert){
      return { color: 'yellow' }
    } else {
      return { color: 'black' }
    }
  }

  return (
    <>
      <tr>
        <td style={{width: 10}} onClick={() => setOpen(!open)}>
          { open ? <AiOutlineArrowUp /> : <AiOutlineArrowDown /> }
        </td>
        <td>{sale.ID_SALES}</td>
        <td style={{cursor: 'pointer'}} onClick={() => updateAddress(sale)}>{sale.NOMECLI}</td>
        <td>{dateSqlToReact(sale.EMISSAO)}</td>
        <td style={styleDateDelivery()}>
          {sale.D_ENTREGA1 !== null
            ? dateSqlToReact(sale.D_ENTREGA1)
            : 'Sem agendamento'
          }
        </td>
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
                  <td>Qtd</td>
                  <td>Descrição</td>
                  <td></td>
                </tr>
              </thead>
              <tbody>
                {sale.products.map((product, index) => (
                  <tr key={index} onClick={e => clickProd(e, product)}>
                    <td>{product.COD_ORIGINAL}</td>
                    <td>{product.QUANTIDADE}</td>
                    <td>{product.NOME}</td>
                    <TdStatus product={product}/>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </td>
      </tr>
    </>
  );
}

export default function TabSaleWaiting({ type }) {
  const [ showDialog, setShowDialog ] = useState(false)
  const [ openModalSaleDetail, setOpenModalSaleDetail ] = useState(false)
  const [ selectedSale, setSelectedSale ] = useState({})
  const [ selectedProduct, setSelectedProduct ] = useState({})
  const [ loading, setLoading ] = useState(false)
  const [ sales, setSales ] = useState([])
  const [ typeSearch, setTypeSearch ] = useState(type === 'open' ? 'All': 'D_DELIVERED')
  const [ search, setSearch ] = useState(getDateToSql())
  const { setAlert } = useModalAlert()
  const { shopAuth } = useAuthenticate()
  const { cod: codLoja } = shopAuth

  useEffect(()=> {
    const getData = async () => {
      setLoading(true)
      try {
        const {data} = type !== 'open'
          ? await api.get(`sales/`, {
              params: {
                codLoja,
                status: type,
                typeSearch: 'D_DELIVERED',
                search: getDateToSql()
              }
            })
          : await api.get(`sales/shop`, {params: {shopId: codLoja}})
        type !== 'open' ? setSales(data) : setSales(data.sales)
        setLoading(false)
      } catch (error) {
        setLoading(false)
        console.log(error)
      }
    }
    getData()
  },[codLoja, type])

  const getOpenSales = async () => {
    setLoading(true)
    try {
      const { data } = await api.get(`sales/shop`, {
        params: {
          shopId: codLoja,
        }
      })
      setSales(data.sales)
      setLoading(false)
    } catch (error) {
      setLoading(false)
      console.log(error)
      setAlert('Erro ao conectar com o Servidor!')
    }
  }

  const getSalesById = async () => {
    setLoading(true)
    try {
      const params = type === 'open'
        ? { shopId: codLoja }
        : { shopId: codLoja, status: 'Fechada' }

      const { data } = await api.get(`sales/${search}/shop`, {params})
      setSales(data.sales)
      setLoading(false)
    } catch (error) {
      setLoading(false)
      console.log(error)
      setAlert('Erro ao conectar com o Servidor!')
    }
  }

  const getSalesByName = async () => {
    setLoading(true)
    try {
      const params = type === 'open'
        ? { shopId: codLoja, client: search }
        : { shopId: codLoja, client: search, status: 'Fechada' }

      const { data } = await api.get(`sales/shop-by-name`, {params})
      setSales(data.sales)
      setLoading(false)
    } catch (error) {
      setLoading(false)
      console.log(error)
      setAlert('Erro ao conectar com o Servidor!')
    }
  }

  const getFinishSalesByDate = async () => {
    setLoading(true)
    try {
      const { data } = await api.get(`sales/`, {
        params: {
          codLoja,
          status: type,
          typeSearch: 'D_DELIVERED',
          search
        }
      })
      setSales(data)
      setLoading(false)
    } catch (error) {
      setLoading(false)
      console.log(error)
      setAlert('Erro ao conectar com o Servidor!')
    }
  }

  const searchSales = async () => {
    if (typeSearch !== 'All' && search === '') {
      console.log(typeSearch, search)
      setAlert('Preencha o campo de pesquisa!')
      return
    }

    if (typeSearch === 'All' && type === 'open') {
      getOpenSales()
      return
    }

    if (typeSearch === 'ID_SALES') {
      getSalesById()
      return
    }

    if (typeSearch === 'NOMECLI') {
      getSalesByName()
      return
    }

    if (typeSearch === 'D_DELIVERED') {
      getFinishSalesByDate()
      return
    }
  }

  const cancelSubmitSales = async produto => {
    try {
      const {data} = await api.post(`salesshop`, produto)

      const { data: DataSales } = await api.get(`sales/`, {
        params: {
          codLoja,
          status: type
        }
      })
      setSales(DataSales)

      setAlert(data.msg)
    } catch (error) {
      setAlert('Erro no sistema, entrar em contato com ADM')
      console.log(error)
    }
  }

  const reverseStock = async produto => {
    try {
      const { data } = await api.post(`salesshop/reverse/${produto.ID_SALES}`, produto)

      const { data: DataSales} = await api.get(`sales/`, {
        params: {
          codLoja,
          status: type,
          typeSearch: typeSearch === 'All' ? undefined : typeSearch,
          search: search === '' ? undefined : search
        }
      })

      setSales(DataSales)

      setAlert(data.msg, 'sucess')
    } catch (error) {
      setAlert('Erro no sistema, entrar em contato com ADM')
      console.log(error)
    }
  }

  const saleDetail = (sale, product) => {
    setSelectedSale(sale)
    setSelectedProduct(product)
    setOpenModalSaleDetail(true)
  }

  const updateAddress = sale => {
    setSelectedSale(sale)
    setShowDialog(true)
  }

  const updateAddressClient = async () => {
    try {
      const { data: sale } = await api.put(`/sales/${selectedSale.ID}/updateAddress`)

      setSales(sales.map(saleState => {
        if(saleState.ID === sale.ID){
          return sale
        }

        return saleState
      }))

    } catch (e) {
      console.log(e)
      
      setAlert('Erro ao conectar com Servidor!')
    }

    setTimeout(() => {
      setShowDialog(false)
      setSelectedSale({})
    }, 200)
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
          {type !== 'open' && <option value={'D_DELIVERED'}>Data</option>}
          <option value={'ID_SALES'}>Código Venda</option>
          <option value={'NOMECLI'}>Nome Cliente</option>
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
            onKeyDown={e => e.key === 'Enter' && searchSales()}
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
            {sales.map(sale => (
              <Row 
                key={sale.ID} 
                sale={sale}
                cancelSubmitSales={cancelSubmitSales}
                reverseStock={reverseStock}
                saleDetail={saleDetail}
                updateAddress={updateAddress}
              />
            ))}
          </tbody>
        </table>
      }

      {openModalSaleDetail &&
        <ModalSaleDetail 
          sale={selectedSale}
          product={selectedProduct}
          openModal={openModalSaleDetail}
          setOpenModal={setOpenModalSaleDetail}
        />
      }

      {showDialog && 
        <ConfirmDialog
          title={'Atualizar cadastro de cliente'}
          body={'Deseja realmente atualizar o cadastro desse cliente?'}
          onConfirm={updateAddressClient}
          onCancel={() => {
            setShowDialog(false)
            setSelectedSale({})
          }}
        />
      }
    </>
  )
}

