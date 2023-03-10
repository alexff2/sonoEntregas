import React, { createContext, useContext, useState } from 'react'

//import api from '../services/api'

//import { useDate } from './dateContext'

const testeVar = [{
  ID: 1660,
  ID_SALES: 15127,
  CODLOJA: 4,
  ID_CLIENT: 119990,
  NOMECLI: 'CLAUDIA REGINA SANTOS DE CASTRO SILVA',
  TOTAL_PROD: 3390,
  DESCONTO: 0,
  TOTAL: 3390,
  EMISSAO: '2021-09-10T03:00:00.000Z',
  STATUS: 'Aberta',
  ENDERECO: 'COND 3D TOWER BL-A AP-605 R DEP RAIMUNDO LEAL 552',
  NUMERO: 'null',
  BAIRRO: 'JARDIM ELDOURADO',
  CIDADE: 'SAO LUIS',
  ESTADO: 'MA',
  PONTOREF: 'KISS MOTEL',
  OBS: 'ENTREGAR ENTRE QUARTA -SEXTA  A  TARDE /  ATE 10 DIAS UTEIS / NAO FAZEMOS MONTAGEM',
  D_ENTREGA2: null,
  USER_ID: 29,
  D_ENTREGA1: '2021-09-24T03:00:00.000Z',
  D_ENVIO: '2021-09-10T03:00:00.000Z',
  VENDEDOR: 'INGRID',
  FONE: '(098)98807-3010',
  CGC_CPF: '880.951.003-82',
  INS_RG: 'null',
  FAX: '(098)98892-2130',
  O_V: '2',
  OBS2: null,
  HAVE_OBS2: null,
  SCHEDULED: false,
  OBS_SCHEDULED: null,
  products: [
    {
      CODPRODUTO: 1682,
      COD_ORIGINAL: '2037-4',
      CODLOJA: 4,
      DESCONTO: 0,
      DESCRICAO: 'BASE COLLECT SUED MARROM 138X188/26',
      DOWN_EST: null,
      ID_SALES: 15127,
      NVTOTAL: 600,
      QUANTIDADE: 1,
      STATUS: 'Enviado',
      UNITARIO1: 600,
      ID_SALE_ID: 1660,
      QTD_MOUNTING: 0,
      QTD_DELIVERING: 0,
      QTD_DELIVERED: 0,
      openQuantity: 1,
      checked: false
    },
    {
      CODPRODUTO: 1635,
      COD_ORIGINAL: '2375-7',
      CODLOJA: 4,
      DESCONTO: 0,
      DESCRICAO: 'COLCHAO POCKET VERONA EPS 100X20',
      DOWN_EST: null,
      ID_SALES: 15127,
      NVTOTAL: 700,
      QUANTIDADE: 1,
      STATUS: 'Finalizada',
      UNITARIO1: 700,
      ID_SALE_ID: 1660,
      QTD_MOUNTING: 1,
      QTD_DELIVERING: 1,
      QTD_DELIVERED: 1,
      openQuantity: 0,
      checked: false
    },
    {
      CODPRODUTO: 1654,
      COD_ORIGINAL: '2587-4',
      CODLOJA: 4,
      DESCONTO: 0,
      DESCRICAO: 'BASE GIZ 100X200X31',
      DOWN_EST: null,
      ID_SALES: 15127,
      NVTOTAL: 490,
      QUANTIDADE: 1,
      STATUS: 'Finalizada',
      UNITARIO1: 490,
      ID_SALE_ID: 1660,
      QTD_MOUNTING: 1,
      QTD_DELIVERING: 1,
      QTD_DELIVERED: 1,
      openQuantity: 0,
      checked: false
    },
    {
      CODPRODUTO: 1751,
      COD_ORIGINAL: '2726-7',
      CODLOJA: 4,
      DESCONTO: 0,
      DESCRICAO: 'COLCHAO COLLEC NAPOLI EPS 138X188/38',
      DOWN_EST: null,
      ID_SALES: 15127,
      NVTOTAL: 1600,
      QUANTIDADE: 1,
      STATUS: 'Finalizada',
      UNITARIO1: 1600,
      ID_SALE_ID: 1660,
      QTD_MOUNTING: 1,
      QTD_DELIVERING: 1,
      QTD_DELIVERED: 1,
      openQuantity: 0,
      checked: false
    }
  ],
  SHOP: 'R. ANIL'
}]

const SaleContext = createContext()

export default function SaleProvider({ children }){
  const [ sales, setSales ] = useState(testeVar)

/*   useEffect(()=>{
    api
      .get('sales/', {
        params: {
          status: 'open'
        }
      })
      .then( resp => setSales(resp.data))
  },[])
 */
  //const { mes, ano } = useDate()

  return(
    <SaleContext.Provider
      value={{ sales, setSales }}
    >
      {children}
    </SaleContext.Provider>
  )
}

export function useSale(){
  const { sales, setSales } = useContext(SaleContext)
  return {sales, setSales}
}