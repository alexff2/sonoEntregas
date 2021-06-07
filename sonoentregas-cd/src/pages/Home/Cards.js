import React from 'react'
import {
  Box,
  Grid,
  Paper,
  Typography,
  makeStyles
} from '@material-ui/core';
import { Assignment, ShoppingCart } from '@material-ui/icons';

const itens = [
  {
    icon: ShoppingCart,
    value: 2,
    title: 'Vendas Pendentes',
  },
  {
    icon: Assignment,
    value: 2,
    title: 'Entregas Abertas',
  },
  {
    icon: Assignment,
    value: 2,
    title: 'Entregas Finalizadas',
  },
  {
    icon: Assignment,
    value: 2,
    title: 'Total de entregas',
  }
]

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

const Item = ({classes, title, icon: Icon, value}) => (
  <Grid item lg={3} sm={6} xl={3} xs={12}>
    <Paper className={classes.card}>
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
)

export default function Home(){
  const classes = useStyles()
  return(
    <Grid container spacing={5}>
      
      {itens.map( item => (
        <Item 
          key={item.title}
          classes={classes} 
          title={item.title}
          icon={item.icon}
          value={item.value}
        />
      ))}
    
    </Grid>
    
  )
}