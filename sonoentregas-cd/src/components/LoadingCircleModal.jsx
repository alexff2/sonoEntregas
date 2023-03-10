import React from 'react'
import { CircularProgress, makeStyles, Backdrop } from '@material-ui/core'

const useStyles = makeStyles(theme => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
    marginLeft: 256
  }
}))

export default function LoadingCircleModal({ open }){
  const classes = useStyles()

  return (
    <Backdrop className={classes.backdrop} open={open}>
      <CircularProgress color='inherit' size={80}/>
    </Backdrop>
  )
}