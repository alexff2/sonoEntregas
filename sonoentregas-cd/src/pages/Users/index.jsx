import React, { useState } from 'react'
import { 
  Box,
  Fab,
  makeStyles,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@material-ui/core'
import { Add, Edit } from '@material-ui/icons'
import { useDrivers } from '../../context/driverContext'
import { useAssistants } from '../../context/assistantContext'
import { useUsers } from '../../context/usersContext'
import Modal from '../../components/Modal'
import ModalUsers from './ModalUsers'

const useStyles = makeStyles( theme => ({
  headerCell: {
    background: theme.palette.primary.main,
    color: theme.palette.common.white,
    fontWeight: theme.typography.fontWeightBold
  },
  btnAdd: {
    position: 'absolute',
    bottom: '1.5rem',
    right: '1.5rem'
  }
}))

export default function Users() {
  const [ openRegisterUser, setOpenRegisterUser ] = useState(false)
  const [ openUpdateUser, setOpenUpdateUser ] = useState(false)
  const [ userUpdate, setUserUpdate ] = useState()
  const { drivers } = useDrivers()
  const { assistants } = useAssistants()
  const { users } = useUsers()
  const classes = useStyles()

  //Functions
  const updateUser = (item, office) => {
    setUserUpdate({...item, office})
    setOpenUpdateUser(true)
  }

  return(
    <Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              {['Código', 'Nome Completo', 'Cargo', ''].map((value, index) => (
                <TableCell className={classes.headerCell} key={index}>{value}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map( user => (
            <TableRow key={user.ID}>
                <TableCell>{user.ID}</TableCell>
                <TableCell>{user.DESCRIPTION}</TableCell>
                <TableCell>Usuário</TableCell>
                <TableCell>
                  <Edit onClick={() => updateUser(user, 'User')}/>
                </TableCell>
              </TableRow>
            ))}
            {drivers.map( driver => (
            <TableRow key={driver.ID}>
                <TableCell>{driver.ID}</TableCell>
                <TableCell>{driver.DESCRIPTION}</TableCell>
                <TableCell>Motorista</TableCell>
                <TableCell>
                  <Edit onClick={() => updateUser(driver, 'Driver')}/>
                </TableCell>
              </TableRow>
            ))}
            {assistants.map( assistant => (
            <TableRow key={assistant.ID}>
                <TableCell>{assistant.ID}</TableCell>
                <TableCell>{assistant.DESCRIPTION}</TableCell>
                <TableCell>Auxiliar</TableCell>
                <TableCell>
                  <Edit onClick={() => updateUser(assistant, 'Assistant')}/>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    
      <Fab
        color="primary"
        className={classes.btnAdd}
        onClick={() => setOpenRegisterUser(true)}
      >
        <Add />
      </Fab>

      <Modal 
        open={openRegisterUser}
        setOpen={setOpenRegisterUser}
        title={"Cadastrar Usuário"}
      >
        <ModalUsers selectUser={false} setOpen={setOpenRegisterUser}/>
      </Modal>

      <Modal 
        open={openUpdateUser}
        setOpen={setOpenUpdateUser}
        title={"Editar Usuário"}
      >
        <ModalUsers selectUser={userUpdate} setOpen={setOpenUpdateUser}/>
      </Modal>

    </Box>
  )
}