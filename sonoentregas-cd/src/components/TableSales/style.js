import { makeStyles } from '@material-ui/core'

const useStyles = makeStyles( theme =>({
  TabContainer: {
    borderRadius: '4px 0 0 0',
    '& > table': {
      '& > thead': {
        display: 'block'
      },
      '& > tbody': {
        display: 'block'
      }
    }
  },
  tableHead: {
    background: theme.palette.primary.main
  },
  headUpDown: {
    color: theme.palette.common.white,
    fontWeight: theme.typography.fontWeightBold,
    padding: '0 10px',
    width: 46
  },
  headIdSale:{
    color: theme.palette.common.white,
    fontWeight: theme.typography.fontWeightBold,
    padding: '5px 0 5px 10px',
    width: 110
  },
  headName:{
    color: theme.palette.common.white,
    fontWeight: theme.typography.fontWeightBold,
    padding: 0,
    width: 280
  },
  headDistrict:{
    color: theme.palette.common.white,
    fontWeight: theme.typography.fontWeightBold,
    padding: 0,
    width: 130
  },
  headDate:{
    color: theme.palette.common.white,
    fontWeight: theme.typography.fontWeightBold,
    padding: 0,
    width: 115,
    textAlign: 'end'
  },
  headShop:{
    color: theme.palette.common.white,
    fontWeight: theme.typography.fontWeightBold,
    padding: '0 24px 0 0',
    width: 118,
    textAlign: 'end'
  },
  tableBody1: {
    height: 'calc(100vh - 320px)',
    overflowY: 'auto',
    overflowX: 'hidden'
  },
  tableBody2: {
    height: 'calc(100vh - 490px)',
    overflowX: 'hidden',
    overflowY: 'auto'
  },
  row: {
    '& > *': {
      borderBottom: 'unset'
    },
    '&:hover': {
      background: theme.palette.primary.light
    }
  },
  row1: {
    '& > *': {
      borderBottom: 'unset'
    },
    background: theme.palette.primary.light
  },
  bodyUpDown: {
    padding: '0 10px',
    width: 46
  },
  bodyIdSale:{
    padding: '5px 0 5px 10px',
    width: 110
  },
  bodyName:{
    padding: 0,
    width: 280,
  },
  bodyDistrict:{
    padding: 0,
    width: 130,
  },
  dateDelivRed: {
    color: 'red',
    padding: 0,
    width: 115,
    textAlign: 'end'
  },
  dateDelivBlack: {
    color: 'black',
    padding: 0,
    width: 115,
    textAlign: 'end'
  },
  dateDelivYellow: {
    color: 'yellow',
    padding: 0,
    width: 115,
    textAlign: 'end'
  },
  bodyShop:{
    padding: 0,
    width: 95,
    textAlign: 'end'
  },
  tdCheckBox: {
    padding: '0 10px',
    '& > span': {
      padding: 0
    }
  }
}))

export default useStyles