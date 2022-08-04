import React, { createRef } from 'react'
import { makeStyles, Modal, Backdrop, Fade } from '@material-ui/core'

import LoadingCircle from './LoadingCircle'

const useStyles = makeStyles( theme => ({
  modal: {
    display: 'grid',
    placeItems: 'center'
  },
  loading: {
    width: '50%',
    '& path': {
      fill: '#FFF'
    }
  }
}))

export default function LoadingCircleModal({ open, setOpen }){
  const classes = useStyles()
  return (
    <Modal
        ref={createRef()}
        className={classes.modal}
        open={open}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={open}>
          <LoadingCircle className={classes.loading}/>
        </Fade>
      </Modal>
  )
}