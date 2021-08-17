import React from 'react'
import {
  Box,
  Divider,
  Drawer,
  List,
  makeStyles
} from '@material-ui/core'
import {
  Dashboard,
  Assignment,
  LocalShipping,
  ShoppingCart,
  People,
  Settings
} from '@material-ui/icons'
import NavItem from './NavItem'
import logo from '../../img/SolftFlex.jpeg';

const items = [
  {
    href: '/app/dashboard',
    icon: Dashboard,
    title: 'Dashboard'
  },
  {
    href: '/app/deliverys',
    icon: Assignment,
    title: 'Entregas'
  },
  {
    href: '/app/transport',
    icon: LocalShipping,
    title: 'Transportes'
  },
  {
    href: '/app/products',
    icon: ShoppingCart,
    title: 'Produtos'
  },
  {
    href: '/app/user',
    icon: People,
    title: 'Usuários'
  },
  {
    href: '/app/settings',
    icon: Settings,
    title: 'Settings'
  }
]

const useStyles = makeStyles(() => ({
  drawer: {
    width: 256,
    height: 'calc(100% - 64px)',
    flexShrink: 0
  },
  drawerPaper: {
    width: 256,
  },
  logo: {
    width: '100%'
  }
}));

const NavBar = () => {
  const classes = useStyles();
  const content = (
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
        <img src={logo} alt="Logo" className={classes.logo}/>
      </Box>
      <Divider />
      <Box p={2}>
        <List>
          {items.map( item => (
            <NavItem
              href={item.href}
              key={item.title}
              title={item.title}
              icon={item.icon}
            />
          ))}
        </List>
      </Box>
      <Box flexGrow={1} />
    </Box>
  );

  return (
    <nav>
      <Drawer
        anchor="left"
        className={classes.drawer}
        classes={{ paper: classes.drawerPaper }}
        open
        variant="persistent"
      >
        {content}
      </Drawer>
    </nav>
  );
};

export default NavBar;
