import React from 'react'
import {
  Box,
  makeStyles,
  Paper
} from '@material-ui/core'

import { useAddress } from '../context/addressContext'

const useStyles = makeStyles( theme => ({
  container: {
    borderRadius: '0 4px 0 0',
    height: '100%'
  },
  headBox: {
    borderRadius: '0 4px 0 0',
    color: theme.palette.common.white,
    fontWeight: theme.typography.fontWeightBold,
    backgroundColor: theme.palette.primary.main,
    padding: '8px 10px'
  
  },
  bodyBox: {
    padding: 10,
    '& > div': {
      fontWeight: theme.typography.fontWeightBold,
      '& > span': {
        fontWeight: theme.typography.fontWeightLight,
      }
    }
  }
}))

export default function BoxInfo(){
  const { address } = useAddress()
  const classes = useStyles()

  return(
    <Box component={Paper} className={classes.container}>
      <Box className={classes.headBox}>Endereços e Observações</Box>
      
      { address 
        ?<Box className={classes.bodyBox}>
          <div>Observação Loja: <span style={{color: 'red'}}>{address.OBS2}</span> </div><br />
          <div>Endereço: <span>{address.ENDERECO}</span></div>
          <div>Ponto de referência: <span>{address.PONTOREF}</span></div>
          <div>Observação DAV: <span>{address.OBS}</span></div>
          {address.SCHEDULED && <div style={{color: 'red'}}>Obs. Agendamento: <span>{address.OBS_SCHEDULED}</span></div>}
        </Box> 
        :<Box className={classes.bodyBox} textAlign="center">
          <div style={{marginTop: 100}}>Clique em uma venda para mostrar infomações</div>
        </Box>
      }
    </Box>
  )
}