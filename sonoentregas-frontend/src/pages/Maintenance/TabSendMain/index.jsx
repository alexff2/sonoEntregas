import React from 'react'
import { FiAlertTriangle } from 'react-icons/fi'

import { useMaintenance } from '../../../context/maintContext'
import { useAuthenticate } from '../../../context/authContext'
import { useModalAlert } from '../../../context/modalAlertContext'
import { dateWarranty, checkDateWarranty } from '../../../functions/getDate'
import api from '../../../services/api'

import '../../../styles/pages/main.css'

export default function TabSendMain(){
  const [ idSale, setIdSale ] = React.useState('')
  const [ blockSale, setBlockSale ] = React.useState(true)
  const [ catDefect, setCatDefect ] = React.useState([])
  const [ sale, setSale ] = React.useState({})
  const [ defect, setDefect ] = React.useState(999)
  const [ otherDef, setOtherDef ] = React.useState('NULL')
  const [ warranty, setWarranty ] = React.useState(true)
  const [ manufacturingDate, setManufacturingDate ] = React.useState('')
  const [ obs, setObs ] = React.useState('')
  const [ mainProd, setMainProd ] = React.useState({})
  const { setMaintenance } = useMaintenance()
  const { shopAuth, userAuth } = useAuthenticate()
  const { setAlert } = useModalAlert()

  const { cod: CodLoja } = shopAuth
  const { ID: idUser } = userAuth

  const cleanVar = () => {
    setObs('')
    setSale([])
    setIdSale('')
    setMainProd({})
    setManufacturingDate('')
  }

  const searchSale = async e => {
    e.preventDefault()
    try {
      if (isNaN(idSale)) {
        setAlert('Você não pode digitar letra na pesquisa por código!')
        return
      }
      if (idSale === 0 && idSale === '') {
        setAlert('Campo vazio, preencha o campo corretamente!')
        return
      }

      const { data } = await api.get('sale-to-maintenance', { params: { saleId: idSale, storeId: CodLoja } })

      setSale(data)
      setWarranty(checkDateWarranty(data.EMISSAO))
      setBlockSale(false)
    } catch (error) {
      console.log(error)
      if (error.response.data.message) {
        setAlert(error.response.data.message)
        return
      }

      if (error.response.data) {
        setAlert('Erro interno desconhecido, entre em contato com ADM!')
        return
      }

      setAlert('Erro de conexão com o servidor, tente novamente mais tarde!')
    }
  }

  const sendMain = async e => {
    e.preventDefault()
    try {
      if (Object.keys(mainProd).length === 0) {
        setAlert('Selecione um dos produtos para enviar!')
        return
      }

      if (manufacturingDate === '') {
        setAlert('Selecione a data de fabricação!')
        return
      }

      if (defect === 999) {
        setAlert('Selecione o defeito reclamado!')
        return
      }

      if (defect === 0 && (otherDef === '' || otherDef === 'NULL')) {
        setAlert('Descreva o defeito reclamado no campo outras!')
        return
      }

      if (warranty && !checkDateWarranty(sale.issue)) {
        setAlert('A garantia da venda está vencida, verifique a data de emissão!')
        return
      }

      mainProd.WARRANTY = warranty
      mainProd.DEFECT = defect
      mainProd.OTHER_DEF = otherDef
      mainProd.OBS = obs
      mainProd.QTD_DELIV = 1
      mainProd.ID_DELIVERY = 0
      mainProd.MANUFACTURING_DATE = manufacturingDate
      mainProd.ID_USER = idUser

      const { data } = await api.post('maintenance', mainProd)

      setMaintenance(data)
      setBlockSale(true)
      setAlert('Assistência enviada com sucesso!', 'sucess')
      setOtherDef('NULL')
      setDefect(999)
      cleanVar()
      document.getElementById('searchIdSale').focus()
    } catch (error) {
      setAlert('Erro ao lançar assistência, entre em contato com Alexandre!')
      cleanVar()
      console.log(error)
    }
  }

  const cancelSendMain = e => {
    document.getElementById('searchIdSale').focus()
    e.preventDefault()
    setBlockSale(true)
    cleanVar()
  }

  React.useEffect(() => {
    async function getCatDefect(){
      try {
        const { data } = await api.get('catdef')
        setCatDefect(data)
      } catch (error) {
        setAlert('Erro ao buscar categorias de defeito, entre em contato com ADM!')
        console.log(error)
      }
    }
    getCatDefect()
  }, [setAlert])

  return(
    <div>
      <div className='boxSeachMain'>
        <form onSubmit={searchSale}>
          <input 
            id='searchIdSale'
            value={idSale}
            type="text" 
            placeholder='Pesquise pelo código da venda' 
            onChange={e => {
              parseInt(e.target.value) === 0 && setOtherDef('NULL')
              setIdSale(e.target.value)
            }}
            required
            disabled={!blockSale}
          />
          <button className='btnSearch' disabled={!blockSale} type='submit'>BUSCAR</button>
        </form>
      </div>
      <hr />
      <div className='headSendMain'>
        <div>
          <div>DAV Nº: <span>{sale.ID_SALES}</span></div>
          <div>Cliente: <span>{sale.ID_CLIENT} - {sale.NOMECLI}</span></div>
          <div>
            Defeito reclamado: 
            <span>
              <select
                onChange={e => setDefect(parseInt(e.target.value))} 
                disabled={blockSale}
                style={{
                  width: '12rem',
                  height: '2.3rem',
                  backgroundColor: 'inherit',
                  color: 'black'
                }}
                value={defect}
              >
                <option value="999" disabled>Selecione o defeito</option>
                {catDefect.map(catDef =>(
                  <option value={catDef.ID} key={catDef.ID}>{catDef.DESCRIPTION}</option>
                ))}
                <option value="0">Outros</option>
              </select>
            </span>
          </div>
        </div>
        <div>
          <div>Emissão: <span>{sale.issue}</span></div>
          <div style={{display: 'flex', alignItems: 'center'}}>
            Garantia?: &nbsp;
            <input
              type="radio"
              name="warranty"
              disabled={blockSale}
              checked={warranty}
              onChange={() => setWarranty(true)}
            /> 
            <span style={{marginTop: -3}}> &nbsp;sim&nbsp;&nbsp;</span>
            <input
              type="radio"
              name="warranty"
              checked={!warranty}
              disabled={blockSale}
              onChange={() => setWarranty(false)}
            />
            <span style={{marginTop: -3}}> &nbsp;não&nbsp;</span>
            
          </div>
          <div>
            Venc. Garantia: &nbsp;
            <span>
              {dateWarranty(sale.issue)}
            </span>
          </div>
        </div>
        <div>
          <div>
            Fabricação: 
            <input
              type="date"
              value={manufacturingDate}
              onChange={e => setManufacturingDate(e.target.value)}
              style={{ border: 'none', marginBottom: 10, background: 'transparent'}}
              disabled={blockSale}
              />
          </div>
          <div id='textArea'>
            Obs:
            <textarea 
              cols="30"
              rows="2"
              value={obs}
              disabled={blockSale}
              onChange={e => setObs(e.target.value)}
            ></textarea>
          </div>
        </div>
      </div>

      {defect === 0 &&
        <div id='textArea'>
          Outras: 
          <textarea 
            rows={1}
            style={{width: '100%', marginBottom: 10}}
            onChange={e => setOtherDef(e.target.value)}
            ></textarea>
        </div>
      }

      <div className="prodsSale">
        <table>
          <thead>
            <tr>
              <th>Cod. Prod.</th>
              <th>Name</th>
              <th>QTD</th>
              <th>QTD Assis.</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {sale.products && sale.products.map(prod =>(
              <tr key={prod.COD_ORIGINAL}>
                <td>{prod.COD_ORIGINAL}</td>
                <td>{prod.DESCRICAO}</td>
                <td>{prod.QUANTIDADE}</td>
                <td>{prod.QTD_MAINTENANCE}</td>
                <td style={{ textAlign: 'center' }}>
                  {prod.canOpenMaintenanceRequest
                    ? <input type="radio" name='prod' onChange={() => setMainProd(prod)}/>
                    : <FiAlertTriangle size={24} title='Produto sem direito a abrir assistência'/>
                  }
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <hr />

      <div className="boxBtnBorderCiclo">
        <button 
          className='btnBorderCiclo bGgreen'
          disabled={blockSale}
          onClick={sendMain}
        >CRIAR</button>
        <button 
          className='btnBorderCiclo bGred'
          disabled={blockSale}
          onClick={cancelSendMain}
        >CANCELAR</button>
      </div>

      <div style={{ color: 'var(--red)', marginTop: '1rem' }}>
        Atenção! Na assistência deve ser enviada apenas um produto. 
        Para enviar outro produto, você deve criar uma nova assistência para a DAV.
      </div>
    </div>
  )
}

