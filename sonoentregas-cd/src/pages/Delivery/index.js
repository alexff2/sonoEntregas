import React, { useEffect, useState, Fragment } from "react"
import {
  Box,
  Button,
  Fab,
  fade,
  makeStyles,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from "@material-ui/core"
import { Add, Delete, Edit } from "@material-ui/icons"

//Components
import Modal from '../../components/Modal'
import ModalDelivery from './ModalDelivery'
import ModalFinish from './ModalFinish'
//Context
import { useDelivery } from '../../context/deliveryContext'
import { useCars } from '../../context/carsContext'
import { useDrivers } from '../../context/driverContext'
import { useAssistants } from '../../context/assistantContext'
import { useSale } from '../../context/saleContext'

import api from '../../services/api'

const useStyle = makeStyles(theme => ({
  head: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
    fontWeight: theme.typography.fontWeightBold
  },
  body: {
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
      padding: 0
    }
  },
  btnAdd: {
    position: 'fixed',
    bottom: '1.5rem',
    right: '1.5rem'
  },
  fieldSeach: {
    color: fade(theme.palette.common.white, 0.55),
    height: '2rem',
    width: theme.spacing(20),
    marginRight: theme.spacing(2),
  },
  label: {
    color: fade(theme.palette.common.white, 0.55)
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  }
}))

//Component Button Update Status
function BtnStatus({ selectDelivery, delivery, setDelivery, finishDelivery }){
  const updateDelivery = async status => {
    if (status === 'Entregando') {
      selectDelivery.STATUS = status
      
      for( let i = 0; i < selectDelivery.sales.length; i++){
        for( let j = 0; j < selectDelivery.sales[i].products.length; j++){
          selectDelivery.sales[i].products[j].STATUS = status
        }
      }
      
      const { data } = await api.put(`deliverys/status/${selectDelivery.ID}`, selectDelivery)
      
      setDelivery(delivery.map( item => item.ID === selectDelivery.ID ? data : item))
    } else if (status === 'Finalizada') {
      finishDelivery(selectDelivery)
    }
  }

  if (selectDelivery.STATUS === 'Em lançamento') {
    return <Button onClick={() => updateDelivery('Entregando')}>Entregar</Button>
  } else if (selectDelivery.STATUS === 'Entregando') {
    return <Button onClick={() => updateDelivery('Finalizada')}>Finalizar</Button>
  } else {
    return null
  }
}

