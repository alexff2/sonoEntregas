import React, { useState } from 'react'
import { NavLink } from "react-router-dom"
import { Button, Collapse, ListItem, makeStyles } from "@material-ui/core"
import {
  KeyboardArrowDown,
  KeyboardArrowUp
} from '@material-ui/icons'
import PropTypes from 'prop-types'

import {useAuthenticate} from '../../context/authContext'

const useStyle = makeStyles((theme)=>({
  item: {
    display: 'flex',
    paddingTop: 0,
    paddingBottom: 0,
    paddingLeft: 20
  },
  button: {
    color: theme.palette.text.secondary,
    fontWeight: theme.typography.fontWeightMedium,
    justifyContent: 'flex-start',
    letterSpacing: 0,
    padding: '10px 8px',
    textTransform: 'none',
    width: '100%'
  },
  icon: {
    marginRight: theme.spacing(1)
  },
  titleButton: {
    fontSize: theme.typography.h6.fontSize,
    paddingLeft: 2
  },
  title: {
    fontSize: theme.typography.h6.fontSize,
    paddingLeft: 8
  }
}))

function Navbar({
  title,
  icon: Icon,
  subs,
  handleDrawerToggle,
  mobileOpen,
  ...rest
}) {
  const [open, setOpen] = useState(false)
  const classes = useStyle()
  const {userAuth} = useAuthenticate()

  return(
    <>
      <Button
        className={classes.button}
        onClick={() => setOpen(!open)}
        style={{justifyContent: 'space-between'}}
      >
        <div style={{display: 'flex', alignItems: 'center'}}>
          {Icon && (
            <Icon className={classes.icon}/>
          )}
          <span className={classes.titleButton}>{title}</span>
        </div>
        {open ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
      </Button>

      <Collapse component="div" in={open} timeout="auto" unmountOnExit>
        {subs
          .filter(sub => {
            if(process.env.REACT_APP_STOCK_BEEP !== '1') {
              if(sub.title === 'Bips Pendentes' || sub.title === 'Balanço/Bip' || sub.title === 'Atualizar Bip') return false
            }
            return true
          })
          .filter(sub => !(sub.title === 'Atualizar Bip' && userAuth.DESCRIPTION === 'ALEXANDRE'))
          .map((sub, i) => (
            <ListItem
              key={i}
              className={classes.item}
              disableGutters
              {...rest}
            >
              <Button
                className={classes.button}
                onClick={() => mobileOpen &&  handleDrawerToggle()}
                component={NavLink}
                to={sub.href}
              >
                <span> - </span>
                <span className={classes.title}>{sub.title}</span>
              </Button>
            </ListItem>
          ))
        }
      </Collapse>

    </>
  )
}

Navbar.prototype = {
  title: PropTypes.string,
  icon: PropTypes.elementType,
  href: PropTypes.string
}

export default Navbar