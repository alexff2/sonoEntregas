import React from 'react'
import {
  Box,
  makeStyles
} from '@material-ui/core'
import { ButtonCancel, ButtonSuccess } from '../Buttons'

const useStyles = makeStyles(theme => ({
  root: {
    flex: 1,
    backgroundColor: theme.palette.primary.light,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'end',
    padding: '0 8px'
  }
}))

export function Footer({handleRenderBox}){
  const classes = useStyles()

  return (
    <Box className={classes.root}>
      <ButtonSuccess>Finalizar</ButtonSuccess>
      <ButtonCancel onClick={handleRenderBox}>Cancelar</ButtonCancel>
    </Box>
  )
}