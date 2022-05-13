import React, { useState } from 'react'

import { useMaintenance } from '../../../context/mainContext'

import { useModalAlert } from '../../../context/modalAlertContext'
import { dateSqlToReact } from '../../../functions/getDate'
import api from '../../../services/api'
import { getLoja, getUser } from '../../../services/auth'

import '../../../styles/pages/main.css'

export default function TabSendMain(){
  const [ idSale, setIdSale ] = useState('')
  const [ blockSearchSale, setBlockSearchSale ] = useState(false)
  const [ blockSale, setBlockSale ] = useState(true)
  const [ catDefect, setCatDefect ] = useState([{ID:1, DESCRIPTION: '------'}])
  const [ sale, setSale ] = useState({})
  const [ defect, setDefect ] = useState(1)
  const [ warranty, setWarranty ] = useState(false)
  const [ obs, setObs ] = useState('')
  const [ mainProd, setMainProd ] = useState({})
  const { setMaintenance } = useMaintenance()
  const { setChildrenError, setOpen: setOpenModalAlert, setType } = useModalAlert()

  const { cod: CodLoja } = JSON.parse(getLoja())
  const { ID: idUser } = JSON.parse(getUser())

  const setStyleStatus = prod => {
    if (prod.STATUS_MAIN === 'Em Lançamento') {
      return {color: 'var(--blue-logo)'}
    } else if (prod.STATUS_MAIN === 'Em Deslocamento'){
      return {color: 'var(--orange)'}
    } else {
      return {}
    }
  }

  const cleanVar = () => {
    setObs('')
    setSale([])
    setIdSale('')
    setMainProd({})
  }

  const searchSale = async e => {
    e.preventDefault()
    try {
      if (!isNaN(idSale)) {
        if (idSale !== 0 && idSale !== '') {
          const { data } = await api.get(`maintenance/${idSale}/${CodLoja}`)
          if (data.length !== 0) {
            setBlockSearchSale(true)
            setSale(data[0])
            setCatDefect(data[0].catDef)
            setBlockSale(false)
          } else {
            setOpenModalAlert(true)
            setType('alert')
            setChildrenError('Venda não encontrada para esta loja! Verifique se o número da DAV está correto, ou se ela já está com statuos de finalizada no CD.')
          }
        } else {
          setOpenModalAlert(true)
          setType('alert')
          setChildrenError('Campo vazio, preencha o campo corretamente!')
        }
      } else {
        setOpenModalAlert(true)
        setType('alert')
        setChildrenError('Você não pode digitar letra na pesquisa por código!')
      }
    } catch (error) {
      setOpenModalAlert(true)
      setType('alert')
      setChildrenError('Erro ao consultar venda, entre em contato com ADM!')
      console.log(error)
    }
  }

  const sendMain = async e => {
    e.preventDefault()
    try {
      if (Object.keys(mainProd).length !== 0) {
        mainProd.WARRANTY = warranty
        mainProd.DEFECT = defect
        mainProd.OBS = obs
        mainProd.ID_USER = idUser
        const { data } = await api.post('maintenance', mainProd)
        setMaintenance(data)
        setBlockSearchSale(false)
        setBlockSale(true)
        setOpenModalAlert(true)
        setType('sucess')
        setChildrenError('Assistência enviada com sucesso!')
        cleanVar()
        document.getElementById('searchIdSale').focus()
      } else {
        setOpenModalAlert(true)
        setType('alert')
        setChildrenError('Selecione um dos produtos para enviar!')
      }
    } catch (error) {
      setOpenModalAlert(true)
      setType('alert')
      setChildrenError('Erro ao lançar assistência, entre em contato com ADM!')
      cleanVar()
      console.log(error)
    }
  }

  const cancelSendMain = e => {
    document.getElementById('searchIdSale').focus()
    e.preventDefault()
    setBlockSale(true)
    setBlockSearchSale(false)
    cleanVar()
  }

  return(
    <div>
      <div className='boxSeachMain'>
        <form onSubmit={searchSale}>
          <input 
            id='searchIdSale'
            value={idSale}
            type="text" 
            placeholder='Pesquise pelo código da venda' 
            onChange={e => setIdSale(e.target.value)}
            required
            disabled={blockSearchSale}
          />
          <button className='btnSearch' disabled={blockSearchSale} type='submit'>BUSCAR</button>
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
                onChange={e => setDefect(e.target.value)} 
                disabled={blockSale}
                style={{
                  width: '12rem',
                  height: '2.3rem',
                  backgroundColor: 'inherit',
                  color: 'black'
                }}
              >
                {catDefect.map(catDef =>(
                  <option value={catDef.ID} key={catDef.ID}>{catDef.DESCRIPTION}</option>
                ))}
              </select>
            </span>
          </div>
        </div>
        <div>
          <div>Emissão: <span>{sale.EMISSAO}</span></div>
          <div>
            Valor: 
            <span>
              {sale.TOTAL_PROD && Intl
                .NumberFormat('pt-br', {style: 'currency', currency: 'BRL'})
                .format(sale.TOTAL_PROD)
              }
            </span>
          </div>
          <div style={{display: 'flex'}}>
            Garantia?: &nbsp;
            <span style={{display: 'flex', alignItems: 'center'}}>
              <input
                type="radio"
                name="warranty"
                disabled={blockSale}
                onChange={() => setWarranty(true)}
              />  <div style={{marginTop: -3}}> &nbsp;sim&nbsp;&nbsp;</div>
              <input
                type="radio"
                name="warranty"
                checked
                disabled={blockSale}
                onChange={() => setWarranty(false)}
              /> <div style={{marginTop: -3}}> &nbsp;não&nbsp;</div>
            </span>
          </div>
        </div>
        <div>
          <div id='textArea'>
            Obs:
            <textarea 
              cols="30"
              rows="2"
              value={obs}
              disabled={blockSale}
              onChange={e => setObs(e.target.value)}
            ></textarea></div>
        </div>
      </div>

      <div className="prodsSale">
        <table>
          <thead>
            <tr>
              <th>Cod. Prod.</th>
              <th>Name</th>
              <th>QTD</th>
              <th>Valor</th>
              <th>Dat. Entr.</th>
              <th>Cod. Entr.</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {sale.products && sale.products.map(prod =>(
              <tr key={prod.COD_ORIGINAL}>
                <td>{prod.COD_ORIGINAL}</td>
                <td>{prod.DESCRICAO}</td>
                <td>{prod.QTD_DELIV}</td>
                <td>{Intl
                  .NumberFormat('pt-BR', {style: 'currency', currency: 'BRL'})
                  .format(prod.NVTOTAL)}</td>
                <td>{dateSqlToReact(prod.D_DELIVERED)}</td>
                <td>{prod.ID_DELIVERY}</td>
                <td
                  style={setStyleStatus(prod)}
                >
                  {(prod.STATUS_MAIN && prod.STATUS_MAIN !== 'Finalizada') ? prod.STATUS_MAIN
                  :<input type="radio" name='prod' onChange={() => setMainProd(prod)}/>
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

      <div style={{ color: 'var(--red)', marginTop: '1rem' }}>Atenção! Na assistência deve ser enviada apenas um produto, para enviar outro, deve ser criada um nova assistência para a DAV.</div>
    </div>
  )
}

