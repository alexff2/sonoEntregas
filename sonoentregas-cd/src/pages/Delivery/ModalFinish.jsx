import React, { useState, useEffect } from "react"
import {
  makeStyles,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Checkbox,
  Paper
} from "@material-ui/core"

import { ButtonCancel, ButtonSucess } from '../../components/Buttons'
import ModalALert from '../../components/ModalAlert'

import { getDateBr } from '../../functions/getDates'

//context
import { useDelivery } from '../../context/deliveryContext'
import { useDeliveryFinish } from '../../context/deliveryFinishContext'
import { useSale } from '../../context/saleContext'

import api from '../../services/api'

const useStyles = makeStyles(theme => ({
  //Style form select\
  titleModalFinish: {
    width: '100%',
    textAlign: 'Center',
    marginTop: -30
  },
  divHeader:{
    width: '100%',
    display: 'flex',
    marginTop: -20,
    marginBottom: 15,
    '& span' : {
      fontWeight: 700
    },
    '& > div': {
      width: '50%',
      '& > p' : {
        marginBottom: 2,
        marginTop: 2,
      },
      '& > div' : {
        marginBottom: 2,
      }
    }
  },
  //Style buttons
  btnActions: {
    width: '100%',
    padding: theme.spacing(2, 0),
    display: 'flex',
    justifyContent: 'flex-end'
  },
  root: {
    '& > *': {
      borderBottom: 'unset'
    },
    background: theme.palette.primary.light
  },
  tableHead: {
    background: theme.palette.primary.main
  },
  tableHeadCell: {
    textAlign: 'end',
    color: theme.palette.common.white,
    fontWeight: theme.typography.fontWeightBold
  },
  tableHeadCellStart:{
    color: theme.palette.common.white,
    fontWeight: theme.typography.fontWeightBold
  }
}))

const RowProd = ({product, status, stateCheckedAllProd, type })=>{
  const [ checkProd, setCheckProd ] = useState(false)

  useEffect(()=>{
    setCheckProd(stateCheckedAllProd)
  },[stateCheckedAllProd])

  const checkedPro = e => {
    if (e.target.checked) {
      setCheckProd(true)
      product.STATUS = 'Finalizada'
      product.DELIVERED = false //false is zero
      product.REASON_RETURN = 'NULL'
    } else {
      setCheckProd(false)
      product.STATUS = 'Enviado'
      product.DELIVERED = true //false is zero
    }
  }

  return(
    <>
      <TableRow>
        <TableCell component="th" scope="row">
          {product.CODPRODUTO}
        </TableCell>
        <TableCell>{product.DESCRICAO}</TableCell>
        <TableCell>{product.QTD_DELIV}</TableCell>
        <TableCell align="right">{
          Intl
            .NumberFormat('pt-br',{style: 'currency', currency: 'BRL'})
            .format(product.NVTOTAL)
        }</TableCell>
        {type === 'open' &&
          <TableCell align="right">
            <Checkbox
              onChange={checkedPro}
              checked={checkProd}
            />
          </TableCell>
        }
        {status === 'Finalizada' &&
          <TableCell align="right">
            {product.DELIVERED ? 
              <span style={{
                fontSize: 12,
                backgroundColor: 'red',
                color: 'white',
                padding: 3
              }}>Retorno</span>  : 
              <span style={{
                fontSize: 12,
                backgroundColor: 'green',
                color: 'white',
                padding: 3
              }}>Entregue</span>}
          </TableCell>
        }
      </TableRow>
      {(!checkProd && type === 'open') &&
        <TableRow>
          <TableCell colSpan={5}>
            <Box>
              Motivo de retorno: <input type="text" onChange={
                e => product.REASON_RETURN = e.target.value
              }/>
            </Box>
          </TableCell>
        </TableRow>
      }
      { (status === 'Finalizada' && product.REASON_RETURN !== null) &&
        <TableRow>
          <TableCell colSpan={5}>
            <Box>
              Motivo de retorno: {product.REASON_RETURN}
            </Box>
          </TableCell>
        </TableRow>
      }
    </>
  )
}

const RowSale = ({ sale, classes, type, status, stateCheckedAllProd }) => {
  return(
    <React.Fragment>
      <TableRow className={classes.root}>
        <TableCell component="th" scope="row">
          {sale.ID_SALES}
        </TableCell>
        <TableCell>{sale.NOMECLI}</TableCell>
        <TableCell align="right">{
          Intl
          .NumberFormat('pt-br',{style: 'currency', currency: 'BRL'})
          .format(sale.TOTAL)
        }</TableCell>
        <TableCell align="right">{getDateBr(sale.EMISSAO)}</TableCell>
      </TableRow>

      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Box margin={1}>
            <Typography variant="h6" gutterBottom component="div">
              Produtos
            </Typography>
            <Table size="small" aria-label="purchases">
              <TableHead>
                <TableRow>
                  <TableCell>Código</TableCell>
                  <TableCell>Descrição</TableCell>
                  <TableCell>Qtd. Entrega</TableCell>
                  <TableCell align="right">Valor (R$)</TableCell>
                  {type === 'open' && <TableCell></TableCell>}
                </TableRow>
              </TableHead>
              <TableBody>
                {sale.products.map((product) => (
                  <RowProd key={product.CODPRODUTO}
                    product={product}
                    status={status}
                    stateCheckedAllProd={stateCheckedAllProd}
                    type={type}
                  />
                ))}
              </TableBody>
            </Table>
          </Box>
        </TableCell>
      </TableRow>
    </React.Fragment>
  )
}

