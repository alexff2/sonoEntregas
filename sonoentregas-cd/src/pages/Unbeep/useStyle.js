import {
  makeStyles
} from '@material-ui/core'

export const useStyle = makeStyles(theme => ({
  BoxButtons: {
    marginTop: theme.spacing(4),
    display: 'flex',
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column'
    },
    flexDirection: 'row',
    justifyContent: 'center',
    gap: theme.spacing(2),
    '& > button': {
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.common.white,
      '&:hover': {
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.common.white,
        opacity: 0.8
      }
    }
  }
}))
