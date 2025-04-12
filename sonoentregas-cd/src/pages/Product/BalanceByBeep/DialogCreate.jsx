import React from 'react'
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Slide,
  TextField
} from '@material-ui/core'
import api from '../../../services/api'
import { useAlert } from '../../../context/alertContext'

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />
})

const DialogCreate = ({ open, onClose, loadData }) => {
  const [description, setDescription] = React.useState('')
  const { setAlert } = useAlert()

  const handleCreate = async () => {
    try {
      await api.post('/balance-by-beep', { description })
      loadData()
      handleClose()
    } catch (error) {
      console.error('Error creating balance:', error.response)
      if (error.response.data.message === 'There is already an open balance.') {
        setAlert('Já existe um balanço aberto.', 'success')
        handleClose()
      }
    }
  }

  const handleClose = () => {
    setDescription('')
    onClose()
  }

  return (
    <Dialog open={open} onClose={handleClose} TransitionComponent={Transition}>
      <DialogTitle>Criar Balanço</DialogTitle>
      <DialogContent>
        <Box>
          <DialogContentText>
            Coloque uma descrição para o balanço
          </DialogContentText>
          <TextField
            label="Descrição"
            variant="outlined"
            fullWidth
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancelar
        </Button>
        <Button onClick={handleCreate} color="primary">
          Criar
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default DialogCreate