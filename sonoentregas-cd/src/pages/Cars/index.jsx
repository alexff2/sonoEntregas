import React, { useState } from 'react'
import useStyles from './style'
import { AppBar, Tabs, Tab } from '@material-ui/core'

import { TabPanel, a11yProps } from '../../components/TabPanel'
import TableCars from './tableCars'
import RegisterCars from './registerCars'

export default function SimpleTabs() {
  const classes = useStyles();
  const [value, setValue] = useState(0);
  const [car, setCar] = useState({});
  const [ isDesableFind, setIsDesableFind ] = useState(false)
  const [ isDesableRegister, setIsDesableRegister ] = useState(false)
  const [ isDesableUpdate, setIsDesableUpdate ] = useState(true)

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Tabs 
          value={value}
          onChange={(event, newValue) => setValue(newValue)}
          aria-label="simple tabs example"
          variant="fullWidth"
        >
          <Tab label="Consulta" {...a11yProps(0)} disabled={isDesableFind}/>
          <Tab label="Cadastrar" {...a11yProps(1)} disabled={isDesableRegister}/>
          <Tab label="Alterar" {...a11yProps(2)} disabled={isDesableUpdate}/>
        </Tabs>
      </AppBar>

      <TabPanel value={value} index={0}>
        <TableCars 
          setValue={setValue}
          setIsDesableFind={setIsDesableFind}
          setIsDesableRegister={setIsDesableRegister}
          setIsDesableUpdate={setIsDesableUpdate}
          setCar={setCar}
        />
      </TabPanel>

      <TabPanel value={value} index={1}>
        <RegisterCars 
          selectCar={false}
          setValue={setValue}
          />
      </TabPanel>

      <TabPanel value={value} index={2}>
        <RegisterCars 
          setValue={setValue}
          selectCar={car}
          setSelectCar={setCar}
          setIsDesableFind={setIsDesableFind}
          setIsDesableRegister={setIsDesableRegister}
          setIsDesableUpdate={setIsDesableUpdate}
        />
      </TabPanel>
    </div>
  );
}
