import React from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  DialogContentText,
} from '@material-ui/core'

const DialogUnBeepEntryNote = ({ open, unBeepReducer, title }) => {
  const [serialNumber, setSerialNumber] = React.useState('')

  const handleUnbeep = () => {
    if (serialNumber.trim()) {
      unBeepReducer.state.modalType === 'route'
        ? unBeepReducer.unbeepDeliveryRoute({ serialNumber })
        : unBeepReducer.unbeepEntryNote({ serialNumber })
      setSerialNumber('')
    }
  }

  const handleClose = () => {
    setSerialNumber('')
    unBeepReducer.closeModal()
  }

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Desbipar Serie de {title}</DialogTitle>
      <DialogContent>
        {unBeepReducer.state.error && (
          <DialogContentText style={{ color: 'red' }}>
            {unBeepReducer.state.error}
          </DialogContentText>
        )}
        <TextField
          autoFocus
          margin="dense"
          label="Número de Série"
          type="text"
          fullWidth
          value={serialNumber}
          onChange={e => setSerialNumber(e.target.value)}
          onKeyUp={e => e.key === 'Enter' && handleUnbeep()}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancelar</Button>
        <Button variant="contained" onClick={handleUnbeep}>
          Desbipar
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default DialogUnBeepEntryNote