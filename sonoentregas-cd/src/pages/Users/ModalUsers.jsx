import React, { useEffect, useState } from "react"
import { 
  Box,
  makeStyles,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from "@material-ui/core"

import { ButtonCancel, ButtonSucess } from '../../components/Buttons'
import ModalAlert from '../../components/ModalAlert'

import { useUsers } from '../../context/usersContext'
import { useDrivers } from '../../context/driverContext'
import { useAssistants } from '../../context/assistantContext'
import { validateFields } from '../../functions/validateFields'

import api from '../../services/api'

const useStyles = makeStyles( theme => ({
  //Style buttons
  btnActions: {
    width: '100%',
    padding: theme.spacing(2, 0),
    display: 'flex'
  },
  nameField: {
    width: 'min(80vw, 480px)',
    marginRight: '20px',
    marginBottom: '20px'
  },
  officeField: {
    width: 'min(50vw, 130px)'
  }
}))

export default function ModalUsers({ selectUser, setOpen }) {
  const [ openMOdalAlert, setOpenModalAlert ] = useState(false)
  const [ childrenAlert, SetChildrenAlert ] = useState('Vazio')
  const [ name, setName ] = useState()
  const [ office, setOffice ] = useState()
  const { users, setUsers } = useUsers()
  const { drivers, setDrivers } = useDrivers()
  const { assistants, setAssistants } = useAssistants()

  const classes = useStyles()

  useEffect(() => {
    setName(selectUser.DESCRIPTION)
    setOffice(selectUser.OFFICE)
  }, [selectUser])

  //Functions Outher
  const createUser = async () => {
    //back irá retortar data.... Por enquanto roda:
    if (validateFields([name,office])) {
      try {
        const { data } = await api.post('users',{
          codloja: 0,
          description: name,
          active: 1,
          office,
          password: 0
        })

        console.log(office)

        if (office === 'Driver') setDrivers([ ...drivers, data ])
        if (office === 'Assistant') setAssistants([ ...assistants, data ])

        setOpen(false)
      } catch (error) {
        SetChildrenAlert('Sem conexão com o servidor, entre em contato com Administrador')
        setOpenModalAlert(true)
        console.log(error)
      }
    }else{
      SetChildrenAlert('Preencha todos os campos abaixo!')
      setOpenModalAlert(true)
    }
  }

  const updateUser = async () => {
    if (validateFields([name, office])) {
      try {
        const { data } = await api.put(`users/${selectUser.ID}`,{
          codloja: 0,
          description: name,
          active: 1,
          office,
          password: '0'
        })
        if (office === 'User') setUsers(users.map( item => item.ID === selectUser.ID ? data : item))
        if (office === 'Driver') setDrivers(drivers.map( item => item.ID === selectUser.ID ? data : item))
        if (office === 'Assistant') setAssistants(assistants.map( item => item.ID === selectUser.ID ? data : item))
        
        setOpen(false)
      } catch (error) {
        SetChildrenAlert('Sem conexão com o servidor, entre em contato com Administrador')
        setOpenModalAlert(true)
        console.log(error)
      }
    } else {
      SetChildrenAlert('Preencha todos os campos abaixo!')
      setOpenModalAlert(true)
    }
  }

  return(
    <Box>
      <form>
        <TextField
          className={classes.nameField}
          label="Nome completo"
          variant="outlined"
          onChange={(e) => setName(e.target.value)}
          defaultValue={selectUser ? selectUser.DESCRIPTION : ''}
        />
        {
          !selectUser ?
          <FormControl variant="outlined" className={classes.officeField}>
            <InputLabel id="carLabel">Cargo</InputLabel>
            <Select
              labelId="officeLabel"
              id="office"
              label="Cargo"
              onChange={(e) => setOffice(e.target.value)}
              defaultValue={0}
            >
              <MenuItem value={0}>
                <em>None</em>
              </MenuItem>
              <MenuItem value={'Driver'}>
                <em>Motorista</em>
              </MenuItem>
              <MenuItem value={'Assistant'}>
                <em>Auxiliar</em>
              </MenuItem>
            </Select>
          </FormControl>
          : null
        }

        <div className={classes.btnActions}>
        <ButtonSucess 
          children={selectUser ? "Editar" : "Lançar"}
          className={classes.btnSucess}
          onClick={selectUser ? updateUser : createUser}
        />
        <ButtonCancel 
          children="Cancelar"
          onClick={() => setOpen(false)}
          className={classes.btnCancel}
        />
      </div>
      </form>

      <ModalAlert open={openMOdalAlert} setOpen={setOpenModalAlert}>{childrenAlert}</ModalAlert>
    </Box>
  )
}