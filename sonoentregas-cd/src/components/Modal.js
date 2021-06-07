import React, { createRef } from 'react'
import { makeStyles, Modal, Backdrop, Fade } from '@material-ui/core'

const useStyles = makeStyles( theme => ({
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    width: 'min(95vw, 700px)',
    height: 'calc(100vh - 100px)',
    overflow: 'scroll'
  }
}))

export default function TransitionsModal({ open, setOpen, title, children, className }) {
  const classes = useStyles()
  return (
      <Modal
        ref={createRef()} 
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={classes.modal}
        open={open}
        onClose={() => setOpen(false)}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={open}>
          <div className={classes.paper}>
            <h2 id="transition-modal-title">{title}</h2>
            <div id="transition-modal-description" className={classes.modalContent}>
              {children}
            </div>
          </div>
        </Fade>
      </Modal>
  );
}
