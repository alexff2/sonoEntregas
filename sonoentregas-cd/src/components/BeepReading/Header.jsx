import React from 'react'
import {
  Box,
  InputBase,
  Typography,
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
    paddingLeft: 8
  },
  textHeader: {
    color: 'white',
  }
}))

export function Header({
  productSelected,
  title
}) {
  const classes = useStyle()
  return (
    <Box className={classes.header}>
      <InputBase
        id='beep'
        className={classes.fieldSearch}
      />

      <Box className={classes.textHeader}>
        <Typography>{title}</Typography>
        <Typography>{productSelected ? productSelected.nameFull : 'Selecione um produto...'}</Typography>
      </Box>
    </Box>
  )
}