export default function ModalFinish({ setOpen, selectDelivery, type }){
  //States
  const [ openModalAlert, setOpenModalAlert ] = useState(false)
  const [ childrenModalAlert, setChildrenOpenModalAlert ] = useState('')
  const [ dateDelivery, setDateDelivery ] = useState(false)
  const [ stateCheckedAllProd, setStateCheckedAllProd ] = useState(false)
  const [ disabledBtnGrav, setDisabledBtnGrav ] = useState(false)

  const { setDelivery } = useDelivery()
  const { deliveryFinish, setDeliveryFinish } = useDeliveryFinish()
  const stateSales = useSale()

  const classes = useStyles()

  useEffect(()=>{
    type === 'open' && selectDelivery.sales.forEach(sale =>{
      sale.products.forEach(produto => {
        produto.DELIVERED = true
        produto.STATUS = 'Enviado'
      })
    })
  },[selectDelivery, type])

  //Functions
  const checkedAllProd = e => {
    if (e.target.checked){
      setStateCheckedAllProd(true)
      selectDelivery.sales.forEach(sale =>{
        sale.products.forEach(produto => {
          produto.STATUS = 'Finalizada'
          produto.DELIVERED = false
        })
      })
    } else {
      setStateCheckedAllProd(false)
      selectDelivery.sales.forEach(sale =>{
        sale.products.forEach(produto => {
          produto.STATUS = 'Enviado'
          produto.DELIVERED = true
        })
      })
    }
  }
  const finish = async () => {
    try {
      if(dateDelivery){
        setDisabledBtnGrav(true)
    
        selectDelivery.STATUS = 'Finalizada'
        selectDelivery['dateDelivery'] = dateDelivery
  
        selectDelivery.sales.forEach(sale =>{
          sale.products.forEach(produto => {
            if (produto.QUANTIDADE !== produto.QTD_DELIVERED + produto.QTD_DELIV) produto['UPST'] = false
          })
        })
  
        const { data } = await api.put(`deliverys/status/${selectDelivery.ID}`, selectDelivery)
  
        if(data.ID){
          const resp = await api.get('sales/', {
            params: {
              status: 'open'
            }
          })
          stateSales.setSales(resp.data)
        }

        const { data: dataDeliv } = await api.get('deliverys/status/') 
        setDelivery(dataDeliv)
        setDeliveryFinish([...deliveryFinish, selectDelivery])
        setOpen(false)
      } else {
        setChildrenOpenModalAlert('Selecione a data de entrega')
        setOpenModalAlert(true)
      }
    } catch (error) {
      console.log(error)
      setChildrenOpenModalAlert('Erro de conexão, entrar em contato com ADM')
      setOpenModalAlert(true)
    }
  }

  //Main Component
  return(
    <form>
      <h3 className={classes.titleModalFinish}>{selectDelivery.DESCRIPTION} - {selectDelivery.sales.length} Venda(s)</h3>
      {selectDelivery.DRIVER && <div className={classes.divHeader}>    
        <div>
          <p><span>Motorista: </span>{selectDelivery.DRIVER}</p>
          <p><span>Auxiliar: </span> {selectDelivery.ASSISTANT}</p>
        </div>

        <div>
          <p><span>Veículo: </span> {selectDelivery.CAR}</p>
          {type !== 'close' &&
            <div>
              <span>Data da Entrega: </span>
              <input 
                type="date"
                required
                onChange={e => setDateDelivery(e.target.value)}
              />&nbsp;
            </div>
          }
        </div>
        {type !== 'close' &&<span>Todos: <Checkbox onChange={checkedAllProd}/></span>}
      </div>}

      <TableContainer component={Paper}>
        <Table aria-label="collapsible table">
          <TableHead>
            <TableRow className={classes.tableHead}>
              <TableCell className={classes.tableHeadCellStart}>Nº Venda</TableCell>
              <TableCell className={classes.tableHeadCellStart}>Nome do Cliente</TableCell>
              <TableCell className={classes.tableHeadCell}>Valor Total</TableCell>
              <TableCell className={classes.tableHeadCell}>Emissão</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {selectDelivery.sales.map((sale, index) => (
              <RowSale
                key={index}
                sale={sale}
                classes={classes}
                type={type}
                status={selectDelivery.STATUS}
                stateCheckedAllProd={stateCheckedAllProd}
              />
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {type !== 'close' &&
        <div className={classes.btnActions}>
          <ButtonSucess 
            children={"Finalizar"}
            className={classes.btnSucess}
            onClick={finish}
            disabled={disabledBtnGrav}
          />
          <ButtonCancel 
            children="Cancelar"
            onClick={() => setOpen(false)}
            className={classes.btnCancel}
          />
        </div>
      }

      <ModalALert
        open={openModalAlert}
        setOpen={setOpenModalAlert}
        children={childrenModalAlert}
      />
    </form>
  )
}