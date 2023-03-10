import React, { useState } from "react"
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
  bodyTab: {
    background: '#FAFAFA',
    border: `1px solid #F7F7F7`,
    minWidth: 771,
    minHeight: 300
  }
}))

export default function ForecastView({ forecast }){
  const [value, setValue] = useState(0)
  const classes = useStyles()

  return (
    <>
      <AppBar position="static">
        <Tabs
          value={value}
          onChange={(event, newValue) => setValue(newValue)}
          aria-label="simple tabs example"
          variant="fullWidth"
        >
          <Tab label="Não validadas" {...a11yProps(0)}/>
          <Tab label="Confirmadas" {...a11yProps(1)}/>
          <Tab label="Negadas" {...a11yProps(2)}/>
        </Tabs>
      </AppBar>

      <TabPanel
        className={classes.bodyTab} value={value} index={0}
      >
        <TableContainer component={Paper}>
          <Table aria-label="collapsible table">
            <TableHeadSale />
            <TableBody>
              {forecast.sales.filter(sale => sale.validationStatus === null).map((sale, index) => (
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
          <Table aria-label="collapsible table">
            <TableHeadSale />
            <TableBody>
              {forecast.sales.filter(sale => sale.validationStatus).map((sale, index) => (
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
        className={classes.bodyTab} value={value} index={2}
      >
        <TableContainer component={Paper}>
          <Table aria-label="collapsible table">
            <TableHeadSale />
            <TableBody>
              {forecast.sales.filter(sale => sale.validationStatus === false).map((sale, index) => (
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