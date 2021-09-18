import React, { useState } from "react"

import api from '../../../services/api'
import getDate from '../../../functions/getDate'

import Modal from '../../../components/Modal'
import ModalSales from './ModalSales'

function Row({ sale, modalDetalProduct }) {
  const [open, setOpen] = React.useState(false)
  
  return (
    <React.Fragment>
      <tr>
        <td>
          b
        </td>
        <td>{sale.ID_SALES}</td>
        <td>{sale.NOMECLI}</td>
        <td>{getDate(sale.EMISSAO)}</td>
      </tr>

      <tr>
        <td style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <div>
            <div>
              <h3>
                Produtos
              </h3>
              <table>
                <thead>
                  <tr>
                    <td>Código</td>
                    <td>Descrição</td>
                    <td>Quantidade</td>
                    <td>Valor (R$)</td>
                  </tr>
                </thead>
                <tbody>
                  {sale.products.map((produto) => (
                    <tr key={produto.CODPRODUTO} onClick={() => modalDetalProduct(sale, produto)}>
                      <td >
                        {produto.COD_ORIGINAL}
                      </td>
                      <td>{produto.DESCRICAO}</td>
                      <td>{produto.QUANTIDADE}</td>
                      <td>{
                        Intl
                          .NumberFormat('pt-br',{style: 'currency', currency: 'BRL'})
                          .format(produto.NVTOTAL)
                      }</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
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

  const searchSales = async () => {
    try {
      if (search !== '') {
        const { data } = await api.get(`sales/${typeSeach}/${search}/null`)
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
      <div>
        <select 
          name="typeSales"
          id="typeSales" 
          onChange={e => {
            setTypeSeach(e.target.value)
            setSearch('')
          }}
        >
          <option value={'ID_SALES'}>Código Venda</option>
          <option value={'NOMECLI'}>Nome Cliente</option>
          <option value={'D_DELIVERED'}>Data Entrega</option>
        </select>

        <div>
          <div>
            Icone
          </div>
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

        <button onClick={searchSales}>Pesquisar</button>
      </div>

      {/*Tabela de vendas*/}
      <div>
        <table>
          <thead>
            <tr>
              <th></th>
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

