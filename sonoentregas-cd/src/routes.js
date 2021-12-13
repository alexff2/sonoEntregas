import React from 'react'
import { Route, Redirect } from 'react-router-dom'
import { makeStyles } from '@material-ui/core'

import Home from './pages/Home'
import Delivery from './pages/Delivery'
import Cars from './pages/Cars'
import Users from './pages/Users'
import Products from './pages/Product'
import Sales from './pages/Sales'
//import Error from './pages/Error'

const useStyles = makeStyles((theme) => ({
  content: {
    flexGrow: 1,
    padding: theme.spacing(3)
  },
  toolbar: theme.mixins.toolbar,
}))

const RedirectHome = () => <Redirect to="/app/home"/>

const Routes = () => {
  const classes = useStyles()
  return(
    <main className={classes.content}>
      <div className={classes.toolbar} />
      <Route path="/" exact component={RedirectHome} />
      <Route path="/app/home" exact component={Home} />
      <Route path="/app/transports" exact component={Cars} />
      <Route path="/app/delivery" exact component={Delivery} />
      <Route path="/app/users" exact component={Users} />
      <Route path="/app/products" exact component={Products} />
      <Route path="/app/sales" exact component={Sales} />
    </main>
)}

export default Routes