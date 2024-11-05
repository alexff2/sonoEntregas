import React, { useState } from 'react'
import { 
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  DialogActions,
  Button,
  CircularProgress,
  TextField,
 } from '@material-ui/core'

export default function Filter({
  open,
  setIsOpenFilter,
  handleFilterReport,
}) {
  const [ dateStart, setDateStart ] = useState('')
  const [ dateEnd, setDateEnd ] = useState('')
  const [ disabledButton, setDisabledButton ] = useState(false)

  const handleCloseFilter = () => setIsOpenFilter(false)

  const handleFilters = async () => {
    setDisabledButton(true)
    await handleFilterReport({ dateStart, dateEnd })
    setDisabledButton(false)
  }


  return (
    <Dialog open={open} onClose={handleCloseFilter}>
      <DialogTitle>Filtro</DialogTitle>

      <DialogContent>
        <DialogContentText>
          Data inicial: 
        </DialogContentText>

        <TextField
          type='date'
          variant='outlined'
          style={{minWidth: 180, marginBottom: 20}}
          onChange={e => setDateStart(e.target.value)}
        />
        <DialogContentText>
          Data Final: 
        </DialogContentText>

        <TextField
          type='date'
          variant='outlined'
          style={{minWidth: 180, marginBottom: 20}}
          onChange={e => setDateEnd(e.target.value)}
          onKeyPress={e => e.key === 'Enter' && handleFilters()}
        />

      </DialogContent>

      <DialogActions>
        <Button 
          onClick={handleFilters}
          color='secondary'
          variant='contained'
          disabled={disabledButton}
        >
          Ok { disabledButton && <CircularProgress size={25}/> }
        </Button>
      </DialogActions>
    </Dialog>
  )
}