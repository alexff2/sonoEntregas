import { makeStyles } from '@material-ui/core'

const useStyles = makeStyles( theme =>({
  tabContainer: {
    borderRadius: '4px 0 0 0',
    display: 'block',
    overflowY: 'auto',
    overflowX: 'hidden',
    [theme.breakpoints.down('sm')]: {
      overflowX: 'auto'
    }
  },
  tableHead: {
    background: theme.palette.primary.main,
    '& > th': {
      padding: 4,
      color: theme.palette.common.white,
      fontWeight: theme.typography.fontWeightBold,
    },
    [theme.breakpoints.down('sm')]: {
      '& > th': {
        fontSize: '10px'
      }
    }
  },
  row: {
    '& > *': {
      borderBottom: 'unset'
    },
    '&:hover': {
      background: theme.palette.primary.light
    },
    '& > td' : {
      padding: 4
    },
    [theme.breakpoints.down('sm')]: {
      '& > td': {
        fontSize: '10px'
      }
    }
  },
  row1: {
    '& > *': {
      borderBottom: 'unset'
    },
    background: theme.palette.primary.light,
    '& > td' : {
      padding: 4
    }
  },
  tableProductsCells: {
    '& > th': {
      padding: '0 8px',
      fontSize: '12px'
    },
    '& > td': {
      padding: '0 8px',
      fontSize: '12px'
    },
    [theme.breakpoints.down('sm')]: {
      '& > th': {
        padding: '0 4px',
        fontSize: '10px'
      },
      '& > td': {
        padding: '0 4px',
        fontSize: '10px'
      },
    }
  },
  tdCheckBox: {
    '& > span': {
      padding: 0
    }
  }
}))

export default useStyles