import React from 'react'
import { 
  Box,
  makeStyles
} from '@material-ui/core'

const useStyle = makeStyles(theme =>({
  root: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    paddingTop: 56,
  },
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%'
  }
}))

export function Root({ children }) {
  const classes = useStyle()
  return (
    <Box className={classes.root}>
      <Box className={classes.container}>
        {children}
      </Box>
    </Box>
  )
}