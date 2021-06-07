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
import { Add, Delete, Edit } from '@material-ui/icons'
import { useDrivers } from '../../context/driverContext'
import {useUsers} from '../../context/usersContext'
import Modal from '../../components/Modal'
import ModalUsers from './ModalUsers'

import api from '../../services/api'

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
  const { drivers, setDrivers } = useDrivers()
  const { users, setUsers } = useUsers()
  const classes = useStyles()

  //Functions
  const deleteUser = async (cod, cargo) => {
    try {
      await api.delete(`users/${cod}`)
      cargo === 'User' ? setUsers(users.filter(item => item.ID !== cod))
      : setDrivers(drivers.filter(item => item.ID !== cod))
    } catch (error) {
      alert(error)
    }
  }
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
                  <Delete onClick={() => deleteUser(user.ID, 'User')}/>
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
                  <Delete onClick={() => deleteUser(driver.ID, 'Driver')}/>
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