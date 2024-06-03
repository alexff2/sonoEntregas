import React from 'react'
import {
  Box,
  Divider,
  Drawer,
  List,
  makeStyles,
  Hidden
} from '@material-ui/core'
import {
  EmojiTransportationTwoTone,
  Dashboard,
  LocalShipping,
  People,
  ShoppingCart,
  KingBed,
  Build
} from '@material-ui/icons'

import NavItem from './NavItem'
import { useAuthenticate } from '../../context/authContext'
import logo from '../../img/SolftFlex.jpeg';

const widthDrawer = 256

const itens = [
  {
    title: 'Home',
    href: '/app/home',
    icon: Dashboard
  },
  {
    title: 'Entregas',
    href: '/app/delivery',
    icon: EmojiTransportationTwoTone
  },
  {
    title: 'Transportes',
    href: '/app/transports',
    icon: LocalShipping
  },
  {
    title: 'Vendas',
    href: '/app/sales',
    icon: ShoppingCart
  },
  {
    title: 'Produtos',
    href: '/app/products',
    icon: KingBed
  },
  {
    title: 'Assistências',
    href: '/app/maintenance',
    icon: Build
  },
  {
    title: 'Usuários',
    href: '/app/users',
    icon: People
  },
]

const itensMobile = [
  {
    title: 'Home',
    href: '/app/home',
    icon: Dashboard
  },
  {
    title: 'Entregas',
    href: '/app/delivery',
    icon: EmojiTransportationTwoTone
  },
  {
    title: 'Transportes',
    href: '/app/transports',
    icon: LocalShipping
  },
  {
    title: 'Vendas',
    href: '/app/sales',
    icon: ShoppingCart
  },
  {
    title: 'Produtos',
    href: '/app/products',
    icon: KingBed
  },
  {
    title: 'Assistências',
    href: '/app/maintenance',
    icon: Build
  },
  {
    title: 'Bipagens',
    href: '/app/beeping',
    icon: Build
  },
  {
    title: 'Usuários',
    href: '/app/users',
    icon: People
  },
]

const useStyle = makeStyles(theme => ({
  drawer: {
    [theme.breakpoints.up('sm')]: {
      width: widthDrawer,
      flexShrink: 0,
    }
  },
  drawerPaper: {
    width: widthDrawer
  },
  logo: {
    width: '100%'
  }
}))

function Nav({
  handleDrawerToggle,
  container,
  mobileOpen
}) {
  const classes = useStyle()
  const { userAuth } = useAuthenticate()

  const drawer = (
    <Box
      height="100%"
      display="flex"
      flexDirection="column"
    >
      <Box
        alignItems="center"
        display="flex"
        flexDirection="column"
        p={2}
      >
        <img src={logo} alt="Logo" className={classes.logo} />
      </Box>
      <Divider />
      <Box p={2}>
        <List>
          {itens.filter(item => (userAuth.OFFICE === 'Dev' || item.title !== 'Usuários')).map(item => (
            <NavItem
              key={item.title}
              title={item.title}
              href={item.href}
              icon={item.icon}
              handleDrawerToggle={handleDrawerToggle}
              mobileOpen={mobileOpen}
            />
          ))}
        </List>
      </Box>
      <Box flexGrow={1} />
    </Box>
  )

  const drawerMobile = (
    <Box
      height="100%"
      display="flex"
      flexDirection="column"
    >
      <Box
        alignItems="center"
        display="flex"
        flexDirection="column"
        p={2}
      >
        <img src={logo} alt="Logo" className={classes.logo} />
      </Box>
      <Divider />
      <Box p={2}>
        <List>
          {itensMobile.map(item => (
            <NavItem
              key={item.title}
              title={item.title}
              href={item.href}
              icon={item.icon}
              handleDrawerToggle={handleDrawerToggle}
              mobileOpen={mobileOpen}
            />
          ))}
        </List>
      </Box>
      <Box flexGrow={1} />
    </Box>
  )

return (
  <nav className={classes.drawer} aria-label="mailbox folders">
    <Hidden smUp implementation="css">
      <Drawer
        container={container}
        variant="temporary"
        anchor={'left'}
        open={mobileOpen}
        onClose={handleDrawerToggle}
        classes={{
          paper: classes.drawerPaper,
        }}
        ModalProps={{
          keepMounted: true,
        }}
      >
        {drawerMobile}
      </Drawer>
    </Hidden>
    <Hidden xsDown implementation="css">
      <Drawer
        classes={{
          paper: classes.drawerPaper,
        }}
        variant="permanent"
        open
      >
        {drawer}
      </Drawer>
    </Hidden>
  </nav>
  )
}

export default Nav