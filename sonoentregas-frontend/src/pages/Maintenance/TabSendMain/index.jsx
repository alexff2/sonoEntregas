import React, { useState } from 'react'

import { useMaintenance } from '../../../context/maintContext'
import { useAuthenticate } from '../../../context/authContext'
import { useModalAlert } from '../../../context/modalAlertContext'
import { 
  dateSqlToReact,
  dateWarranty,
  checkDateWarranty } from '../../../functions/getDate'
import api from '../../../services/api'

import '../../../styles/pages/main.css'

export default function TabSendMain(){
  const [ idSale, setIdSale ] = useState('')
  const [ blockSearchSale, setBlockSearchSale ] = useState(false)
  const [ blockSale, setBlockSale ] = useState(true)
  const [ catDefect, setCatDefect ] = useState([{ID:1, DESCRIPTION: '------'}])
  const [ sale, setSale ] = useState({})
  const [ defect, setDefect ] = useState(1)
  const [ outherDef, setOutherDef ] = useState('NULL')
  const [ warranty, setWarranty ] = useState(true)
  const [ qtd, setQtd ] = useState('')
  const [ obs, setObs ] = useState('')
  const [ mainProd, setMainProd ] = useState({})
  const { setMaintenance } = useMaintenance()
  const { shopAuth, userAuth } = useAuthenticate()
  const { setChildrenError, setOpen: setOpenModalAlert, setType } = useModalAlert()

  const { cod: CodLoja } = shopAuth
  const { ID: idUser } = userAuth

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
            setWarranty(checkDateWarranty(data[0].EMISSAO))
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
        mainProd.OUTHER_DEF = outherDef
        mainProd.OBS = obs
        mainProd.QTD_DELIV = qtd === '' ? mainProd.QTD_DELIV : qtd
        mainProd.ID_USER = idUser

        const { data } = await api.post('maintenance', mainProd)

        setMaintenance(data)
        setBlockSearchSale(false)
        setBlockSale(true)
        setOpenModalAlert(true)
        setType('sucess')
        setChildrenError('Assistência enviada com sucesso!')
        setOutherDef('NULL')
        setDefect(1)
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
            onChange={e => {
              parseInt(e.target.value) === 0 && setOutherDef('NULL')
              setIdSale(e.target.value)
            }}
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
              {catDefect.map(catDef =>(
                <option value={catDef.ID} key={catDef.ID}>{catDef.DESCRIPTION}</option>
                ))}
                <option value="0">Outros</option>
              </select>
            </span>
          </div>
        </div>
        <div>
          <div>Emissão: <span>{sale.EMISSAO}</span></div>
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
              {sale.EMISSAO && dateWarranty(sale.EMISSAO)}
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

      {defect === 0 &&
        <div id='textArea'>
          Outras: 
          <textarea 
            rows={1}
            style={{width: '100%', marginBottom: 10}}
            onChange={e => setOutherDef(e.target.value)}
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
                <td>
                  { mainProd.COD_ORIGINAL === prod.COD_ORIGINAL
                    ? <input 
                        type="number"
                        defaultValue={prod.QTD_DELIV}
                        max={prod.QTD_DELIV}
                        min='1'
                        onChange={e => setQtd(e.target.value)}/> 
                    : prod.QTD_DELIV
                  }
                </td>
                <td>{Intl
                  .NumberFormat('pt-BR', {style: 'currency', currency: 'BRL'})
                  .format(prod.NVTOTAL)}</td>
                <td>{dateSqlToReact(prod.D_DELIVERED)}</td>
                <td>{prod.ID_DELIVERY}</td>
                <td
                  style={setStyleStatus(prod)}
                >
                  {(prod.STATUS_MAIN && prod.STATUS_MAIN !== 'Finalizada') 
                    ? prod.STATUS_MAIN
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

      <div style={{ color: 'var(--red)', marginTop: '1rem' }}>Atenção! Na assistência deve ser enviada apenas um produto. Para enviar outro produto, você deve criar uma nova assistência para a DAV.</div>
    </div>
  )
}

