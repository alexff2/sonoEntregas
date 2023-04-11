import { makeStyles } from '@material-ui/core'

export const useStyle = makeStyles(() => ({
  link: {
    display: 'flex',
    cursor: 'pointer'
  },
  rowHead: {
    '& > th': {
      padding: 2
    }
  },
  rowBody: {
    '& > td': {
      padding: 2
    }
  }
}))
