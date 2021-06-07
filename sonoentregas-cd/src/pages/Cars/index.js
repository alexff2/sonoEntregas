import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/core/styles'
import { AppBar, Tabs, Tab, Box, } from '@material-ui/core'
import TableCars from './tableCars'
import RegisterCars from './registerCars'

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          {children}
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
  }
}))

export default function SimpleTabs() {
  const classes = useStyles();
  const [value, setValue] = useState(0);
  const [car, setCar] = useState({});
  const [ isDesableFind, setIsDesableFind ] = useState(false)
  const [ isDesableRegister, setIsDesableRegister ] = useState(false)
  const [ isDesableUpdate, setIsDesableUpdate ] = useState(true)

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Tabs 
          value={value}
          onChange={handleChange}
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
