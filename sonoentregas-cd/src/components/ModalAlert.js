import React from 'react'
import AddIcon from '@material-ui/icons/Add'
import { makeStyles } from '@material-ui/core'

import Modal from './Modal'

const useMakeStyle = makeStyles( theme => ({
  modalAlert: {
    width: 500,
    [theme.breakpoints.only('sm')]:{
      width: '90vw'
    }
  },
  headerX: {
    backgroundColor: 'rgb(226, 116, 126)',
    padding: '2rem',
    textAlign: 'center',
    '& div': {
      border: '4px solid white',
      height: '5rem',
      width: '5rem',
      color: 'white',
      borderRadius: '50%',
      margin: 'auto',

      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transform: 'rotate(45deg)'
    }
  },
  content: {
    padding: '1rem',
    textAlign: 'center',
    '& button': {
      marginTop: '1rem',
      backgroundColor: 'rgb(226, 116, 126)',
      color: 'white',
      border: 'none',
      width: '100px',
      padding: '0.5rem 0',
      borderRadius: '20px',
    }
  }
}))

export default function ModalALert({ children, open, setOpen }){
  const classes = useMakeStyle()
  return(
    <Modal open={open} setOpen={setOpen} title={false}>
      <div className={classes.modalAlert}>
        <div className={classes.headerX}>
          <div><AddIcon fontSize="large"/></div>
        </div>
        <div className={classes.content}>
          <h2>Atenção!</h2>
          <p>
            { children }
          </p>
          <button onClick={() => setOpen(false)}>Fechar</button>
        </div>
      </div>
    </Modal>
  )
}