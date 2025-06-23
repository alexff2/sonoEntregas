import React from 'react'
import {
  Box,
  makeStyles,
  Paper,
  Typography
} from '@material-ui/core'

import { useAddress } from '../context/addressContext'

const useStyles = makeStyles(theme => ({
  container: {
    borderRadius: '0 4px 0 0',
    height: '100%',
    [theme.breakpoints.down('lg')]: {
      fontSize: '10px'
    }
  },
  headBox: {
    borderRadius: '0 4px 0 0',
    color: theme.palette.common.white,
    fontWeight: theme.typography.fontWeightBold,
    backgroundColor: theme.palette.primary.main,
    height: 33,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    '& > h6': {
      [theme.breakpoints.down('lg')]: {
        fontSize: '10px'
      }
    }
  },
  bodyBox: {
    padding: 10,
    '& > div': {
      fontWeight: theme.typography.fontWeightBold,
      marginBottom: 6,
      '& > span': {
        fontWeight: theme.typography.fontWeightLight,
      }
    }
  },
  obsLoja: {
    color: theme.palette.error.main
  },
  obsAgendamento: {
    color: theme.palette.error.main
  },
  emptyState: {
    marginTop: 100,
    textAlign: 'center'
  }
}))

export default function BoxInfo() {
  const { address } = useAddress()
  const classes = useStyles()

  if (!address) {
    return (
      <Box component={Paper} className={classes.container}>
        <Box className={classes.headBox}>
          <Typography variant="subtitle1">Endereços e Observações</Typography>
        </Box>
        <Box className={classes.bodyBox}>
          <Typography className={classes.emptyState}>
            Clique em uma venda para mostrar informações
          </Typography>
        </Box>
      </Box>
    )
  }

  return (
    <Box component={Paper} className={classes.container}>
      <Box className={classes.headBox}>
        <Typography variant="subtitle1">Endereços e Observações</Typography>
      </Box>
      <Box className={classes.bodyBox}>
        <div>
          Observação Loja:{' '}
          <span className={classes.obsLoja}>{address.OBS2 || '-'}</span>
        </div>
        <div>
          Endereço:{' '}
          <span>{address.ENDERECO || '-'}</span>
        </div>
        <div>
          Ponto de referência:{' '}
          <span>{address.PONTOREF || '-'}</span>
        </div>
        <div>
          Observação DAV:{' '}
          <span>{address.OBS || '-'}</span>
        </div>
        {address.SCHEDULED && (
          <div className={classes.obsAgendamento}>
            Obs. Agendamento:{' '}
            <span>{address.OBS_SCHEDULED || '-'}</span>
          </div>
        )}
      </Box>
    </Box>
  )
}