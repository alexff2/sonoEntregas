import React, { useState } from 'react'
import { AppBar, Tabs, Tab } from '@material-ui/core'

import { useAuthenticate } from '../../context/authContext'

import { TabPanel, a11yProps } from '../../components/TabPanel'
import PurchaseOrder from './PurchaseOrder'
import PurchaseNotes from './PurchaseNotes'
import TransferProducts from './TransferProducts'
import SearchProducts from './SearchProducts'
import SearchProductsBeep from './SearchProductsBeep'
import ChangeSerialNumber from './ChangeSerialNumber'

import useStyles from './style'

const userAuthToSingleEntered = (userName) => {
  const users = [
    'ALEXANDRE'
  ]

  return !!users.find(user => user === userName)
}

export default function Products() {
  const [value, setValue] = useState(0)
  const { userAuth } = useAuthenticate()
  const classes = useStyles()

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Tabs 
          value={value}
          onChange={(event, newValue) => setValue(newValue)}
          variant="fullWidth"
        >
          <Tab label="Consulta" {...a11yProps(0)}/>
          <Tab label="Pedidos" {...a11yProps(1)}/>
          <Tab label="Notas" {...a11yProps(2)}/>
          <Tab label="Transferências" {...a11yProps(3)}/>
          <Tab label="Est. Bip" {...a11yProps(4)}/>
          {userAuthToSingleEntered(userAuth.DESCRIPTION) && <Tab label="Alt. Bip" {...a11yProps(5)}/>}
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

      <TabPanel value={value} index={4}>
        <SearchProductsBeep />
      </TabPanel>

      { userAuthToSingleEntered(userAuth.DESCRIPTION) &&
        <TabPanel value={value} index={5}>
          <ChangeSerialNumber />
        </TabPanel>
      }
    </div>
  )
}
