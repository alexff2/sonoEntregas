import React, { useEffect, useState } from 'react'
import {
  makeStyles,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@material-ui/core'
import { Edit } from '@material-ui/icons'

import { useDelivery } from '../../context/deliveryContext'

import { getDateBr } from '../../functions/getDates'

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
  },
  boxTabHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    '& span': {
      fontSize: 20,
      fontWeight: theme.typography.fontWeightBold
    },
  }
}))

export default function TabPrevision({ openModals, deleteDelivery }){
  const [previsions, setPrevisions] = useState([])
  const { delivery } = useDelivery()

  const classes = useStyle()

  useEffect(() =>{
    setPrevisions(delivery.filter(item => !item.DRIVER))
  },[delivery])

  return (
    <>
    {previsions.length > 0 && 
    <>
      <div className={classes.boxTabHeader}>
        <span>Previsões</span>
      </div>
      <TableContainer component={Paper}>
        <Table aria-label="customized table">
          <TableHead>
            <TableRow>
            {['Código', 'Descrição', 'Status'].map((value, index) => (
              <TableCell className={classes.headCell} key={index}>{value}</TableCell>
            ))}
              <TableCell  className={classes.headCell} colSpan={2}/>
            </TableRow>
          </TableHead>
          
          <TableBody>
          {previsions.map( item => (
            <TableRow key={item.ID} className={classes.body}>
              <TableCell>{item.ID}</TableCell>
              <TableCell>
                {`${item.DESCRIPTION} ${getDateBr(item.D_PREVISION)}`}
              </TableCell>
              <TableCell width={'15%'}>
                <div 
                  style={StyleStatus('Previsão')}
                  onClick={() => openModals(item, 'view')}
                >Previsão</div>
              </TableCell>

              <TableCell>
                <Edit onClick={()=> openModals(item, 'update')}/>
              </TableCell>
            </TableRow>
          ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
    }
    </>
  )
}