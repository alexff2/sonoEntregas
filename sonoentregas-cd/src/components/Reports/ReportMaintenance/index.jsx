import React, { useEffect, useState } from 'react'

import api from '../../../services/api'
import { getDateBr, dateWarranty } from '../../../functions/getDates'
import Report from '../index'
import CheckBox from '../../CheckBox'
import './style.css'

export default function ReportMaintenance({maintenance, openModal, setOpenModal}){
  const [catDef, setCatDef] = useState([])

  useEffect(()=>{
    api.get('catdef')
      .then( resp => setCatDef(resp.data))
  },[])

  return(
    <Report
      save={`Relatório da assistência Nº ${maintenance.ID}.pdf`}
      openModal={openModal}
      setOpenModal={setOpenModal}
    >
      <div className="headerReportMaint">
        <img src={`${process.env.REACT_APP_BASE_URL}/imgs/SolftFlex.jpeg`} alt="logo" />
        <h1>RELATÓRIO DE ATENDIMENTO DAS RECLAMAÇÕES  - EXTERNO</h1>
        <div>
          <label>DATA</label>
          <span>{getDateBr(maintenance.D_ENVIO)}</span>
        </div>
        <div className="protocol">
          <label>Nº PROTOCOLO</label>
          <span>{maintenance.ID}</span>
        </div>
      </div>

      <div className="bodyReportMaint">
        <p>1. IDENTIFICAÇÃO DO CONSUMIDOR</p>
        <div className='divSetor'>
          <div>
            <label className="labelField">Cliente: </label>
            <span>{maintenance.NOMECLI}</span>
            <label className="labelField">CPF/CNPJ: </label>
            <span>{maintenance.CGC_CPF}</span>
          </div>
          <div>
            <label className="labelField">Endereço: </label>
            <span>{maintenance.ENDERECO+', '+maintenance.BAIRRO}</span>
          </div>
          <div>
            <label className="labelField">Telefone: </label>
            <span>{maintenance.FONE}</span>
            <label className="labelField">Cidade: </label>
            <span>{maintenance.CIDADE}</span>
            <label className="labelField">UF: </label>
            <span>{maintenance.ESTADO}</span>
          </div>
        </div>
        <p>2. IDENTIFICAÇÃO DO CLIENTE - LOJA</p>
        <div className='divSetor'>
          <div>
            <label className="labelField">Código: </label>
            <span>00</span>
            <label className="labelField">R. Social: </label>
            <span>COMERCIO DE COLCHOES SÃO LUIS EIRELE</span>
          </div>
        </div>
        <p>Ação tomada pelo logista</p>
        <div className='divSetor'>
          <div className='flexCenter'>
            <label>Trocou o produto p/ o consumidor?</label>
            <span className='flexCenter notSublim'>
              <CheckBox check={false} /> &nbsp; Sim &nbsp;
              <CheckBox check={false} /> &nbsp; Não &nbsp;
            </span>
            <label>Data da troca: </label>
            <div className='toFill'></div>
          </div>
        </div>
        <p>3. IDENTIFICAÇÃO DO REPRESENTANTE</p>
        <div className='divSetor'>
          <div>
            <label className="labelField">Código: </label>
            <span style={{fontStyle: 'italic'}}>
              {maintenance.CODLOJA} - {`${maintenance.SHOP_NAME}`.toUpperCase()}
            </span>
          </div>
        </div>
        {/* Garantia*/}
        <div className='divSetor' style={{marginTop: -10}}>
          <div>
            <label className="labelField">Produto:</label>
            <span>{maintenance.PRODUTO}</span>
            <label className="labelField">Código:</label>
            <span>{maintenance.COD_ORIGINAL}</span>
          </div>
          <div className="divWarranty" style={{padding: 0}}>
            <label className="labelField">Garantia:</label>
            <div>
              <div className='flexCenter' style={{padding: 0}}>
                <CheckBox check={!maintenance.WARRANTY} />&nbsp;
                <span className='notSublim'> Não - </span>
                <label className="labelField">
                  Garantia válida até: &nbsp;
                  {dateWarranty(getDateBr(maintenance.EMISSAO))}
                </label>
                <label className="labelField">Fabricação: {getDateBr(maintenance.MANUFACTURING_DATE)}</label>
              </div>
              <div className='flexCenter' style={{padding: 0}}>
                <CheckBox check={maintenance.WARRANTY} />&nbsp;
                <span className='notSublim'> Sim - </span>
                <label className="labelField">Tempo de garantia: 1 ANO</label>
                <label className="labelField">
                  Data da venda: &nbsp;
                  {getDateBr(maintenance.EMISSAO)}
                </label>
              </div>
            </div>
          </div>
        </div>
        <p>DEFEITO RECLAMADO PELO CONSUMIDOR</p>
        <div className='divSetor'>
          <div className='def'>
          {catDef.length > 0 &&
            <table>
              <tbody>
              <tr><td className='textCenter' colSpan={3}>MOTIVOS DE TROCA</td></tr>
              {catDef.map(cat => (
                <tr 
                  key={cat.ID} 
                  className={maintenance.ID_CAT_DEF === cat.ID ? 'colorRed' : ''}
                >
                  <td className='idDef'>{cat.ID}</td>
                  <td className='nameDef'>{cat.DESCRIPTION}</td>
                  <td className='checkDef' style={{textAlign: 'center'}}>
                    { maintenance.ID_CAT_DEF === cat.ID && 'X' }
                  </td>
                </tr>
              ))}
              </tbody>
            </table>
          }
            <img 
              className='imgDef'
              src={`${process.env.REACT_APP_BASE_URL}/imgs/Camas.png`}
              alt="camas" />
          </div>
          {maintenance.OTHER_DEF &&
            <div className='flexCenter'>
              <label>Outros: </label>
              <span style={{color: 'red'}}>{maintenance.OTHER_DEF}</span>
            </div>
          }
        </div>
        <p>4.DISPOSIÇÃO: (ação imediata para resolver o problema apresentado pelo consumidor)</p>
        <div className='divSetor'>
          <div className='flexCenter'>
            <CheckBox check={false} />
            <label>Trocar o produto</label> &nbsp;&nbsp;&nbsp;
            <CheckBox check={false} />
            <label>Outra</label>
            <div className='others'></div>
          </div>
        </div>
        <div className='divSetor signatures'>
          <div>
            <span className='toFill'></span>
            <label>Responsável</label>
          </div>
          <div>
            <span className='toFill'></span>
            <label>Visto</label>
          </div>
        </div>
      </div>
    </Report>
  )
}