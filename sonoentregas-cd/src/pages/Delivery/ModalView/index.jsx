import React, { useState, useEffect } from "react"
import {
  makeStyles,
  Table,
  TableBody,
  TableContainer,
  Checkbox,
  Paper,
  AppBar,
  Tabs,
  Tab
} from "@material-ui/core"

import { ButtonCancel, ButtonSuccess } from '../../../components/Buttons'
import ModalALert from '../../../components/ModalAlert'
import { TabPanel, a11yProps } from '../../../components/TabPanel'

import RowSale from './RowSale'
import TableHeadSale from './TableHeadSale'

import { getDateBr } from '../../../functions/getDates'

//context
import { useDelivery } from '../../../context/deliveryContext'
import { useDeliveryFinish } from '../../../context/deliveryFinishContext'
import { useSale } from '../../../context/saleContext'

import api from '../../../services/api'

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
  bodyTab: {
    background: '#FAFAFA',
    border: `1px solid #F7F7F7`,
    minWidth: 771,
    minHeight: 300
  }
}))

export default function ModalView({ setOpen, selectDelivery, type }){
  //States
  const [value, setValue] = useState(0)
  const [ openModalAlert, setOpenModalAlert ] = useState(false)
  const [ childrenModalAlert, setChildrenOpenModalAlert ] = useState('')
  const [ dateDelivery, setDateDelivery ] = useState(false)
  const [ stateCheckedAllProd, setStateCheckedAllProd ] = useState(false)
  const [ disabledBtnSave, setDisabledBtnSave ] = useState(false)

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
        setDisabledBtnSave(true)
    
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

        const { data: dataDelivery } = await api.get('deliverys/status/') 
        setDelivery(dataDelivery)
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
      <h3 className={classes.titleModalFinish}>
        {selectDelivery.ID_CAR === 0
          ? `${selectDelivery.DESCRIPTION} ${getDateBr(selectDelivery.D_PREVISION)}`
          : selectDelivery.DESCRIPTION
        } - {selectDelivery.sales.length} Venda(s)
      </h3>
      {selectDelivery.ID_CAR !== 0 && 
      <div className={classes.divHeader}>    
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

      {selectDelivery.ID_CAR !== 0
        ? <TableContainer component={Paper}>
          <Table aria-label="collapsible table">
            <TableHeadSale />

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
        : 
        <>
          <AppBar position="static">
            <Tabs
              value={value}
              onChange={(event, newValue) => setValue(newValue)}
              aria-label="simple tabs example"
              variant="fullWidth"
            >
              <Tab label="Não validadas" {...a11yProps(0)}/>
              <Tab label="Confirmadas" {...a11yProps(1)}/>
              <Tab label="Negadas" {...a11yProps(2)}/>
            </Tabs>
          </AppBar>

          <TabPanel
            className={classes.bodyTab} value={value} index={0}
          >
            <TableContainer component={Paper}>
              <Table aria-label="collapsible table">
                <TableHeadSale />
                <TableBody>
                  {selectDelivery.sales.filter(sale => sale.status_prevision === null).map((sale, index) => (
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
          </TabPanel>

          <TabPanel
            className={classes.bodyTab} value={value} index={1}
          >
            <TableContainer component={Paper}>
              <Table aria-label="collapsible table">
                <TableHeadSale />
                <TableBody>
                  {selectDelivery.sales.filter(sale => sale.status_prevision).map((sale, index) => (
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
          </TabPanel>

          <TabPanel
            className={classes.bodyTab} value={value} index={2}
          >
            <TableContainer component={Paper}>
              <Table aria-label="collapsible table">
                <TableHeadSale />
                <TableBody>
                  {selectDelivery.sales.filter(sale => sale.status_prevision === false).map((sale, index) => (
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
          </TabPanel>
        </>
      }

      {type !== 'close' &&
        <div className={classes.btnActions}>
          <ButtonSuccess 
            children={"Finalizar"}
            onClick={finish}
            disabled={disabledBtnSave}
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