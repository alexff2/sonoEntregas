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

export function ButtonSuccess({children, loading=false, ...other}) {
  const classes = useStyle()
  return(
    <Button
      className={classes.btnSuccess}
      style={ loading ? {cursor: 'progress'}: {cursor: 'pointer'}}
      {...other}
    >
      <span style={loading ? {marginRight: 8} : {}}>{ children }</span> 
      {loading &&  <CircularProgress size={25}/> }
    </Button>
  )
}

export function ButtonCancel({children, className, ...other}) {
  const classes = useStyle()
  return(
    <Button className={classes.btnCancel} children={children} {...other}/>
  )
}