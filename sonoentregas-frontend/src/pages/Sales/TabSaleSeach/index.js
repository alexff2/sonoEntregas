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

export default function TabSaleSeach() {
  const [ openModalProduct, setOpenModalProduct ] = useState(false)
  const [ sales, setSales ] = useState([])
  const [ search, setSearch ] = useState()
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
      }
    } catch (e) {
      alert(e)
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
          onChange={e => setTypeSeach(e.target.value)}
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
            <input 
              type="date" 
              onChange={e => setSearch(e.target.value)}
            />:
            <input
              placeholder="Pesquisar…"
              onChange={e => setSearch(e.target.value)}
              onDragEnter={searchSales}
            />
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

      <Modal openModal={openModalProduct}>
        <ModalSales
          sale={saleCurrent}
          product={productCurrent}
        />
      </Modal>
    </>
  )
}

