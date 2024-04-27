import React, { useState } from 'react'
import useStyles from './style'
import { AppBar, Tabs, Tab } from '@material-ui/core'

import { TabPanel, a11yProps } from '../../components/TabPanel'

import EntryProducts from './EntryProducts'
import TransferProducts from './TransferProducts'
import SearchProducts from './SearchProducts'

export default function Products() {
  const classes = useStyles()
  const [value, setValue] = useState(0)

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Tabs 
          value={value}
          onChange={(event, newValue) => setValue(newValue)}
          variant="fullWidth"
        >
          <Tab label="Consulta" {...a11yProps(0)}/>
          <Tab label="Entrada" {...a11yProps(1)}/>
          <Tab label="Transferência" {...a11yProps(2)}/>
        </Tabs>
      </AppBar>

      <TabPanel value={value} index={0}>
        <SearchProducts
          setValue={setValue}
        />
      </TabPanel>

      <TabPanel value={value} index={1}>
        <EntryProducts
          setValue={setValue}
        />
      </TabPanel>

      <TabPanel value={value} index={2}>
        <TransferProducts
          setValue={setValue}
        />
      </TabPanel>

      
    </div>
  )
}
