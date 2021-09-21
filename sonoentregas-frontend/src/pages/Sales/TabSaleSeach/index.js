import React, { useEffect, useState } from "react"
import { AiOutlineArrowDown, AiOutlineArrowUp, AiOutlineSearch } from 'react-icons/ai'

import api from '../../../services/api'
import getDate from '../../../functions/getDate'
import { getLoja } from '../../../services/auth'

import Modal from '../../../components/Modal'
import ModalSales from './ModalSales'

const { cod: Codloja } = JSON.parse(getLoja())

function Row({ sale, modalDetalProduct }) {
  const [open, setOpen] = React.useState(false)
  
  return (
    <React.Fragment>
      <tr>
        <td style={{width: 10}} onClick={() => setOpen(!open)}>
          { open ? <AiOutlineArrowUp /> : <AiOutlineArrowDown /> }
        </td>
        <td>{sale.ID_SALES}</td>
        <td>{sale.NOMECLI}</td>
        <td>{getDate(sale.EMISSAO)}</td>
      </tr>

      <tr id="trProdId">
        <td style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={4}>
          <div className={open ? 'tabProdSeach openDiv': 'tabProdSeach'}>
            <h3>
              Produtos
            </h3>
            <table>
              <thead>
                <tr id="trProd">
                  <td>Código</td>
                  <td>Descrição</td>
                  <td>Quantidade</td>
                  <td colSpan={2}>Valor (R$)</td>
                </tr>
              </thead>
              <tbody>
                {sale.products.map((produto) => (
                  <tr key={produto.CODPRODUTO}>
                    <td onClick={() => modalDetalProduct(sale, produto)}>
                      {produto.COD_ORIGINAL}
                    </td>
                    <td onClick={() => modalDetalProduct(sale, produto)}>{produto.DESCRICAO}</td>
                    <td onClick={() => modalDetalProduct(sale, produto)}>{produto.QUANTIDADE}</td>
                    <td onClick={() => modalDetalProduct(sale, produto)}>{
                      Intl
                        .NumberFormat('pt-br',{style: 'currency', currency: 'BRL'})
                        .format(produto.NVTOTAL)
                    }</td>
                    {
                      produto.STATUS === 'Enviado' ? 
                        <td id="btnCancel" onClick={() => console.log('teste')}>Cancelar</td> : null
                    }
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

export default function TabSaleSeach({ openMOdalAlert, setChildrenAlertModal }) {
  const [ openModalProduct, setOpenModalProduct ] = useState(false)
  const [ sales, setSales ] = useState([])
  const [ search, setSearch ] = useState('')
  const [ typeSeach, setTypeSeach ] = useState('ID_SALES')
  const [ saleCurrent, setSaleCurrent ] = useState([])
  const [ productCurrent, setProductCurrent ] = useState([])

  useEffect(()=>{
    api.get(`sales/ID_SALES/6586/null/${Codloja}`)
    .then(resp => setSales(resp.data))
  },[])

  const searchSales = async () => {
    try {
      if (search !== '') {
        const { data } = await api.get(`sales/${typeSeach}/${search}/null/${Codloja}`)
        setSales(data)
      } else {
        setSales([])
        setChildrenAlertModal('Selecione um filtro!')
        openMOdalAlert()
      }
    } catch (e) {
      setChildrenAlertModal(e.response.data)
      openMOdalAlert()
      setSales([])
    }
  }

  const modalDetalProduct = (sale, product) => {
    setOpenModalProduct(true)
    setSaleCurrent(sale)
    setProductCurrent(product)
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
            setTypeSeach(e.target.value)
            setSearch('')
          }}
        >
          <option value={'ID_SALES'}>Código Venda</option>
          <option value={'NOMECLI'}>Nome Cliente</option>
          <option value={'D_DELIVERED'}>Data Entrega</option>
        </select>

        <div className="inputsSeachSales">
          <AiOutlineSearch />
          { typeSeach === 'D_DELIVERED' ?
            <div>
              <input
                type="date" 
                onChange={e => setSearch(e.target.value)}
              />
            </div>:
            <>
              <input
                type="text"
                placeholder="Pesquisar…"
                onChange={e => setSearch(e.target.value)}
                onKeyPress={e => e.key === 'Enter' ? searchSales() : null}
                value={search}
              />
            </>
          }
        </div>

        <button onClick={searchSales}>PESQUISAR</button>
      </div>

      {/*Tabela de vendas*/}
      <div>
        <table>
          <thead>
            <tr>
              <th id="thSales-firstIten"></th>
              <th>Código</th>
              <th>Cliente</th>
              <th>Emissao</th>
            </tr>
          </thead>
          <tbody>
            {sales.map( sale => (
              <Row 
                key={sale.ID} 
                modalDetalProduct={modalDetalProduct}
                sale={sale}
              />
            ))}
          </tbody>
        </table>
      </div>

      <Modal 
        openModal={openModalProduct}
        setOpenModal={setOpenModalProduct}
        styleModal={{
          padding: 0,
          letterSpacing: '-0.5px',
          backgroundColor: '#f5f5f5'
        }}
      >
        <ModalSales
          sale={saleCurrent}
          product={productCurrent}
        />
      </Modal>
    </>
  )
}

