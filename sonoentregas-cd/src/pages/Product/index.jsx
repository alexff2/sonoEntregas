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
        </Tabs>
      </AppBar>

      <TabPanel value={value} index={0}>
        <SearchProducts />
      </TabPanel>
    </div>
  )
}
