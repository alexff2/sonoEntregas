import React, { useState, useEffect } from "react"
import { useReactToPrint } from "react-to-print"

import Modal from '../../../components/Modal'
import { useAuthenticate } from '../../../context/authContext'
import { useModalAlert } from '../../../context/modalAlertContext'
import { dateSqlToReact } from "../../../functions/getDate"
import api from '../../../services/api'
import "./SalesCommissionsReport.css"

export default function SalesCommissionsReport() {
  const [isOpenFilter, setIsOpenFilter] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [selectShopId, setSelectShopId] = useState()
  const [shops, setShops] = useState([])
  const [dates, setDates] = useState({ month: new Date().getMonth() + 1, year: new Date().getFullYear() })
  const [dataReport, setDataReport] = useState([])

  const { shopAuth, userAuth } = useAuthenticate()
  const { setAlert } = useModalAlert()
  
  const componentRef = React.useRef()
  const shop = shops.find((shop, i) => (i+2) === selectShopId)?.database

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: `Comissões de Vendas período ${dateSqlToReact(dates.start)} a ${dateSqlToReact(dates.end)} loja ${shop}`,
  })

  const submitFilter = async e => {
    if (!dates.year || !dates.month) {
      return setAlert('Por favor, preencha o mês e o ano.')
    }

    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await api.get('reports/sales-commissions', {
        params: {
          shopId: selectShopId,
          month: dates.month.toString().padStart(2, '0'),
          year: dates.year
        }
      })
      setDataReport(response.data)
      setIsOpenFilter(false)
    } catch (error) {
      console.log(error)
      setAlert('Erro ao gerar relatório, tente novamente!')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    api
      .get('connections')
      .then( resp => {
        const datas = resp.data.filter((shop, i) => i > 1)
        setShops(datas)

        setSelectShopId(shopAuth.cod)
      })
      .catch( e => {
        console.log(e)
        !e.response
          ? setAlert('Erro ao conectar com servidor, entre em contato com Bruno!')
          : setAlert('Erro ao processar requisição ao servidor, entre em contato com Alexandre!')
      })
  },[setAlert, shopAuth, userAuth])

  return (
    <>
      {!isOpenFilter && (
        <div className="print-button-commission-report">
          <button onClick={() => setIsOpenFilter(true)}>Filtro</button>
          <button onClick={handlePrint}>Imprimir</button>
        </div>
      )}
      <div className="sales-commissions-report" ref={componentRef}>
        { !isOpenFilter && (
          <>
            <h2>Relatório de Comissões de Vendas</h2>
            <p>Período: {dateSqlToReact(dates.start)} a {dateSqlToReact(dates.end)}</p>
            <p>Loja: {shop}</p>
            <table className="sales-table">
              <thead>
                <tr>
                  <th>Vendedor</th>
                  <th>Receita Bruta</th>
                  <th>Devoluções</th>
                  <th>Receita Líquida</th>
                  <th>Comissão</th>
                </tr>
              </thead>
              <tbody>
                {dataReport.map(data => (
                  <React.Fragment key={data.seller}>
                    <tr>
                      <td>{data.seller}</td>
                      <td>
                        {data.grossRevenue.toLocaleString("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        })}
                      </td>
                      <td>
                        {data.returns.toLocaleString("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        })}
                      </td>
                      <td>
                        {data.netRevenue.toLocaleString("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        })}
                      </td>
                      <td>
                        {data.commissionPercent.toFixed(2)}% <br />
                        <span className="commission-value">
                          {data.commissionValue.toLocaleString("pt-BR", {
                            style: "currency",
                            currency: "BRL",
                          })}
                        </span>
                      </td>
                    </tr>
                    <tr className="payment-details-row">
                      <td colSpan={6}>
                        <table className="payment-details-table">
                          <thead>
                            <tr>
                              <th>Tipo de Pagamento</th>
                              <th>Valor</th>
                            </tr>
                          </thead>
                          <tbody>
                            {data.payments.map((p) => (
                              <tr key={p.type}>
                                <td>{p.type}</td>
                                <td>
                                  {p.amount.toLocaleString("pt-BR", {
                                    style: "currency",
                                    currency: "BRL",
                                  })}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </td>
                    </tr>
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </>
        )}

        <Modal openModal={isOpenFilter} setOpenModal={setIsOpenFilter} closeOnOverLaw={false}>
          <form className="filterContainer" onSubmit={submitFilter}>
            <h2>Filtro Relatório de comissões</h2>
            <hr />
            {(userAuth.OFFICE === 'Dev' | userAuth.OFFICE === 'Master') && (
              <div className="filterDate">
                <label htmlFor="shops">Loja: </label>
                <select
                  id="shops"
                  className='selectShops'
                  value={selectShopId}
                  onChange={(e) => setSelectShopId(e.target.value)}
                  required
                >
                  {shops.map((shop, i) => <option value={i+2} key={i}>{shop.database}</option>)}
                </select>
              </div>
            )}
            <div className="filterDate filterCommissionYear">
              <label htmlFor="dateYear">Ano: </label>
              <input
                type="number"
                id="dateYear"
                value={dates.year}
                onChange={e => setDates({ ...dates, year: e.target.value })}
                required
              />
            </div>
            <div className="filterDate filterCommissionMonth">
              <label htmlFor="dateMonth">Mês: </label>
              <select name="dateMonth" id="dateMonth" value={dates.month} onChange={e => setDates({ ...dates, month: e.target.value })}>
                {Array.from({ length: 12 }, (_, i) => (
                  <option key={i} value={i + 1}>
                    {new Date(0, i).toLocaleString("pt-BR", { month: "long" })}
                  </option>
                ))}
              </select>
            </div>

            <hr />
            <button type='submit' disabled={isLoading}>
              Gerar relatório
              { isLoading &&
                <div className="spinner-container">
                  <div className="spinner"></div>
                </div>
              }
            </button>

          </form>
        </Modal>
      </div>
    </>
  )
}
