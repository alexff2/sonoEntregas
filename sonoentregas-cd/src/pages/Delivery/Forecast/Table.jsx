import React, { useState } from 'react'
import clsx from 'clsx'
import { lighten, makeStyles } from '@material-ui/core/styles'
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Toolbar,
  Typography,
  Paper,
  Checkbox,
  IconButton,
  Tooltip,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText
} from '@material-ui/core'
import { Delete as DeleteIcon, Add, SubdirectoryArrowRight } from '@material-ui/icons'

import EnhancedTableHead from '../../../components/EnhancedTableHead'
import Modal from '../../../components/Modal'
import ModalAddSale from './ModalAddSale'

import { getComparator, stableSort } from '../../../functions/orderTable'
import { getDateBr } from '../../../functions/getDates'
import api from '../../../services/api'

const useToolbarStyles = makeStyles((theme) => ({
  root: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(1),
  },
  highlight:
    theme.palette.type === 'light'
      ? {
          color: theme.palette.secondary.main,
          backgroundColor: lighten(theme.palette.secondary.light, 0.85),
        }
      : {
          color: theme.palette.text.primary,
          backgroundColor: theme.palette.secondary.dark,
        },
  title: {
    flex: '1 1 100%',
  },
}))

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  paper: {
    width: '100%',
    marginBottom: theme.spacing(2),
  },
  table: {
    minWidth: 750,
  },
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
}))

const TableToolbar = ({ numSelected, handleRemoveSales, forecast, getForecastSales }) => {
  const [ openModalAddSale, setOpenModalAddSale ] = useState(false)
  const classes = useToolbarStyles()

  return (
    <Toolbar
      className={clsx(classes.root, {
        [classes.highlight]: numSelected > 0,
      })}
    >
      {numSelected > 0 ? (
        <Typography className={classes.title} color="inherit" variant="subtitle1" component="div">
          {numSelected} selected
        </Typography>
      ) : (
        <Typography className={classes.title} variant="h6" id="tableTitle" component="div">
          DAVs
        </Typography>
      )}

      {numSelected > 0 ? (
        <Tooltip title="Excluir vendas selecionadas">
          <IconButton aria-label="excluir" onClick={handleRemoveSales}>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      ) : (
        <Tooltip title="Adicionar venda" onClick={() => setOpenModalAddSale(true)}>
          <IconButton aria-label="add sales">
            <Add />
          </IconButton>
        </Tooltip>
      )}

      <Modal  open={openModalAddSale} setOpen={setOpenModalAddSale}>
        <ModalAddSale setOpen={setOpenModalAddSale} forecast={forecast} getForecastSales={getForecastSales} />
      </Modal>
    </Toolbar>
  )
}

export default function TableAdd({ forecast, setForecast }) {
  const [order, setOrder] = React.useState('asc')
  const [orderBy, setOrderBy] = React.useState('ID_SALES')
  const [selected, setSelected] = React.useState([])

  const classes = useStyles()

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc'
    setOrder(isAsc ? 'desc' : 'asc')
    setOrderBy(property)
  }

  const handleClick = sale => {
    if (!sale.canRemove) {
      return
    }

    const selectedIndex = selected.indexOf(sale.id)

    let newSelected = []

    if (selectedIndex === -1) {
      newSelected = [...selected, sale.id]
    } else {
      newSelected = selected.filter((item) => item !== sale.id)
    }

    setSelected(newSelected)
  }

  const isSelected = sale => {
    if (!sale.canRemove) {
      return false
    }

    return selected.indexOf(sale.id) !== -1
  }

  const getForecastSales = async () => {
    try {
      const { data } = await api.get(`forecast/${forecast.id}`)

      setForecast(data.forecast)
    } catch (e) {
      console.log(e)
    }
  }

  const removeForecastSale = async () => {
    try {
      for(let index = 0; index < selected.length; index++) {
        await api.delete(`forecast/sale/${selected[index]}`)
      }

      forecast.sales = forecast.sales.filter(sale => {
        return selected.indexOf(sale.id) === -1
      })
    } catch (e) {
      console.log(e)
    } finally {
      setSelected([])
    }
  }

  const headCells = [
    { id: 'ID_SALES', label: 'DAV' },
    { id: 'NOMECLI', label: 'Cliente' },
    { id: 'BAIRRO', label: 'Bairro' },
    { id: 'D_ENTREGA1', label: 'Entrega' },
    { id: 'CODLOJA', label: 'Loja' },
    { id: '', label: '' }
  ]

  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <TableToolbar
          numSelected={selected.length}
          handleRemoveSales={removeForecastSale}
          forecast={forecast}
          getForecastSales={getForecastSales}
          setForecast={setForecast}
        />

        <TableContainer>
          <Table
            className={classes.table}
            size={'small'}
          >
            <EnhancedTableHead
              classes={classes}
              order={order}
              orderBy={orderBy}
              onRequestSort={handleRequestSort}
              headCells={headCells}
            />
            <TableBody>
              {stableSort(forecast.sales, getComparator(order, orderBy))
                .map((sale, index) => {
                  const isItemSelected = isSelected(sale)
                  const labelId = `enhanced-table-checkbox-${index}`

                  return (
                    <React.Fragment key={sale.id}>
                      <TableRow
                        hover
                        onClick={() => handleClick(sale)}
                        role="checkbox"
                        aria-checked={isItemSelected}
                        tabIndex={-1}
                        selected={isItemSelected}
                      >
                        <TableCell id={labelId} scope="row">
                          {sale.ID_SALES}
                        </TableCell>
                        <TableCell>{sale.NOMECLI}</TableCell>
                        <TableCell>{sale.BAIRRO}</TableCell>
                        <TableCell>{getDateBr(sale.D_ENTREGA1)}</TableCell>
                        <TableCell>{sale.SHOP}</TableCell>
                        <TableCell padding="checkbox">
                          { sale.canRemove &&
                            <Checkbox
                              checked={isItemSelected}
                              inputProps={{ 'aria-labelledby': labelId }}
                            />
                          }
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell colSpan={6} style={{padding: 0}}>
                          <List style={{padding: 0}}>
                            {sale.products.map(product => (
                              <ListItem key={product.COD_ORIGINAL} style={{padding: '0 28px'}}>
                                <ListItemAvatar>
                                  <SubdirectoryArrowRight color='inherit'/>
                                </ListItemAvatar>
                                <ListItemText secondary={
                                  <React.Fragment>
                                    {`${product.COD_ORIGINAL} - ${product.NOME}`}
                                    {
                                      product.ID_MAINTENANCE && (
                                        <span style={{marginLeft: 20, padding: '1px 4px', color: '#FFF', background: 'orange'}}>
                                          Assistência: {product.ID_MAINTENANCE}
                                        </span>
                                      )
                                    }
                                  </React.Fragment>
                                }/>
                              </ListItem>
                            ))}
                          </List>
                        </TableCell>
                      </TableRow>
                    </React.Fragment>
                  )
                })}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </div>
  )
}
