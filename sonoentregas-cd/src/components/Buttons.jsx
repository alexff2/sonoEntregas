import React from 'react'
import { Button, makeStyles, CircularProgress } from "@material-ui/core"

const widthBtn = 100
const useStyle = makeStyles( theme => ({
  btnSuccess: {
    background: theme.palette.success.main,
    color: theme.palette.common.white,
    width: widthBtn,
    marginRight: theme.spacing(2),
    '&:hover': {
      background: theme.palette.success.light
    }
  },
  btnCancel: {
    background: theme.palette.error.main,
    color: theme.palette.common.white,
    width: widthBtn,
    '&:hover': {
      background: theme.palette.error.light
    }
  }
}))

export function ButtonSuccess({children, loading=false, stylesInComponent, ...other}) {
  const classes = useStyle()
  return(
    <Button
      className={classes.btnSuccess}
      style={{
        cursor: loading ? 'progress' : 'pointer',
        ...stylesInComponent
      }}
      disabled={loading ? true : false}
      {...other}
    >
      { loading ?  <CircularProgress size={24} style={{ color: 'white'}}/> : children }
    </Button>
  )
}

export function ButtonCancel({children, className, ...other}) {
  const classes = useStyle()
  return(
    <Button className={classes.btnCancel} children={children} {...other}/>
  )
}