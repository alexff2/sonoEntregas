import React, { useState } from 'react'
import { AppBar, Tabs, Tab } from '@material-ui/core'

import { TabPanel, a11yProps } from '../../components/TabPanel'
import PurchaseOrder from './PurchaseOrder'
import PurchaseNotes from './PurchaseNotes'
import TransferProducts from './TransferProducts'
import SearchProducts from './SearchProducts'

import useStyles from './style'

export default function Products() {
  const classes = useStyles()
  const [value, setValue] = useState(3)

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Tabs 
          value={value}
          onChange={(event, newValue) => setValue(newValue)}
          variant="fullWidth"
        >
          <Tab label="Consulta" {...a11yProps(0)}/>
          <Tab label="Compras - Pedidos" {...a11yProps(1)}/>
          <Tab label="Compras - Notas" {...a11yProps(2)}/>
          <Tab label="Transferências" {...a11yProps(3)}/>
        </Tabs>
      </AppBar>

      <TabPanel value={value} index={0}>
        <SearchProducts />
      </TabPanel>

      <TabPanel value={value} index={1}>
        <PurchaseOrder />
      </TabPanel>

      <TabPanel value={value} index={2}>
        <PurchaseNotes />
      </TabPanel>

      <TabPanel value={value} index={3}>
        <TransferProducts />
      </TabPanel>
    </div>
  )
}
