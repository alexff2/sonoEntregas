import React from 'react'
import {
  Box,
  Button,
  Paper,
  Typography
} from '@material-ui/core'
import { useStyle } from './useStyle'
import { useUnbeepReducer } from './useUnBeep'
import DialogUnBeepEntryNote from './DialogUnBeepEntryNote'

const Unbeep = () => {
  const classes = useStyle()
  const unBeepReducer = useUnbeepReducer()

  return (
    <Box component={Paper} p={4}>
      <Typography variant='h6' align='center'>Desbipar Produtos</Typography>
      <Typography align='center'>Selecione qual modulo deseja desbipar abaixo</Typography>

      <Box className={classes.BoxButtons}>
        <Button onClick={unBeepReducer.openEntryNoteModal}>Nota de Entrada</Button>
        <Button onClick={unBeepReducer.openRouteModal}>Rota de Entrega</Button>
      </Box>

      <DialogUnBeepEntryNote
        title="Nota de Entrada"
        open={unBeepReducer.state.modalType === 'entry_note'}
        unBeepReducer={unBeepReducer}
      />

      <DialogUnBeepEntryNote
        title="Rota de Entrega"
        open={unBeepReducer.state.modalType === 'route'}
        unBeepReducer={unBeepReducer}
      />
    </Box>
  )
}

export default Unbeep
