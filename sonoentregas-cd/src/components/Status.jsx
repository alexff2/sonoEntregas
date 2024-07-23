import React from 'react'
import { Box, makeStyles } from '@material-ui/core'
import clsx from 'clsx'

const useStyles = makeStyles( theme => ({
  box: {
    color: theme.palette.common.white,
    padding: '4px 12px',
    borderRadius: 20,
    width: 'fit-content'
  },
  bgRed: {
    backgroundColor: theme.palette.error.main
  },
  bgGreen: {
    backgroundColor: theme.palette.success.main
  },
  bgOrange: {
    backgroundColor: theme.palette.warning.main
  },
}))

export default function Status({children, variant = 'red', ...props}) {
  const classes = useStyles()

  const bg = {
    red: classes.bgRed,
    green: classes.bgGreen,
    orange: classes.bgOrange,
  }

  return (
    <Box className={clsx(classes.box, bg[variant])} {...props}>{children}</Box>
  )
}