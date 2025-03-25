import React, { useState, useEffect } from "react"
import {
  makeStyles,
  Table,
  TableBody,
  TableContainer,
  Paper,
  AppBar,
  Tabs,
  Tab,
  Typography
} from "@material-ui/core"

import { TabPanel, a11yProps } from '../../../../components/TabPanel'
import RowSale from './RowSale'
import TableHeadSale from './TableHeadSale'

import api from "../../../../services/api"

const useStyles = makeStyles(theme => ({
  titleModalFinish: {
    width: '100%',
    textAlign: 'Center',
    fontSize: 20,
    fontWeight: 600,
    color: theme.palette.common.black,
    padding: theme.spacing(2, 0),
  },
  headerTab: {
    [theme.breakpoints.down('sm')]: {
      '& *': {
        fontSize: '10px'
      }
    }
  },
  bodyTab: {
    background: '#FAFAFA',
    border: `1px solid #F7F7F7`,
    minWidth: 771,
    minHeight: 300,
    [theme.breakpoints.down('sm')]: {
      minWidth: '100%',
      '& *': {
        fontSize: '10px',
        padding: 4
      }
    }
  }
}))

export default function ForecastView({ forecastId, handleInvalidationSale }){
  const [ sales, setSales ] = useState([])
  const [value, setValue] = useState(0)
  const classes = useStyles()

  useEffect(() => {
    const getForecast = async () => {
      try {
        const { data } = await api.get(`/forecast/${forecastId}/view`)

        setSales(data.sales)
      } catch (error) {
        console.log(error)
      }
    }

    getForecast()
  }, [forecastId])

  const salesNotValidated = sales.filter(sale => sale.validationStatus === null)
  const salesAccepted = sales.filter(sale => sale.validationStatus && sale.idDelivery === null)
  const salesRefused = sales.filter(sale => sale.validationStatus === false)
  const salesInRoute = sales.filter(sale => sale.validationStatus && sale.idDelivery !== null)

  return (
    <>
      <Typography variant="h3" className={classes.titleModalFinish}>
        {`Visualização - ${sales.length } venda(s) lançada(s)`}
      </Typography>
      <AppBar position="static">
        <Tabs
          className={classes.headerTab}
          value={value}
          onChange={(event, newValue) => setValue(newValue)}
          aria-label="simple tabs example"
          variant="fullWidth"
        >
          <Tab label={`${salesNotValidated.length} Não validada(s)`} {...a11yProps(0)}/>
          <Tab label={`${salesAccepted.length} Confirmada(s)`} {...a11yProps(1)}/>
          <Tab label={`${salesRefused.length} Negada(s)`} {...a11yProps(2)}/>
          <Tab label={`${salesInRoute.length} Em Rota`} {...a11yProps(3)}/>
        </Tabs>
      </AppBar>

      <TabPanel
        className={classes.bodyTab} value={value} index={0}
      >
        <TableContainer component={Paper}>
          <Table className={classes.table}>
            <TableHeadSale/>
            <TableBody>
              {salesNotValidated.map((sale, index) => (
                <RowSale
                  key={index}
                  sale={sale}
                  type={'close'}
                />
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </TabPanel>

      <TabPanel
        className={classes.bodyTab} value={value} index={1}
      >
        <TableContainer component={Paper}>
          <Table className={classes.table}>
            <TableHeadSale type='forecastView'/>
            <TableBody>
              {salesAccepted.map((sale, index) => (
                <RowSale
                  key={index}
                  sale={sale}
                  type={'forecastView'}
                  handleInvalidationSale={handleInvalidationSale}
                />
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </TabPanel>

      <TabPanel
        className={classes.bodyTab} value={value} index={2}
      >
        <TableContainer component={Paper}>
          <Table className={classes.table}>
            <TableHeadSale />
            <TableBody>
              {salesRefused.map((sale, index) => (
                <RowSale
                  key={index}
                  sale={sale}
                  type={'close'}
                />
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </TabPanel>

      <TabPanel
        className={classes.bodyTab} value={value} index={3}
      >
        <TableContainer component={Paper}>
          <Table className={classes.table}>
            <TableHeadSale/>
            <TableBody>
              {salesInRoute.map((sale, index) => (
                <RowSale
                  key={index}
                  sale={sale}
                  type={'close'}
                />
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </TabPanel>
    </>
  )
}