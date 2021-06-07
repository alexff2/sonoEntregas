//Module import
import React from 'react'
import { Box, Divider, Drawer, List, makeStyles } from '@material-ui/core'
import { Assignment, Dashboard, LocalShipping, People } from '@material-ui/icons'

//files import
import NavItem from './NavItem'
import logo from '../../img/SolftFlex.jpeg';

//System variables
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
    icon: Assignment
  },
  {
    title: 'Transportes',
    href: '/app/transports',
    icon: LocalShipping
  },
  {
    title: 'Produtos',
    href: '/app/products',
    icon: Dashboard
  },
  {
    title: 'Usuários',
    href: '/app/users',
    icon: People
  },
]

const useStyle = makeStyles(()=>({
  drawer: {
    width: widthDrawer,
    flexShrink: 0
  },
  drawerPapper: {
    width: widthDrawer
  },
  logo: {
    width: '100%'
  }
}))

function Nav() {
  const classes = useStyle()
  return(
    <Drawer 
      anchor="left"
      variant="persistent"
      open
      className={classes.drawer}
      classes={{
        paper: classes.drawerPapper
      }}
    >
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
            {itens.map( item => (
              <NavItem 
                key={item.title}
                title={item.title}
                href={item.href}
                icon={item.icon}
              />
            ))}
          </List>
        </Box>
        <Box flexGrow={1} />
      </Box>
    </Drawer>
  )
}

export default Nav