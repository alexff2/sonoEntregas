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
  Select,
  MenuItem,
  FormControl,
  InputLabel
 } from '@material-ui/core'

export default function Filter({
  open,
  setIsOpenFilter,
  handleFilterReport,
  disabledButton,
}) {
  const [ date, setDate ] = useState('') 
  const [ typeMovement, setTypeMovement ] = useState('movement')

  const handleCloseFilter = () => setIsOpenFilter(false)

  const handleFilters = async () => {
    await handleFilterReport({ date, typeMovement })
  }

  return (
    <Dialog open={open} onClose={handleCloseFilter}>
      <DialogTitle>Filtro</DialogTitle>

      <DialogContent>
        <DialogContentText>
          Data referencial inicial: 
        </DialogContentText>

        <TextField
          type='date'
          variant='outlined'
          style={{minWidth: 180, marginBottom: 20}}
          onChange={e => setDate(e.target.value)}
        />

        <DialogContentText>
          Tipo de movimentação: 
        </DialogContentText>

        <FormControl variant='outlined' style={{minWidth: 180}}>
          <InputLabel id='typeMovement'>Tipo</InputLabel>
          <Select
            labelId='typeMovement'
            label='Tipo'
            value={typeMovement}
            onChange={ e => setTypeMovement(e.target.value)}
          >
            <MenuItem value='movement'>Movimentações</MenuItem>
            <MenuItem value='notMovement'>Parados</MenuItem>
            <MenuItem value='all'>Todas</MenuItem>
          </Select>
        </FormControl>
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