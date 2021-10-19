import React from 'react'
import {
  Box,
  Container,
  makeStyles
} from '@material-ui/core';
//import Sales from './Sales';
import Cards from './Cards';

const useStyles = makeStyles((theme) => ({
  sales: {
    marginTop: theme.spacing(4)
  }
}))

export default function Home(){
  const classes = useStyles()
  return(
    <Container disableGutters maxWidth={false}>
      
      <Cards />
      
      <Box className={classes.sales}>
        
      </Box>

    </Container>
  )
}