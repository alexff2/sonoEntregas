import React, { useEffect, useState } from 'react'
import {
  Box,
  Grid,
  Paper,
  Typography,
  makeStyles
} from '@material-ui/core'
import { LocalShipping, ShoppingCart } from '@material-ui/icons'

import { useBackdrop } from '../../context/backdropContext'

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

const Item = ({classes, title, icon: Icon, value, searchHome}) => {
  const { setSales }  = useSale()
  
  const searchSales = async () => {
    const { data } = await api.get('sales/', {
      params: {
        status: 'open'
      }
    })

    setSales(data)
    searchHome()
  }
  
  return (
  <Grid item lg={3} sm={6} xl={3} xs={12}>
    <Paper className={classes.card} onClick={searchSales}>
      <Box className={classes.boxContent}>
      {Icon && (
        <Icon
          className={classes.icon}
        />
      )}
        <Typography 
          variant="h6"
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

export default function Cards(){
  const [ itens, setItens ] = useState([])
  const classes = useStyles()
  const { setOpenBackDrop } = useBackdrop()
  const { setSales }  = useSale()

  useEffect(()=>{
    setOpenBackDrop(true)
    api.get('sales/home', {
      params: {
        status: 'open'
      }
    }).then(resp => {
      setSales(resp.data.sales)
      setOpenBackDrop(false)
    }).catch(e => {
      console.log(e)
      setOpenBackDrop(false)
    })
    api
      .get('/home')
      .then(resp => {
        setItens([
          {
            icon: ShoppingCart,
            value: `${resp.data.salesPending} / ${resp.data.salesUnscheduled}`,
            title: 'Vendas Pendentes',
          },
          {
            icon: ShoppingCart,
            value: (resp.data.salesOnRelease + resp.data.salesOnDelivering),
            title: 'Vendas em processo',
          },
          {
            icon: LocalShipping,
            value: resp.data.devOnRelease,
            title: 'Rotas em lançamento',
          },
          {
            icon: LocalShipping,
            value: resp.data.delivering,
            title: 'Rotas em deslocamento',
          }
        ])
        setOpenBackDrop(false)
      })
      .catch(e => {
        console.log(e)
        setOpenBackDrop(false)
      })
  },[setOpenBackDrop, setSales])

  const searchHome = () => {
    setOpenBackDrop(true)
    api
      .get('/home')
      .then(resp => {
        setItens([
          {
            icon: ShoppingCart,
            value: `${resp.data.salesPending} / ${resp.data.salesUnscheduled}`,
            title: 'Vendas Pendentes',
          },
          {
            icon: ShoppingCart,
            value: (resp.data.salesOnRelease + resp.data.salesOnDelivering),
            title: 'Vendas em processo',
          },
          {
            icon: LocalShipping,
            value: resp.data.devOnRelease,
            title: 'Rotas em lançamento',
          },
          {
            icon: LocalShipping,
            value: resp.data.delivering,
            title: 'Rotas em deslocamento',
          }
        ])
        setOpenBackDrop(false)
      })
      .catch(e => {
        console.log(e)
        setOpenBackDrop(false)
      })
  }

  return(
    <Grid container spacing={3}>
      
      {itens.map( item => (
        <Item 
          key={item.title}
          classes={classes} 
          title={item.title}
          icon={item.icon}
          value={item.value}
          searchHome={searchHome}
        />
      ))}
    
    </Grid>
    
  )
}