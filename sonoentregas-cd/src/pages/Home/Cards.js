import React, { useEffect, useState } from 'react'
import {
  Box,
  Grid,
  Paper,
  Typography,
  makeStyles
} from '@material-ui/core'
import { Assignment, ShoppingCart } from '@material-ui/icons'
import api from '../../services/api'

import { useSale } from '../../context/saleContext'

const useStyles = makeStyles((theme) => ({
  card: {
    height: '100%',
    width: '100%',
    '&:hover': {
      backgroundColor: theme.palette.primary.main,
      boxShadow: '0px 3.21306px 5.3551px rgba(0, 0, 0, 0.2), 0px 1.07102px 19.2783px rgba(0, 0, 0, 0.12), 0px 6.42612px 10.7102px rgba(0, 0, 0, 0.14)',
      cursor: 'pointer',
      '& $text': {
        color: 'white'
      },
      '& $icon': {
        color: 'white'
      }
    }
  },
  boxContent: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: theme.spacing(2)
  },
  icon: {
    fontSize: theme.typography.h3.fontSize,
    color: theme.palette.text.secondary
  },
  text: {}
}));

const Item = ({classes, title, icon: Icon, value, seachHome}) => {
  const { setSales }  = useSale()
  
  const seachSales = async () => {
    const { data } = await api.get('sales/false/false/Aberta')
    setSales(data)
    seachHome()
  }
  
  return (
  <Grid item lg={3} sm={6} xl={3} xs={12}>
    <Paper className={classes.card} onClick={seachSales}>
      <Box className={classes.boxContent}>
      {Icon && (
        <Icon
          className={classes.icon}
        />
      )}
        <Typography 
          variant="h5" 
          color="textSecondary" 
          className={classes.text}
        >{value}</Typography>
        <Typography 
          color="textSecondary" 
          className={classes.text}
        >{title}</Typography>
      </Box>
    </Paper>
  </Grid>
)}

export default function Home(){
  const [ itens, setItens ] = useState([])
  const classes = useStyles()

  useEffect(()=>{
    seachHome()
  },[])

  const seachHome = () => {
    api
      .get('/home')
      .then(resp => {
        setItens([
          {
            icon: ShoppingCart,
            value: resp.data.salesPending,
            title: 'Vendas Pendentes',
          },
          {
            icon: Assignment,
            value: resp.data.OnReleaseSales,
            title: 'Vendas em processo',
          },
          {
            icon: Assignment,
            value: resp.data.OnReleaseDev,
            title: 'Entregas em lançamento',
          },
          {
            icon: Assignment,
            value: resp.data.delivering,
            title: 'Entregas em deslocamento',
          }
        ])
      })
      .catch(e => console.log(e))
  }

  return(
    <Grid container spacing={5}>
      
      {itens.map( item => (
        <Item 
          key={item.title}
          classes={classes} 
          title={item.title}
          icon={item.icon}
          value={item.value}
          seachHome={seachHome}
        />
      ))}
    
    </Grid>
    
  )
}