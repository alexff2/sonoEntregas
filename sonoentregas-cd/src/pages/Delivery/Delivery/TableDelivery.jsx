import React from 'react'
import { NavLink } from 'react-router-dom'
import {
  Button,
  makeStyles,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@material-ui/core'
import { Delete, Edit } from '@material-ui/icons'

import { useDelivery } from '../../../context/deliveryContext'
import { useDeliveryFinish } from '../../../context/deliveryFinishContext'

import StyleStatus from '../../../functions/styleStatus'

const useStyle = makeStyles(theme => ({
  headCell: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
    fontWeight: theme.typography.fontWeightBold
  },
  body: {
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
      padding: 0
    },
    '& td': {
      padding: '4px 16px',
      [theme.breakpoints.down('sm')]: {
        padding: '4px',
        fontSize: '12px',
        '& button': {
          padding: '4px'
        }
      }
    }
  },
  link: {
    textDecoration: 'none',
    color: theme.palette.text.primary
  }
}))

export default function TableDelivery({ type, deleteDelivery, openModals }){
  const { delivery: deliveryOpen } = useDelivery()
  const { deliveryFinish } = useDeliveryFinish()

  const delivery = type === 'open' ? deliveryOpen : deliveryFinish

  const classes = useStyle()

  return (
    <TableContainer component={Paper}>
      <Table aria-label="customized table">
        <TableHead>
          <TableRow>
          {['Código', 'Descrição', 'Motorista', 'Auxiliar', 'Veículo', 'Status'].map((value, index) => (
            <TableCell className={classes.headCell} key={index}>{value}</TableCell>
          ))}
            <TableCell  className={classes.headCell} colSpan={2}/>
          </TableRow>
        </TableHead>
        
        <TableBody>
        {delivery.map( item => (
          <TableRow key={item.ID} className={classes.body}>
            <TableCell width={'5%'}>{item.ID}</TableCell>
            <TableCell width={'25%'}>{item.DESCRIPTION+' - '+item.D_MOUNTING}</TableCell>
            <TableCell width={'13%'}>{item.DRIVER}</TableCell>
            <TableCell width={'13%'}>{item.ASSISTANT}</TableCell>
            <TableCell width={'10%'}>{item.CAR}</TableCell>
            <TableCell width={'15%'}>
              <div 
                style={StyleStatus(item.STATUS)}
                onClick={() => openModals(item, 'view')}
              >{item.STATUS}</div>
            </TableCell>
            {item.STATUS === 'Em lançamento' &&
              <TableCell width={'10%'} align="right">
                <NavLink to={`update/delivery/${item.ID}`} className={classes.link}>
                  <Edit />
                </NavLink>
                <Delete onClick={()=> deleteDelivery(item.ID)}/>
              </TableCell>
            }
            {item.STATUS !== 'Finalizada' &&
              <TableCell width={'7%'}>
                <Button
                  onClick={() => openModals(item, 'status')}
                  children={item.STATUS === 'Em lançamento' ? 'Entregar' : 'Finalizar'}
                />
              </TableCell>
            }
          </TableRow>
        ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}