import React from 'react'
import {
  TableHead,
  TableRow,
  TableCell,
  TableSortLabel
} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles(() => ({
  visuallyHidden: {
    border: 0,
    clip: 'rect(0 0 0 0)',
    height: 1,
    margin: -1,
    overflow: 'hidden',
    padding: 0,
    position: 'absolute',
    top: 20,
    width: 1,
  },
  default: {}
}))

export default function EnhancedTableHead(props) {
  const classes = useStyles()
  const { order, orderBy, onRequestSort, headCells, classe } = props
  const createSortHandler = property => event => onRequestSort(event, property)

  return (
    <TableHead>
      <TableRow className={classe ? classe.tableHead : classes.default}>
        {headCells.map((headCell, i) => {
          if (headCell.id === '') {
            return <TableCell key={i}></TableCell>
          }
          return (<TableCell
            key={headCell.id}
            align={headCell.align ? headCell.align : 'left'}
            sortDirection={orderBy === headCell.id && order }
            className={headCell.class}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id && (
                <span className={classes.visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </span>
              )}
            </TableSortLabel>
          </TableCell>)
        })}
      </TableRow>
    </TableHead>
  )
}
