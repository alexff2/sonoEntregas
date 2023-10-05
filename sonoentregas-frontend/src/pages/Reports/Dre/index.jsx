import React, { useState, useEffect } from 'react'
import Modal from '../../../components/Modal'

import api from '../../../services/api'
import { toLocString } from '../../../functions/toLocString'

import { useModalAlert } from '../../../context/modalAlertContext'
import { useAuthenticate } from '../../../context/authContext'

import './styles.css'

export default function Dre(){
  const [isOpenFilter, setIsOpenFilter] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [renderDre, setRenderDre] = useState(false)
  const [ selectShop, setSelectShop ] = useState('')
  const [ shops, setShops ] = useState([])
  const [ dateStart, setDateStart ] = useState('')
  const [ dateEnd, setDateEnd ] = useState('')
  const [ salesReturns, setSalesReturns ] = useState({
    value: 0,
    percent: 0,
    cost: {
      value: 0,
      percent: 0
    }
  })
  const [ revenues, setRevenues ] = useState({
    revenues: [],
    total: 0
  })
  const [ variableExpenses, setVariableExpenses ] = useState({
    variableExpenses: [],
    total: {
      value: 0,
      percent: 0
    },
    cmv: {
      value: 0,
      percent: 0
    }
  })
  const [ fixedExpenses, setFixedExpenses ] = useState({
    variableExpenses: [],
    total: {
      value: 0,
      percent: 0
    }
  })
  const [ grossContributionMargin, setGrossContributionMargin ] = useState({
    value: 0,
    percent: 0
  })
  const [ netResult, setNetResult ] = useState({
    value: 0,
    percent: 0
  })
  const [ balancePoint, setBalancePoint ] = useState({
    value: 0,
    percent: 0
  })
  const [ financialSummary, setFinancialSummary ] = useState({
    titles: 0,
    card: 0,
    check: 0,
    billsToPay: 0,
    purchases: 0
  })
  const [ currentStock, setCurrentStock ] = useState({
    qtdDifferentProducts: 0,
    salePrice: 0,
    saleCostPrice: 0,
    purchaseCostPrice: 0,
    purchasePrice: 0,
    stock: 0
  })
  const { setAlert } = useModalAlert()
  const { shopAuth } = useAuthenticate()

  useEffect(() => {
    api
      .get('connections')
      .then( resp => {
        const datas = resp.data.filter((shop, i) => i > 1)
        setShops(datas)
        setSelectShop((shopAuth.cod-2).toString())
      })
      .catch( e => {
        console.log(e)
        !e.response
          ? setAlert('Erro ao conectar com servidor, entre em contato com Bruno!')
          : setAlert('Erro ao processar requisição ao servidor, entre em contato com Alexandre!')
      })
  },[setAlert, shopAuth])

  const submitFilter = async e => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const { data } = await api.get('/reports/dre', {
        params: {
          dateStart,
          dateEnd,
          shop: parseFloat(selectShop)+2
        }
      })

      setRevenues(data.revenues)
      setSalesReturns(data.revenues.salesReturns)
      setVariableExpenses(data.variableExpenses)
      setGrossContributionMargin(data.grossContributionMargin)
      setFixedExpenses(data.fixedExpenses)
      setNetResult(data.netResult)
      setBalancePoint(data.balancePoint)
      setFinancialSummary(data.financialSummary)
      setCurrentStock(data.currentStock)

      setIsOpenFilter(false)
      setRenderDre(true)
      setIsLoading(false)
    } catch (e) {
      console.log(e.response)
      if(e.response.data.message === 'pleases provide dates!'){
        setAlert('Por favor, informe as datas!')
      } else if(e.response.data.message === 'date end is less than date start!'){
        setAlert('Por favor, informe uma data final maior que a data inicial!')
      } else {
        setAlert('Erro na requisição! Entre em contato com o suporte.')
      }
    }
  }

  return(
    <>{ !renderDre ? <div></div> :
      <div className="dreContainer">
        <button className="filterBtn" onClick={() => setIsOpenFilter(true)}>Nova Consulta</button>

        <div className="line"></div>
        <div className="dreHeader">
          <h1>Demonstrativo de resultados: 01/09/2023 até 30/09/2023</h1>
          <p>Nome da Loja</p>
          <p>Endereço da loja</p>
          <p>** Fones: (98) 3241-1220 **</p>
        </div>

        <div className="dreTable">
          <h2>DRE</h2>
          <table className="tablesInDre">
            <thead>
              <tr>
                <th></th>
                <th>Valor R$</th>
                <th>%</th>
              </tr>
            </thead>

            <tbody>
              <tr className='trHeader'>
                <td>A - RECEITA BRUTA</td>
                <td>{toLocString(revenues.total)}</td>
                <td>100,00 %</td>
              </tr>
              { salesReturns.value > 0 &&
                <tr>
                  <td>(-) 000 - DEVOLUÇÕES</td>
                  <td>{toLocString(salesReturns.value)}</td>
                  <td>{toLocString(salesReturns.percent)} %</td>
                </tr>
              }
              {revenues.revenues?.map(revenue => (
                <tr key={revenue.id}>
                  <td>{((revenue.id).toString()).length === 1 ? '00' : '0'}{revenue.id} - {revenue.name}</td>
                  <td>{toLocString(revenue.value)}</td>
                  <td>{toLocString(revenue.percent)} %</td>
                </tr>
              ))}
              <tr className='trHeader'>
                <td>B - CUSTOS VARIÁVEIS</td>
                <td>{toLocString(variableExpenses.total.value)}</td>
                <td>{toLocString(variableExpenses.total.percent)} %</td>
              </tr> 
              { salesReturns.cost.value > 0 &&
                <tr>
                  <td>(-) 99998 - CDV (Custo de devolução)</td>
                  <td>{toLocString(salesReturns.cost.value)}</td>
                  <td>{toLocString(salesReturns.cost.percent)} %</td>
                </tr>
              }
              <tr>
                <td>99999 - CMV (Custo de mercadoria vendida)</td>
                <td>{toLocString(variableExpenses.cmv.value)}</td>
                <td>{toLocString(variableExpenses.cmv.percent)} %</td>
              </tr>
              { variableExpenses.variableExpenses?.map(variableExpense => (
                <tr key={variableExpense.id}>
                  <td>{((variableExpense.id).toString()).length === 1 ? '00' : '0'}{variableExpense.id} - {variableExpense.name}</td>
                  <td>{toLocString(variableExpense.value)}</td>
                  <td>{toLocString(variableExpense.percent)} %</td>
                </tr>
              ))}

              <tr className='trHeader'>
                <td>C - MARGEM DE CONTRIBUIÇÃO (A-B)</td>
                <td>{toLocString(grossContributionMargin.value)}</td>
                <td>{toLocString(grossContributionMargin.percent)} %</td>
              </tr>

              <tr className='trHeader'>
                <td>D - DESPESAS OPERACIONAIS</td>
                <td>{toLocString(fixedExpenses.total.value)}</td>
                <td>{toLocString(fixedExpenses.total.percent)} %</td>
              </tr>
              { fixedExpenses.fixedExpenses?.map(fixedExpense => (
                <tr key={fixedExpense.id}>
                  <td>{((fixedExpense.id).toString()).length === 1 ? '00' : '0'}{fixedExpense.id} - {fixedExpense.name}</td>
                  <td>{toLocString(fixedExpense.value)}</td>
                  <td>{toLocString(fixedExpense.percent)} %</td>
                </tr>
              ))}
            </tbody>

            <tfoot>
              <tr className='trFoot'>
                <th>E - RESULTADO LÍQUIDO (C-D)</th>
                <th>{toLocString(netResult.value)}</th>
                <th>{toLocString(netResult.percent)} %</th>
              </tr>
            </tfoot>
          </table>
        </div>

        <h2>PONTO DE EQUILÍBRIO</h2>
        <table className="tablesInDre">
          <thead>
            <tr className='trRadius'>
              <th>F - PONTO DE EQUILÍBRIO</th>
              <th>{toLocString(balancePoint.value)}</th>
              <th>{toLocString(balancePoint.percent)} %</th>
            </tr>
          </thead>
        </table>

        <h2>RESUMO DO FINANCEIRO</h2>
        <table className="tablesInDre">
          <tbody>
            <tr>
              <td>RESUMO DO CONTAS A RECEBER</td>
              <td>{toLocString(financialSummary.titles)}</td>
              <td></td>
            </tr>
            <tr>
              <td>RESUMO DO CONTAS A CHEQUE</td>
              <td>{toLocString(financialSummary.check)}</td>
              <td></td>
            </tr>
            <tr>
              <td>RESUMO DO CONTAS CARTÃO</td>
              <td>{toLocString(financialSummary.card)}</td>
              <td></td>
            </tr>
            <tr>
              <td>RESUMO DO CONTAS A PAGAR</td>
              <td>{toLocString(financialSummary.billsToPay)}</td>
              <td></td>
            </tr>
            <tr>
              <td>COMPRAS NO PERÍODO</td>
              <td>{toLocString(financialSummary.purchases)}</td>
              <td></td>
            </tr>
          </tbody>
        </table>

        <h2>ESTOQUE MONETÁRIO ATUAL</h2>
        <table className="tablesInDre" style={{marginBottom: 20}}>
          <tbody>
            <tr>
              <td>PREÇO DE COMPRA</td>
              <td>{toLocString(currentStock.purchasePrice)}</td>
            </tr>
            <tr>
              <td>PREÇO CUSTO DE COMPRA</td>
              <td>{toLocString(currentStock.purchaseCostPrice)}</td>
            </tr>
            <tr>
              <td>PREÇO CUSTO DE VENDA</td>
              <td>{toLocString(currentStock.saleCostPrice)}</td>
            </tr>
            <tr>
              <td>PREÇO DE VENDA</td>
              <td>{toLocString(currentStock.salePrice)}</td>
            </tr>
          </tbody>
        </table>

      </div>}

      <Modal openModal={isOpenFilter} setOpenModal={setIsOpenFilter} closeOnOverLaw={false}>
        <form className="filterContainer" onSubmit={submitFilter}>
          <h2>Filtro Demonstrativo de Resultados</h2>

          <hr />
          <div className="filterDate">
            <label htmlFor="shops">Loja: </label>
            <select
              id="shops"
              className='selectShops'
              value={selectShop}
              onChange={(e) => setSelectShop(e.target.value)}
              required
            >
              {shops.map((shop, i) => <option value={i} key={i}>{shop.database}</option>)}
            </select>
          </div>
          <div className="filterDate">
            <label htmlFor="dateStart">Data Inicial: </label>
            <input
              type="date"
              id="dateStart"
              onChange={e => setDateStart(e.target.value)}
              required
            />
          </div>
          <div className="filterDate">
            <label htmlFor="dateEnd">Data Final: </label>
            <input
              type="date"
              id="dateEnd"
              onChange={e => setDateEnd(e.target.value)}
              required
            />
          </div>

          <hr />
          <button type='submit' disabled={isLoading}>
            Gerar DRE
            { isLoading &&
              <div className="spinner-container">
                <div className="spinner"></div>
              </div>
            }
          </button>

        </form>
      </Modal>
    </>
  )
}