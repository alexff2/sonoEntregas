import React, { useEffect } from 'react'
import {
  Box,
  InputBase,
  makeStyles
} from '@material-ui/core'

const useStyle = makeStyles(theme =>({
  header: {
    padding: 8,
    backgroundColor: theme.palette.primary.light,
    height: '84px'
  },
  fieldSearch: {
    height: '2rem',
    width: '100%',
    background: 'white',
    borderRadius: 4,
    marginBottom: 8,
    paddingLeft: 8,
  },
  textHeader: {
    color: 'white',
  }
}))

export function Header({children, onChange, value, disabled, onKeyEnter}) {
  const classes = useStyle()

  useEffect(() => {
    document.getElementById('beep').focus()
  }, [])

  return (
    <Box className={classes.header}>
      <InputBase
        id='beep'
        className={classes.fieldSearch}
        autoComplete='off'
        onKeyDown={e => e.key === 'Enter' && onKeyEnter(e)}
        value={value}
        disabled={disabled}
        onChange={onChange}
      />

      <Box className={classes.textHeader}>
        {children}
      </Box>
    </Box>
  )
}