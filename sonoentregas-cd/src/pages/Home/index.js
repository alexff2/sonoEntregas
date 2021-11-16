import React from 'react'
import {
  Box,
  Container,
  makeStyles
} from '@material-ui/core'
//Components
import Sales from '../../components/TableSales'
import Cards from './Cards'
//Contexts
import { useSale } from '../../context/saleContext'

const useStyles = makeStyles((theme) => ({
  sales: {
    marginTop: theme.spacing(4)
  }
}))

export default function Home(){
  const classes = useStyles()
  const { sales } = useSale()

  return(
    <Container disableGutters maxWidth={false}>
      
      <Cards />
      
      <Box className={classes.sales}>
        <Sales
          selectSales={sales}
          salesProd={[]}
          setSalesProd={[]}
          type={'home'}
        />
      </Box>

    </Container>
  )
}