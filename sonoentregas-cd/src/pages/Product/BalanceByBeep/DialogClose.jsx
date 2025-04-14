import React from 'react'
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@material-ui/core'
import { ButtonCancel, ButtonSuccess } from '../../../components/Buttons'
import api from '../../../services/api'
import { useAlertSnackbar } from '../../../context/alertSnackbarContext'

const DialogClose = ({balanceIdClose, onClose}) => {
  const [loading, setLoading] = React.useState(false)
  const { setAlertSnackbar } = useAlertSnackbar()

  const handleFinish = async () => {
    setLoading(true)

    try {
      await api.put(`/balance-by-beep/${balanceIdClose}/close`)
      onClose()
      setAlertSnackbar('Balanço fechado com sucesso')
      setLoading(false)
    } catch (error) {
      console.error('Error closing balance:', error)
      setAlertSnackbar('Erro ao fechar o balanço')
      setLoading(false)
    }
  }

  return (
    <Dialog
      open={!!balanceIdClose}
      onClose={onClose}
    >
      <DialogTitle>Finalizar balanço {balanceIdClose}</DialogTitle>
      <DialogContent>
        <DialogContentText>Deseja mesmo finalizar esse balanço?</DialogContentText>
      </DialogContent>
      <DialogActions>
        <ButtonSuccess onClick={handleFinish} loading={loading}>
          Sim
        </ButtonSuccess>
        <ButtonCancel onClick={onClose} autoFocus>
          Não
        </ButtonCancel>
      </DialogActions>
    </Dialog>
  )
}

export default DialogClose
