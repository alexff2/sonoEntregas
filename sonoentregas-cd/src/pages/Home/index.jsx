import React, { useEffect } from 'react'
import {
  Box,
  makeStyles
} from '@material-ui/core'
//Components
import Sales from '../../components/TableSales'
import BoxInfo from '../../components/BoxInfo'
import Cards from './Cards'
//Contexts
import { useSale } from '../../context/saleContext'

import api from '../../services/api'

const useStyles = makeStyles((theme) => ({
  sales: {
    marginTop: theme.spacing(3),
    display: 'flex',
    width: '100%'
  },
  boxAddress: {
    width: '40%'
  },
  container: {
    
  }
}))

export default function Home(){
  const classes = useStyles()
  const { setSales, sales } = useSale()

  useEffect(() => {
    api.get('sales/', {
      params: {
        status: 'open'
      }
    }).then(({ data }) => setSales(data))
  }, [setSales])

  return(
    <Box className={classes.container}>
      
      <Cards />
      
      <Box className={classes.sales}>
        <Sales
          sales={sales}
          type={'home'}
        />
        <Box className={classes.boxAddress}>
          <BoxInfo />
        </Box>
      </Box>

    </Box>
  )
}