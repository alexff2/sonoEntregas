import React, { useState } from 'react'
import {
  Box,
  makeStyles,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  Paper,
} from '@material-ui/core'

import { ButtonCancel, ButtonSucess } from '../../../components/Buttons'

import { useCars } from '../../../context/carsContext'
import { useDrivers } from '../../../context/driverContext'
import { useAssistants } from '../../../context/assistantContext'
import { useDelivery } from '../../../context/deliveryContext'
import { useAlert } from '../../../context/alertContext'
import { useMaintenance } from '../../../context/maintenanceContext'

import api from '../../../services/api'

const useStyles = makeStyles(theme => ({
  boxHeader: {
    display: 'flex',
    flexDirection: 'row',
    border: `1px solid ${theme.palette.divider}`,
    padding: '1rem',
    fontSize: 16,
    fontWeight: 'bold',
    '& div': {
      display: 'flex',
      flexDirection: 'column',
      '& span': {
        fontWeight: 500
      }
    }
  },
  boxBody: {
    border: `1px solid ${theme.palette.divider}`,
    padding: '1rem',
  },
  alert: {
    color: theme.palette.error.dark
  },
  boxfield: {
    display: 'flex',
    justifyContent: 'space-between'
  },
  divFormControl: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    margin: '1rem 0'
  },
  formControl: {
    width: '24%',
  },
  headCell: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
    fontWeight: theme.typography.fontWeightBold
  },
  field: {
    width: '49%'
  }
}))

