import React from 'react'
import {
  CircularProgress
} from '@material-ui/core'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'
import Slide from '@material-ui/core/Slide'

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />
})

export default function Confirm({ open, setOpen, text, progress, handleClick }) {

  const handleClose = () => {
    setOpen(false)
  }

  return (
    <div>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-labelledby="alert-dialog-slide-title"
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle id="alert-dialog-slide-title">Atenção!</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            { text
              ? text
              : 'Deseja realmente realizar esta ação?'
            }
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          { progress && <CircularProgress size={35}/> }
          <Button onClick={handleClose} color="primary">
            Não
          </Button>
          <Button onClick={handleClick} color="primary">
            Sim 
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}
