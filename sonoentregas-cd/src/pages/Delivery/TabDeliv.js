import React, { useState, useEffect } from 'react'
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

import { useDelivery } from '../../context/deliveryContext'
import { useDeliveryFinish } from '../../context/deliveryFinishContext'

import StyleStatus from '../../functions/styleStatus'

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
      padding: '4px 16px'
    }
  }
}))

export default function TabDeliv({ type, deleteDelivery, openModals }){
  const [ delivery, setDelivery ] = useState([])
  
  const { delivery: delivOpen } = useDelivery()
  const { deliveryFinish } = useDeliveryFinish()

  const classes = useStyle()

  useEffect(()=>{
    type === 'open' ? setDelivery(delivOpen) : setDelivery(deliveryFinish)
  },[type, delivOpen, deliveryFinish])


  return (
    <TableContainer component={Paper}>
      <Table aria-label="custumezed table">
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
            <TableCell width={'25%'}>{item.DESCRIPTION}</TableCell>
            <TableCell width={'13%'}>{item.DRIVER}</TableCell>
            <TableCell width={'13%'}>{item.ASSISTANT}</TableCell>
            <TableCell width={'10%'}>{item.CAR}</TableCell>
            <TableCell width={'15%'}>
              <div 
                style={StyleStatus(item.STATUS)}
                onClick={() => openModals(item, 'view')}
              >{item.STATUS}</div>
            </TableCell>
            <TableCell width={'10%'} align="right">
              {(item.STATUS === 'Em lançamento') && (
              <>
                <Edit onClick={()=> openModals(item, 'update')}/>
                <Delete onClick={()=> deleteDelivery(item.ID)}/>
              </>
              )}
            </TableCell>
            <TableCell width={'7%'}>
              {item.STATUS !== 'Finalizada' && (
              <Button
                onClick={() => openModals(item, 'status')}
                children={item.STATUS === 'Em lançamento' ? 'Entregar' : 'Finalizar'}
              />
              )}
            </TableCell>
          </TableRow>
        ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}