export default function ModalStartMain({ selectMain, setOpen }) {
  const [isDisabled, setIsDisabled] = useState(false)
  const [idDelivMain, setIdDelivMain] = useState(0)
  const [idCar, setIdCar] = useState(0)
  const [idDriver, setidDriver] = useState(0)
  const [idAssist, setidAssist] = useState(0)
  const [obs, setObs] = useState('')
  const { setChildrenModal, setOpen: setOpenAlert } = useAlert()
  const { cars } = useCars()
  const { drivers } = useDrivers()
  const { assistants } = useAssistants()
  const { delivery } = useDelivery()
  const { setMaintenance } = useMaintenance()

  const classes = useStyles()

  const validateFilds = fields => {
    for(var i = 0; i < fields.length; i++){
      if (fields[i] === 0) {
        return false
      }
      return true
    }
  }

  const selectDeliv = e => {
    if (e.target.value !== 0 && e.target.value !== 1 ) {
      const newDev = delivery.filter(deliv => deliv.ID === e.target.value)
      setIdDelivMain(newDev[0].ID)
      setIdCar(newDev[0].ID_CAR)
      setidDriver(newDev[0].ID_DRIVER)
      setidAssist(newDev[0].ID_ASSISTANT)
      setIsDisabled(true)
    } else if (e.target.value === 0) {
      setIdDelivMain(0)
      setIdCar(0)
      setidDriver(0)
      setidAssist(0)
      setIsDisabled(false)
    } else if (e.target.value === 1){
      setIdDelivMain(0)
      setIdCar(0)
      setidDriver(48)
      setidAssist(49)
      setIsDisabled(true)
    }
  }

  const submitMaintenance = async e => {
    e.preventDefault()
    try {
      if(validateFilds([idAssist, idDriver])){
        const {data} = await api.post('maintenancedeliv', {
          idMaint: selectMain.ID,
          idDelivMain,
          idDriver,
          idAssist,
          obs,
          idUser: 0
        })
        setOpen(false)
        setMaintenance(data)
      } else {
        setChildrenModal('Selecione todas as opções corretamente!')
        setOpenAlert(true)
      }
    } catch (error) {
      console.log(error)
      setChildrenModal('Não foi possível conectar com o banco, entre em contato')
      setOpenAlert(true)
    }
  }

  return (
    <Box>
      <form onSubmit={submitMaintenance}>
        <Box className={classes.boxHeader}>
          <div style={{width: '15%'}}>
            <label>Cod. Assist: <span>{selectMain.ID}</span></label>
            <label>Cod. Venda: <span>{selectMain.ID_SALE}</span></label>
          </div>
          <div style={{width: '50%'}}>
            <label>Cliente: <span>{selectMain.NOMECLI}</span></label>
            <label>Endereço: <span>{selectMain.ENDE}</span></label>
          </div>
          <div style={{width: '35%'}}> 
            <label>Obs Loja: <span>{selectMain.OBS}</span></label>
          </div>
        </Box>
        <Box className={classes.boxBody}>
          <span className={classes.alert}>Atenção! Selecione uma rota com status 'Em Lançamento', ou selecione um motorista e assistente individualmente </span>

          <div className={classes.divFormControl}>
            <FormControl variant="outlined" className={classes.formControl}>
              <InputLabel id="RooutLabel">Rotas</InputLabel>
              <Select
                labelId="RooutLabel"
                label="Rotas"
                id="route"
                defaultValue={0}
                onChange={selectDeliv}
                required
              >
                <MenuItem value={0}>
                  <em>Nenhum</em>
                </MenuItem>
                <MenuItem value={1}>
                  Retirado no CD
                </MenuItem>
                {delivery.filter(deliv => deliv.STATUS === 'Em lançamento').map(deliv => (
                  <MenuItem
                    key={deliv.ID}
                    value={deliv.ID}
                  >
                    {deliv.ID} - {deliv.DESCRIPTION}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl variant="outlined" className={classes.formControl}>
              <InputLabel id="driverLabel">Motorista</InputLabel>
              <Select
                labelId="driverLabel"
                label="Motorista"
                id="driver"
                value={idDriver}
                disabled={isDisabled}
                onChange={e => setidDriver(e.target.value)}
                required
              >
                <MenuItem value={0}>
                  <em>None</em>
                </MenuItem>
                {drivers.map(item => (
                  <MenuItem key={item.ID} value={item.ID}>{item.DESCRIPTION}</MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl variant="outlined" className={classes.formControl}>
              <InputLabel id="assistantLabel">Auxiliar</InputLabel>
              <Select
                labelId="assistantLabel"
                label="Auxiliar"
                id="assistant"
                value={idAssist}
                disabled={isDisabled}
                onChange={e => setidAssist(e.target.value)}
                required
              >
                <MenuItem value={0}>
                  <em>None</em>
                </MenuItem>
                {assistants.map(item => (
                  <MenuItem key={item.ID} value={item.ID}>{item.DESCRIPTION}</MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl variant="outlined" className={classes.formControl}>
              <InputLabel id="carLabel">Veículo</InputLabel>
              <Select
                labelId="carLabel"
                id="car"
                label="Veículo"
                value={idCar}
                disabled
                onChange={e => setIdCar(e.target.value)}
                required
              >
                <MenuItem value={0}>
                  <em>None</em>
                </MenuItem>
                {cars.map(item => (
                  <MenuItem key={item.ID} value={item.ID}>{item.DESCRIPTION}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
          {idDelivMain === 0 &&
            <TextField
              id="obs"
              label="Observação"
              fullWidth
              margin="normal"
              variant="outlined"
              defaultValue={obs}
              onChange={(e) => setObs(e.target.value)}
            />
          }
          <TableContainer component={Paper}>
            <Table aria-label="custumezed table">
              <TableHead>
                <TableRow>
                  {['Codigo', 'Descrição', 'QTD'].map((item, i) =>(
                    <TableCell key={i} className={classes.headCell}>{item}</TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
              <TableRow>
                  <TableCell>{selectMain.COD_ORIGINAL}</TableCell>
                  <TableCell>{selectMain.PRODUTO}</TableCell>
                  <TableCell>{selectMain.QUANTIDADE}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>

          <Box mt={2}>
            <ButtonSucess
              children="Processar"
              type="submit"
            />
            <ButtonCancel
              children="Cancelar"
              onClick={() => setOpen(false)}
            />
          </Box>
        </Box>
      </form>
    </Box>
  )
}
