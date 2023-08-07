import { makeStyles } from '@material-ui/core'

const useStyle = makeStyles(theme => ({
  tableHead: {
    '& > th': {
      padding: 2,
      fontSize: 10
    }
  },
  rowBody: {
    '& > td': {
      padding: 2,
      fontSize: 10
    }
  },
  headCellNumberPurchase: {
    width: 100,
  },
  headCellValuePurchase: {
    width: 75,
  }
}))

export default { useStyle }
