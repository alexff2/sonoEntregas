import React from 'react'
import { Dialog, makeStyles } from '@material-ui/core'

import LoadingCircle from './LoadingCircle'

const useStyles = makeStyles(() => ({
  modal: {
    display: 'grid',
    placeItems: 'center'
  },
  loading: {
    width: '100%'
  }
}))

export default function LoadingCircleModal({ open, setOpen }){
  const classes = useStyles()

  return (
    <Dialog
      aria-labelledby="simple-dialog-title"
      open={open}
      onClose={setOpen}
      className={classes.modal}
    >
      <LoadingCircle className={classes.loading}/>
    </Dialog>
  )
}