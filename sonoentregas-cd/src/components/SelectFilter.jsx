import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  Button,
  MenuItem,
  Menu
} from '@material-ui/core'

const useStyles = makeStyles((theme) => ({
  btn: {
    marginLeft: 4,
    marginRight: 4
  },
}))

const options = [
  'Filtro',
  'Código',
  'Descrição'
]

export default function SimpleListMenu() {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [selectedIndex, setSelectedIndex] = React.useState(1);

  const handleClickListItem = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleMenuItemClick = (event, index) => {
    setSelectedIndex(index)
    setAnchorEl(null)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  return (
    <div>
      <Button
        className={classes.btn}
        variant='outlined'
        onClick={handleClickListItem}
      >{options[selectedIndex]}</Button>

      <Menu
        id="lock-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        {options.map((option, index) => (
          <MenuItem
            key={option}
            disabled={index === 0}
            selected={index === selectedIndex}
            onClick={(event) => handleMenuItemClick(event, index)}
          >
            {option}
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
}
