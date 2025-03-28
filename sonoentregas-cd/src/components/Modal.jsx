import React, { createRef } from 'react'
import { makeStyles, Modal, Backdrop, Fade } from '@material-ui/core'

const useStyles = makeStyles( theme => ({
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    [theme.breakpoints.down('sm')]: {
      '& *': {
        fontSize: '10px',
        padding: 4
      },
      '& h2': {
        textAlign: 'center'
      }
    }
  },
  paper1: {
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    maxHeight: 'calc(100vh - 100px)',
    overflow: 'auto',
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(1),
      width: '100%'
    }
  },
  paper2: {  
    border: 'none',
    color: 'var(--text-light)',
    backgroundColor: '#f5f5f5',
    letterSpacing: -0.5,
    minWidth: 'min(95vw, 800px)',
    maxHeight: 'calc(100vh - 50px)',
    overflow: 'auto',
    [theme.breakpoints.down('sm')]: {
      width: '100%'
    }
  }
}))

export default function TransitionsModal({ open, setOpen, title, children }) {
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
        <div className={title ? classes.paper1 : classes.paper2}>
          { title && <h2 id="transition-modal-title">{title}</h2> }

          <div id="transition-modal-description" className={classes.modalContent}>
            {children}
          </div>
        </div>
      </Fade>
    </Modal>
  );
}
