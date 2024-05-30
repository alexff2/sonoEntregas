import React, { useState } from 'react'
import useStyles from './style'
import { AppBar, Tabs, Tab } from '@material-ui/core'

import { TabPanel, a11yProps } from '../../components/TabPanel'

import PurchaseOrder from './PurchaseOrder'
import PurchaseNotes from './PurchaseNotes'
import TransferProducts from './TransferProducts'
import SearchProducts from './SearchProducts'

export default function Products() {
  const classes = useStyles()
  const [value, setValue] = useState(1)

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
        <SearchProducts
          setValue={setValue}
        />
      </TabPanel>

      <TabPanel value={value} index={1}>
        <PurchaseOrder
          setValue={setValue}
        />
      </TabPanel>

      <TabPanel value={value} index={2}>
        <PurchaseNotes
          setValue={setValue}
        />
      </TabPanel>

      <TabPanel value={value} index={3}>
        <TransferProducts
          setValue={setValue}
        />
      </TabPanel>

      
    </div>
  )
}
