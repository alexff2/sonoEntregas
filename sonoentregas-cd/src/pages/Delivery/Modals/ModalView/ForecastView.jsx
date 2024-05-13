import React, { useState, useEffect } from "react"
import {
  makeStyles,
  Table,
  TableBody,
  TableContainer,
  Paper,
  AppBar,
  Tabs,
  Tab
} from "@material-ui/core"

import { TabPanel, a11yProps } from '../../../../components/TabPanel'
import RowSale from './RowSale'
import TableHeadSale from './TableHeadSale'

import api from "../../../../services/api"

const useStyles = makeStyles(theme => ({
  //Style form select\
  titleModalFinish: {
    width: '100%',
    textAlign: 'Center',
    marginTop: -30
  },
  divHeader:{
    width: '100%',
    display: 'flex',
    marginTop: -20,
    marginBottom: 15,
    '& span' : {
      fontWeight: 700
    },
    '& > div': {
      width: '50%',
      '& > p' : {
        marginBottom: 2,
        marginTop: 2,
      },
      '& > div' : {
        marginBottom: 2,
      }
    }
  },
  //Style buttons
  btnActions: {
    width: '100%',
    padding: theme.spacing(2, 0),
    display: 'flex',
    justifyContent: 'flex-end'
  },
  root: {
    '& > *': {
      borderBottom: 'unset'
    },
    background: theme.palette.primary.light
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
  const [ forecast, setForecast ] = useState()
  const [value, setValue] = useState(0)
  const classes = useStyles()

  useEffect(() => {
    const getForecast = async () => {
      try {
        const { data } = await api.get(`/forecast/${forecastId}/view`)

        setForecast(data)
      } catch (error) {
        console.log(error)
      }
    }

    getForecast()
  }, [forecastId])

  const forecastNotValidated = forecast ? forecast.sales.filter(sale => sale.validationStatus === null) : []
  const forecastAccepted = forecast ? forecast.sales.filter(sale => sale.validationStatus && sale.idDelivery === null) : []
  const forecastRefused = forecast ? forecast.sales.filter(sale => sale.validationStatus === false) : []
  const forecastInRoute = forecast ? forecast.sales.filter(sale => sale.validationStatus && sale.idDelivery !== null) : []

  return (
    <>{ forecast
      ?<>
        <AppBar position="static">
          <Tabs
            className={classes.headerTab}
            value={value}
            onChange={(event, newValue) => setValue(newValue)}
            aria-label="simple tabs example"
            variant="fullWidth"
          >
            <Tab label={`${forecastNotValidated.length} Não validada(s)`} {...a11yProps(0)}/>
            <Tab label={`${forecastAccepted.length} Confirmada(s)`} {...a11yProps(1)}/>
            <Tab label={`${forecastRefused.length} Negada(s)`} {...a11yProps(2)}/>
            <Tab label={`${forecastInRoute.length} Em Rota`} {...a11yProps(3)}/>
          </Tabs>
        </AppBar>

        <TabPanel
          className={classes.bodyTab} value={value} index={0}
        >
          <TableContainer component={Paper}>
            <Table className={classes.table}>
              <TableHeadSale/>
              <TableBody>
                {forecastNotValidated.map((sale, index) => (
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
                {forecastAccepted.map((sale, index) => (
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
                {forecastRefused.map((sale, index) => (
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
                {forecastInRoute.map((sale, index) => (
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
      : <></>}
    </>
  )
}