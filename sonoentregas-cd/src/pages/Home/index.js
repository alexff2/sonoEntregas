import React from 'react'
import {
  Box,
  makeStyles
} from '@material-ui/core'
//Components
import Sales from '../../components/TableSales'
import Cards from './Cards'
//Contexts
import { useSale } from '../../context/saleContext'

const useStyles = makeStyles((theme) => ({
  sales: {
    marginTop: theme.spacing(4),
    display: 'flex',
  },
  boxAddress: {
    width: '40%'
  },
  container: {
    
  }
}))

export default function Home(){
  const classes = useStyles()
  const { sales } = useSale()

  return(
    <Box className={classes.container}>
      
      <Cards />
      
      <Box className={classes.sales}>
        <Sales
          selectSales={sales}
          salesProd={[]}
          setSalesProd={[]}
          type={'home'}
        />
        <Box className={classes.boxAddress}>Endereço</Box>
      </Box>

    </Box>
  )
}