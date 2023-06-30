import React from 'react'
import { NavLink } from "react-router-dom"
import { Button, ListItem, makeStyles } from "@material-ui/core"
import PropTypes from 'prop-types';

const useStyle = makeStyles((theme)=>({
  item: {
    display: 'flex',
    paddingTop: 0,
    paddingBottom: 0
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
    marginRight: 'auto',
    fontSize: theme.typography.h6.fontSize
  }
}))

function Navbar({
  title,
  icon: Icon,
  handleDrawerToggle,
  mobileOpen,
  href,
  ...rest
}) {
  const classes = useStyle()
  return(
    <ListItem
      className={classes.item}
      disableGutters
      {...rest}
    >
      <Button
        className={classes.button}
        onClick={() => mobileOpen &&  handleDrawerToggle()}
        component={NavLink}
        to={href}
      >
        {Icon && (
          <Icon className={classes.icon}/>
        )}
        <span className={classes.title}>{title}</span>
      </Button>
    </ListItem>
  )
}

Navbar.prototype = {
  title: PropTypes.string,
  icon: PropTypes.elementType,
  href: PropTypes.string
}

export default Navbar