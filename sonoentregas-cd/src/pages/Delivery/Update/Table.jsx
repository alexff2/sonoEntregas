import React, { useState } from 'react'
import { useParams } from 'react-router'
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

import { useForecasts } from '../../../context/forecastsContext'
import { useDelivery } from '../../../context/deliveryContext'

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

const TableToolbar = (props) => {
  const [ openModalAddSale, setOpenModalAddSale ] = useState(false)
  const classes = useToolbarStyles();
  const { numSelected, handleRemoveSales } = props;

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
        <ModalAddSale setOpen={setOpenModalAddSale}/>
      </Modal>
    </Toolbar>
  );
}

export default function TableSalesUpdate({ sales }) {
  const [order, setOrder] = React.useState('asc')
  const [orderBy, setOrderBy] = React.useState('ID_SALES')
  const [selected, setSelected] = React.useState([])

  const classes = useStyles()
  const { type, id: idData } = useParams()
  const { setForecasts, forecasts: forecastsContext } = useForecasts()
  const { setDelivery, delivery } = useDelivery()

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  }

  const handleClick = sale => {
    if (type === 'forecast' && !sale.canRemove) {
      return
    }

    const id = type === 'forecast' ? sale.id : sale.ID

    const selectedIndex = selected.indexOf(id)

    let newSelected = []

    if (selectedIndex === -1) {
      newSelected = [...selected, id]
    } else {
      newSelected = selected.filter((item) => item !== id)
    }

    setSelected(newSelected)
  }

  const isSelected = sale => {
    if (type === 'forecast' && !sale.canRemove) {
      return false
    }

    const id = type === 'forecast' ? sale.id : sale.ID

    return selected.indexOf(id) !== -1
  }

  const removeDeliverySales = async () => {
    try {
      const deliveries = delivery

      for (let indexDelivery = 0; indexDelivery < deliveries.length; indexDelivery++){
        if (deliveries[indexDelivery].ID === parseInt(idData)) {
          for(let index = 0; index < selected.length; index++) {
            const saleFind = deliveries[indexDelivery].sales.find( sale => sale.ID === selected[index])

            await api.post(`delivery/sale/rmv`, { salesProd: saleFind.products })

            const saleFilter = deliveries[indexDelivery].sales.filter( sale => sale.ID !== selected[index])


            deliveries[indexDelivery].sales = saleFilter
          }
        }
      }

      setDelivery([...deliveries])

      setSelected([])
    } catch (e) {
      console.log(e)
      const { data } = await api.get('delivery/open')
      
      setDelivery(data)
      setSelected([])
    }
  }

  const removeForecastSale = async () => {
    try {
      const forecasts = forecastsContext

      for (let indexForecast = 0; indexForecast < forecasts.length; indexForecast++){
        if (forecasts[indexForecast].id === parseInt(idData)) {
          for(let index = 0; index < selected.length; index++) {

            await api.delete(`forecast/sale/${selected[index]}`)

            const saleFilter = forecasts[indexForecast].sales.filter( sale => sale.id !== selected[index])

            forecasts[indexForecast].sales = saleFilter
          }
        }
      }

      setForecasts([...forecasts])

      setSelected([])
    } catch (e) {
      console.log(e)
      const { data } = await api.get('forecast')
      
      setForecasts(data)
      setSelected([])
    }
  }

  const handleRemoveSales = () => {
    type === 'forecast' ? removeForecastSale() : removeDeliverySales()
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
        <TableToolbar numSelected={selected.length} typ={type} handleRemoveSales={handleRemoveSales}/>
        <TableContainer>
          <Table
            className={classes.table}
            aria-labelledby="tableTitle"
            size={'small'}
            aria-label="enhanced table"
          >
            <EnhancedTableHead
              classes={classes}
              order={order}
              orderBy={orderBy}
              onRequestSort={handleRequestSort}
              headCells={headCells}
            />
            <TableBody>
              {stableSort(sales, getComparator(order, orderBy))
                .map((sale, index) => {
                  const isItemSelected = isSelected(sale)
                  const labelId = `enhanced-table-checkbox-${index}`;

                  return (
                    <React.Fragment key={type === 'forecast' ? sale.id : sale.ID}>
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
                          { (type === 'forecast' && sale.canRemove) &&
                            <Checkbox
                              checked={isItemSelected}
                              inputProps={{ 'aria-labelledby': labelId }}
                            />
                          }
                          { (type === 'delivery') &&
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
  );
}
