import { makeStyles } from '@material-ui/core'

const useStyles = makeStyles( theme =>({
  tabContainer: {
    borderRadius: '4px 0 0 0',
    height: 'auto',
    display: 'block',
    overflowY: 'auto',
    overflowX: 'hidden',
    [theme.breakpoints.down('lg')]: {
      overflowX: 'auto'
    }
  },
  tabContainerHome: {
    borderRadius: '4px 0 0 0',
    height: 'calc(100vh - 280px)',
    display: 'block',
    overflowY: 'auto',
    overflowX: 'hidden',
    [theme.breakpoints.down('lg')]: {
      overflowX: 'auto',
      height: 'calc(100vh - 240px)',
    }
  },
  tableHead: {
    '& > th': {
      background: theme.palette.primary.main,
      padding: 4,
      color: theme.palette.common.white,
      fontWeight: theme.typography.fontWeightBold,
    },
    [theme.breakpoints.down('lg')]: {
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
      background: theme.palette.primary.light,
      '& > td': {
        color: '#FFF'
      }
    },
    '& > td' : {
      padding: 4,
    },
    [theme.breakpoints.down('lg')]: {
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
      padding: 4,
      color: '#FFF'
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
    [theme.breakpoints.down('lg')]: {
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