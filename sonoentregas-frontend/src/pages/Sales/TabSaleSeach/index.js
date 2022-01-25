import React, { useEffect, useState } from "react"
import { AiOutlineArrowDown, AiOutlineArrowUp, AiOutlineSearch } from 'react-icons/ai'

import api from '../../../services/api'
import { dateSqlToReact } from '../../../functions/getDate'
import { getLoja } from '../../../services/auth'

import Modal from '../../../components/Modal'
import ModalSales from './ModalSales'

function Row({ sale, modalDetalProduct, cancelSubmitSales, reverseStock }) {
  const [open, setOpen] = React.useState(false)
  
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
                      produto.STATUS === 'Enviado' && <td id="btnCancel" onClick={() => cancelSubmitSales(produto)}>Cancelar</td>
                    }
                    {produto.STATUS === 'Finalizada' && produto.DOWN_EST && <td id="btnEstornar" onClick={() => reverseStock(produto)}>Estornar Estoque</td>}
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

  const { cod: Codloja } = JSON.parse(getLoja())

  useEffect(()=>{
    api.get(`sales/STATUS/Aberta/null/${Codloja}`)
    .then(resp => {
      if(resp.data){
        setSales(resp.data)
      }
    })
    .catch( e => console.log(e) )
  },[Codloja])

  const searchSales = async () => {
    try {
      if (search !== '') {
        const { data } = await api.get(`sales/${typeSeach}/${search}/null/${Codloja}`)
        if (data.length === 0){
          setChildrenAlertModal('Venda(s) não encontrada(s)!') 
          openMOdalAlert(true)
        } else {
          setSales(data)
        }
      } else {
        setChildrenAlertModal('Preencha o campo de pesquisa!') 
        openMOdalAlert()
        setSales([])
      }
    } catch (e) {
      console.log(e)
      setChildrenAlertModal("Erro ao comunicar com o Servidor")
      openMOdalAlert()
      setSales([])
    }
  }

  const modalDetalProduct = (sale, product) => {
    setOpenModalProduct(true)
    setSaleCurrent(sale)
    setProductCurrent(product)
  }

  const cancelSubmitSales = async produto => {
    try {
      const {data} = await api.post(`vendas`, produto)

      const { data: DataSales } = await api.get(`sales/STATUS/Aberta/null/${Codloja}`)
      setSales(DataSales)

      setChildrenAlertModal(data.msg)
      openMOdalAlert()
    } catch (error) {
      setChildrenAlertModal('Erro no sistema, entrar em contato com ADM')
      console.log(error)
      openMOdalAlert()
    }
  }

  const reverseStock = async produto => {
    try {
      const {data} = await api.post(`vendas/reverse`, produto)

      const { data: DataSales } = await api.get(`sales/STATUS/Aberta/null/${Codloja}`)
      setSales(DataSales)

      setChildrenAlertModal(data.msg)
      openMOdalAlert()
    } catch (error) {
      setChildrenAlertModal('Erro no sistema, entrar em contato com ADM')
      console.log(error)
      openMOdalAlert()
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
            setTypeSeach(e.target.value)
            setSearch('')
          }}
        >
          <option value={'ID_SALES'}>Código Venda</option>
          <option value={'NOMECLI'}>Nome Cliente</option>
          <option value={'D_DELIVERED'}>Finalizadas</option>
          <option value={'D_MOUNTING'}>Iniciadas</option>
        </select>

        <div className="inputsSeachSales">
          <AiOutlineSearch />
          { typeSeach === 'D_DELIVERED' || typeSeach === 'D_MOUNTING' ?
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
              <th>Previsão</th>
            </tr>
          </thead>
          <tbody>
            {sales.map( sale => (
              <Row 
                key={sale.ID} 
                modalDetalProduct={modalDetalProduct}
                sale={sale}
                cancelSubmitSales={cancelSubmitSales}
                reverseStock={reverseStock}
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

