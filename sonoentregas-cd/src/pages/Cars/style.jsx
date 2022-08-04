import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
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
  }
}))

export default useStyles