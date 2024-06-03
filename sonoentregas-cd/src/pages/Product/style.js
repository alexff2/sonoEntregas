import { makeStyles, fade } from '@material-ui/core/styles'

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
  },
  boxfield: {
    display: 'flex',
    justifyContent: 'space-between'
  },
  field: {
    width: '49%'
  },
  barHeader: {
    padding: theme.spacing(2),
    background: theme.palette.primary.main,
    display: 'flex',
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column',
      gap: 4
    }
    //flexGrow: 1
  },
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing(2),
    [theme.breakpoints.down('sm')]: {
      marginRight: theme.spacing(0)
    },
    width: 300,
    [theme.breakpoints.down('sm')]: {
      width: 200
    },
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
    color: theme.palette.common.white
  },
  rowHeader: {
    background: theme.palette.primary.light,
    '& > *': {
      color: '#FFF'
    }
  },
  btnAdd: {
    position: 'fixed',
    bottom: '1.5rem',
    right: '1.5rem'
  },
  boxTablesProducts: {
    height: 400,
    position: 'relative',
    marginBottom: 20
  },
  tableSearch: {
    position: 'absolute',
    zIndex: 3,
    height: 400,
    background: '#FFF',
  },
  tableProduct: {
    height: 400,
  },
}))

export default useStyles