export default function Delivery() {
  //Modals Open States
  const [ open, setOpen ] = useState(false)
  const [ openUpdateDelivery, setOpenUpdateDelivery ] = useState(false)
  const [ openFinish, setOpenFinish ] = useState(false)
  const [ currentDeliv, setCurrentDeliv ] = useState([])

  //States
  const [ deliveryUpdate, setDeliveryUpdate ] = useState({})
  const { delivery, setDelivery } = useDelivery()
  const { cars } = useCars()
  const { drivers } = useDrivers()
  const { assistants } = useAssistants()
  const { setSales } = useSale()

  useEffect(()=>{
    setCurrentDeliv(delivery.filter( deliv => deliv.STATUS !== 'Finalizada'))
  },[delivery])

  //Styles
  const classes = useStyle()
  const StyleStatus = status => {
    var background
    if (status === 'Em lançamento') {
      background = '#2196f3'
    } else if (status === 'Entregando') {
      background = '#ff9800'
    } else if (status === 'Finalizada') {
      background = '#388e3c'
    }
    return { 
      background,
      color: '#FFF',
      width: '100%',
      minHeight: '2rem',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    }
  }

  //return car description and driver description
  const descriptionCar = codCar => {
    const car = cars.filter(item => item.ID === codCar)
    return car[0].DESCRIPTION
  }
  const descriptionDriver = codDriver => {
    const driver = drivers.filter(item => item.ID === codDriver)
    return driver[0].DESCRIPTION
  }
  const descriptionAssistants = codAssistant => {
    const assistant = assistants.filter(item => item.ID === codAssistant)
    return assistant[0].DESCRIPTION
  }

  //Functions
  const deleteDelivery = async cod => {
    try {
      const { data } = await api.delete(`deliverys/${cod}`)

      setDelivery(delivery.filter(item => item.ID !== cod))
      setCurrentDeliv(delivery.filter(item => item.ID !== cod))

      if (data.delete) {
        const { data: dataSales } = await api.get('sales/false/false/Aberta')
        setSales(dataSales)
      }      
    } catch (error) {
      alert('Erro ao deletar, entre em contato com Administrador')
      console.log(error)
    }
  }
  const updateDelivery = item => {
    setDeliveryUpdate(item)
    setOpenUpdateDelivery(true)
  }
  const finishDelivery = item => {
    setDeliveryUpdate(item)
    setOpenFinish(true)
  }

  const seachDeliv = tipo => {
    tipo === 0 ? setCurrentDeliv(delivery)
    : api.get('deliverys/Finalizada').then(resp => setCurrentDeliv(resp.data))
  }

  return (
    <Box>

      <TableContainer component={Paper}>
        <Table aria-label="custumezed table">
          <TableHead>
            <TableRow>
            {['Código', 'Descrição', 'Motorista', 'Auxiliar', 'Veículo', 'Status'].map((value, index) => (
              <TableCell className={classes.head} key={index}>{value}</TableCell>
            ))}
              <TableCell style={{paddingTop: 0, paddingBottom: 0}} colSpan={2} className={classes.head}>
                <FormControl variant="outlined">
                  <InputLabel id="fieldSeach" className={classes.label}>Entregas</InputLabel>
                  <Select
                    label="Entregas"
                    labelId="fieldSeach"
                    className={classes.fieldSeach}
                    defaultValue={0}
                    onChange={e => seachDeliv(e.target.value)}
                  >
                    <MenuItem value={0}>Abertas</MenuItem>
                    <MenuItem value={1}>Finalizadas</MenuItem>
                  </Select>
                </FormControl>
              </TableCell>
            
            </TableRow>
          </TableHead>
          
          <TableBody>
          {currentDeliv.map( item => (
            <TableRow key={item.ID} className={classes.body}>
              <TableCell width={'5%'}>{item.ID}</TableCell>
              <TableCell width={'24%'}>{item.DESCRIPTION}</TableCell>
              <TableCell width={'13%'}>{descriptionDriver(item.ID_DRIVER)}</TableCell>
              <TableCell width={'13%'}>{descriptionAssistants(item.ID_ASSISTANT)}</TableCell>
              <TableCell width={'15%'}>{descriptionCar(item.ID_CAR)}</TableCell>
              <TableCell width={'15%'}>
                <div style={StyleStatus(item.STATUS)} >{item.STATUS}</div>
              </TableCell>
              <TableCell width={'8%'} align="right">
                {item.STATUS === 'Finalizada' || item.STATUS === 'Entregando' ? null : (
                <Fragment>
                  <Edit onClick={()=> updateDelivery(item)}/>
                  <Delete onClick={()=> deleteDelivery(item.ID)}/>
                </Fragment>
                )}
              </TableCell>
              <TableCell width={'7%'}>
                <BtnStatus
                  selectDelivery={item}
                  delivery={delivery}
                  setDelivery={setDelivery}
                  finishDelivery={finishDelivery}
                />
              </TableCell>
            </TableRow>
          ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Fab 
        color="primary"
        className={classes.btnAdd}
        onClick={() => setOpen(true)}
      >
        <Add />
      </Fab>

      <Modal 
        open={open}
        setOpen={setOpen}
        title="Lançar Entrega"
      >
        <ModalDelivery
          setOpen={setOpen}
          selectDelivery={false}
          currentDeliv={currentDeliv}
          setCurrentDeliv={setCurrentDeliv}
        />
      </Modal>

      <Modal 
        open={openUpdateDelivery}
        setOpen={setOpenUpdateDelivery}
        title="Editar Entrega"
      >
        <ModalDelivery 
          setOpen={setOpenUpdateDelivery} 
          selectDelivery={deliveryUpdate} 
          currentDeliv={currentDeliv}
          setCurrentDeliv={setCurrentDeliv}
        />
      </Modal>

      <Modal
        open={openFinish}
        setOpen={setOpenFinish}
        title={"Finalizar Entrega"}
      >
        <ModalFinish 
          setOpen={setOpenFinish}
          selectDelivery={deliveryUpdate}
          currentDeliv={currentDeliv}
          setCurrentDeliv={setCurrentDeliv}
        />
      </Modal>

    </Box>
  )
}
