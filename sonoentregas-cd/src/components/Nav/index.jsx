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
  ViewWeek,
  Build,
  AirlineSeatIndividualSuite
} from '@material-ui/icons'

import NavItemSub from './NavItemSub'
import NavItem from './NavItem'
import { useAuthenticate } from '../../context/authContext'
import logo from '../../img/SolftFlex.jpeg';

const widthDrawer = 256

const itens = [
  {
    title: 'Home',
    href: '/app/home',
    icon: Dashboard,
    fullWidth: true
  },
  {
    title: 'Entregas',
    href: '/app/delivery',
    icon: EmojiTransportationTwoTone,
    fullWidth: true
  },
  {
    title: 'Transportes',
    href: '/app/transports',
    icon: LocalShipping,
    fullWidth: true
  },
  {
    title: 'Vendas',
    icon: ShoppingCart,
    subs: [
      {
        title: 'Consulta',
        href: '/app/sales/search',
      },
      {
        title: 'Devoluções',
        href: '/app/sales/returns',
      },
    ],
    fullWidth: true
  },
  {
    title: 'Produtos',
    icon: AirlineSeatIndividualSuite,
    subs: [
      {
        title: 'Consulta',
        href: '/app/products/search',
      },
      {
        title: 'Pedidos',
        href: '/app/products/purchase-order',
      },
      {
        title: 'Notas',
        href: '/app/products/purchase-notes',
      },
      {
        title: 'Transferências',
        href: '/app/products/transfer',
      },
      {
        title: 'Atualizar Bip',
        href: '/app/products/change-beep',
      },
      {
        title: 'Bips Pendentes',
        href: '/app/products/modules-pending-beep',
      },
    ],
    fullWidth: true
  },
  {
    title: 'Assistências',
    href: '/app/maintenance',
    icon: Build,
    fullWidth: true
  },
  {
    title: 'Bipagens',
    href: '/app/beeping',
    icon: ViewWeek,
    fullWidth: false
  },
  {
    title: 'Usuários',
    href: '/app/users',
    icon: People,
    fullWidth: true
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
          {itens
            .filter(item => 
              (mobileOpen ? true : item.fullWidth) &&
              (userAuth.OFFICE === 'Dev' || item.title !== 'Usuários')
            )
            .map(item => {
              if (item.subs) {
                return (
                  <NavItemSub
                    key={item.title}
                    title={item.title}
                    subs={item.subs}
                    icon={item.icon}
                    handleDrawerToggle={handleDrawerToggle}
                    mobileOpen={mobileOpen}
                  />
                )
              } else {
                return (
                  <NavItem
                    key={item.title}
                    title={item.title}
                    href={item.href}
                    icon={item.icon}
                    handleDrawerToggle={handleDrawerToggle}
                    mobileOpen={mobileOpen}
                  />
                )
              }
            })
          }
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
        {drawer}
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