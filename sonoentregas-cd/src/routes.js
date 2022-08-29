import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { makeStyles } from '@material-ui/core'

import Home from './pages/Home'
import Delivery from './pages/Delivery'
import Cars from './pages/Cars'
import Users from './pages/Users'
import Products from './pages/Product'
import Sales from './pages/Sales'
import Maintenance from './pages/Maintenance'
//import Error from './pages/Error'

const useStyles = makeStyles((theme) => ({
  content: {
    flexGrow: 1,
    padding: theme.spacing(3)
  },
  toolbar: theme.mixins.toolbar,
}))

const Routess = () => {
  const classes = useStyles()
  return(
    <main className={classes.content}>
      <div className={classes.toolbar} />
      <Routes>

        <Route path="/" element={<Navigate to="/app/home"/>} />
        <Route path="/app/home" element={<Home />} />
        <Route path="/app/transports" element={<Cars />} />
        <Route path="/app/delivery" element={<Delivery />} />
        <Route path="/app/sales" element={<Sales />} />
        <Route path="/app/products" element={<Products />} />
        <Route path="/app/maintenance" element={<Maintenance />} />
        <Route path="/app/users" element={<Users />} />
      </Routes>
    </main>
)}

export default Routess