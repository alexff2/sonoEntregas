import React, { useState } from 'react'
import { NavLink } from "react-router-dom"
import { Button, Collapse, ListItem, makeStyles } from "@material-ui/core"
import PropTypes from 'prop-types';

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
  return(
    <>
      <Button
        className={classes.button}
        onClick={() => setOpen(!open)}
      >
        {Icon && (
          <Icon className={classes.icon}/>
        )}
        <span className={classes.title}>{title}</span>
      </Button>

      <Collapse component="div" in={open} timeout="auto" unmountOnExit>
        {
          subs.map((sub, i) => (
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