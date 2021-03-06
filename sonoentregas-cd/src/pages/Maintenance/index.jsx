import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { 
  Box, 
  makeStyles, 
  AppBar,
  Tabs,
  Tab
} from "@material-ui/core"
import MainShop from './MainShop'
import MainCd from './MainCd'

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
        <Box paddingY={0.5}>
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

export default function Maintenance() {
  const classes = useStyles()
  const [value, setValue] = useState(0)

  const handleChange = (event, newValue) => {
    setValue(newValue)
  }

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="simple tabs example"
          variant="fullWidth"
        >
          <Tab label="AssistĂȘncia Loja" {...a11yProps(0)} />
          <Tab label="AssistĂȘncia CD - Futuramente" {...a11yProps(1)} />
        </Tabs>
      </AppBar>

      <TabPanel value={value} index={0}>
        <MainShop/>
      </TabPanel>

      <TabPanel value={value} index={1}>
        <MainCd/>
      </TabPanel>
    </div>
  );
}
