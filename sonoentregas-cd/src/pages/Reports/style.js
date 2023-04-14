import { makeStyles } from '@material-ui/core'
import { fade } from '@material-ui/core'

export const useStyle = makeStyles(theme => ({
  link: {
    display: 'flex',
    cursor: 'pointer'
  },
  tableHead: {
    '& > th': {
      padding: 2
    }
  },
  rowBody: {
    '& > td': {
      padding: 2
    }
  },
  barHeader: {
    padding: theme.spacing(2),
    background: theme.palette.primary.main,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing(2)
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: theme.palette.common.white
  },
  inputRoot: {
    color: theme.palette.common.white,
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create('width'),
    [theme.breakpoints.up('md')]: {
      width: '20ch',
    },
  },
  label: {
    color: fade(theme.palette.common.white, 0.55)
  },
  fieldSearch: {
    color: fade(theme.palette.common.white, 0.55),
    height: '2.3rem',
    width: theme.spacing(15),
    marginRight: theme.spacing(2),
  },
  btnSearch: {
    background: theme.palette.primary.dark,
    color: theme.palette.common.white,
    marginRight: 12
  }
}))
