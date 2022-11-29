import React, { useState } from 'react'
import {
  makeStyles, 
  AppBar,
  Tabs,
  Tab
} from "@material-ui/core"

import { TabPanel, a11yProps } from '../../components/TabPanel'

import MainShop from './MainShop'
import MainCd from './MainCd'

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
  }
}))

export default function Maintenance() {
  const classes = useStyles()
  const [value, setValue] = useState(0)

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Tabs
          value={value}
          onChange={(event, newValue) => setValue(newValue)}
          aria-label="simple tabs example"
          variant="fullWidth"
        >
          <Tab label="Assistência Loja" {...a11yProps(0)} />
          <Tab label="Assistência CD - Futuramente" {...a11yProps(1)} />
        </Tabs>
      </AppBar>

      <TabPanel value={value} index={0}>
        <MainShop/>
      </TabPanel>

      <TabPanel value={value} index={1}>
        <MainCd/>
      </TabPanel>
    </div>
  )
}
