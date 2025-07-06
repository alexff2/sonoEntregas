import React, { useEffect, useState } from "react"
import {AiOutlineSearch} from 'react-icons/ai'
import {BsArrowReturnRight} from 'react-icons/bs'

import api from '../../../services/api'
import { dateSqlToReact, getDateToSql } from '../../../functions/getDate'

import { useAuthenticate } from '../../../context/authContext'
import { useModalAlert } from '../../../context/modalAlertContext'

import LoadingCircle from '../../../components/LoadingCircle'
import Status from '../../../components/Status'
import ConfirmDialog from "../../../components/ConfirmDialog"

import ModalSaleDetail from '../ModalSaleDetail'
import './style.css'
import Modal from "../../../components/Modal"

function TdStatus({product}){
  const styleStatus = status => {
    const params = { status, type: 1, color: 1}

    status === 'Entregando' && (params.color = 2)
    status === 'Em lançamento' && (params.color = 4)
    status === 'Finalizada' && (params.color = 1)
    status === 'Devolvido' && (params.color = 3)

    return params
  }

  if(product.STATUS === 'Enviado' && product.QTD_MOUNTING === 0){
    return <span id="btnCancel">Cancelar</span>
  } else if(product.STATUS === 'Finalizada' && product.DOWN_EST){
    return <span id="btnEstornar">Estornar estoque</span>
  } else {
    return <span><Status params={styleStatus(product.STATUS)}/></span>
  }
}

function Row({ sale, cancelSubmitSales, reverseStock, saleDetail, updateAddress }) {
  const [ showDialogDtPrevUpdate, setShowDialogDtPrevUpdate ] = useState(false)
  const [ newDtPrev, setNewDtPrev ] = useState(sale.dtPrevShop)

  const clickProd = (e, prod) => {
    if(e.target.id === 'btnCancel') cancelSubmitSales(prod)
    else if(e.target.id === 'btnEstornar') reverseStock(prod)
    else saleDetail(sale, prod)
  }

  const styleDateDelivery = () => {
    var dateDelivery, dateNow, dateAlert
    dateDelivery = new Date(sale.dtPrevShop)
    dateDelivery.setHours(0,0,0,0)

    dateNow = new Date().setHours(0,0,0,0)

    dateAlert = new Date()
    dateAlert.setDate(dateAlert.getDate()+2)
    dateAlert.setHours(0,0,0,0)

    if (dateDelivery < dateNow) {
      return { color: 'red' }
    } else if (dateDelivery >= dateNow && dateDelivery <= dateAlert){
      return { color: 'blue' }
    } else {
      return { color: 'black' }
    }
  }

  const dtPrevShopUpdateSubmit = async () => {
    try {
      await api.put(`/sales/${sale.ID}/dtPrevShopUpdate`, {newDtPrev})
      sale.dtPrevShop = newDtPrev
      setShowDialogDtPrevUpdate(false)
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className="openClosedTableRows">
      <div  className="initialColumns">
        <div className="columnsSaleInfo">
          <span>{sale.ID_SALES}</span>
          <span style={{cursor: 'pointer'}} onClick={() => updateAddress(sale)}>{sale.NOMECLI}</span>
          <span>{sale.VENDEDOR}</span>
          <span>{dateSqlToReact(sale.EMISSAO)}</span>
          <span
            style={styleDateDelivery()}
            onClick={() => setShowDialogDtPrevUpdate(true)}
          >
            {sale.dtPrevShop && dateSqlToReact(sale.dtPrevShop)}
          </span>
          {
            sale.isWithdrawal
              ? <span style={{color: 'orange'}}>Retirada</span>
              : <>
                  {
                    !sale.D_ENTREGA1
                      ? <span style={{color: 'blue'}}>S/ Agend</span>
                      : <span style={{color: 'green'}}>Aguardando</span>
                  }
                </>
          }
        </div>
        {sale.products.map((product, index) => (
          <div className="productsInfo" key={index} onClick={e => clickProd(e, product)}>
            <TdStatus product={product}/>
            <span><BsArrowReturnRight /></span>
            <span>Qtd: {product.QUANTIDADE}</span>
            <span>{product.NOME}</span>
            <span>Cod: {product.COD_ORIGINAL}</span>
          </div>
        ))}
        
      </div>
      <span className="columnObs">
        - {sale.OBS}
        {sale.HAVE_OBS2 && <div style={{color: 'red', fontWeight: 100}}> - {sale.OBS2}</div>}
      </span>

      <Modal
        openModal={showDialogDtPrevUpdate}
        setOpenModal={setShowDialogDtPrevUpdate}
      >
        <h2>Atualizar Data de Previsão</h2>
        <input
          type="date"
          value={newDtPrev}
          onChange={e => setNewDtPrev(e.target.value)}
        />
        <button
          onClick={dtPrevShopUpdateSubmit}
        >
          Atualizar
        </button>
        <button onClick={() => setShowDialogDtPrevUpdate(false)}>Cancelar</button>
      </Modal>
    </div>
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
      const {data} = await api.post(`sales-shop`, produto)
      getOpenSales()
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
        <div>
          <div className="tableHeaderRowOpenClosed">
            <div className="initialColumns">
              <span>Código</span>
              <span>Cliente</span>
              <span>Vendedor</span>
              <span>Emissão</span>
              <span>Previsão</span>
              <span>Situação</span>
            </div>
            <span className="columnObs">Observação</span>
          </div>
          <div className="tableBodyOpenClosed">
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
          </div>
        </div>
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

