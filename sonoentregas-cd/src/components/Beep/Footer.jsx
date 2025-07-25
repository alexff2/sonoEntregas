import React from 'react'
import {
  Box,
  makeStyles
} from '@material-ui/core'

const useStyles = makeStyles(theme => ({
  root: {
    flex: 1,
    backgroundColor: theme.palette.primary.light,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'end',
    padding: '0 8px',
    gap: 8,
  }
}))

export function Footer({children}){
  const classes = useStyles()

  return (
    <Box className={classes.root}>
      {children}
    </Box>
  )
}