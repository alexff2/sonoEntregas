import React from 'react'
import {
  Box,
  makeStyles,
  Tab,
  Tabs
} from '@material-ui/core'
//Components
import Sales from '../../components/TableSales'
import BoxInfo from '../../components/BoxInfo'
import Cards from './Cards'
//Contexts
import { useSale } from '../../context/saleContext'
import { a11yProps, TabPanel } from '../../components/TabPanel'

const useStyles = makeStyles((theme) => ({
  headerTab: {
    marginTop: theme.spacing(1),
    backgroundColor: theme.palette.common.white,
    borderRadius: 4,
    boxShadow: theme.shadows[1],
    '& .MuiTabs-flexContainer': {
      justifyContent: 'space-between',
      padding: '0 60px',
      [theme.breakpoints.down('lg')]: {
        padding: '0 30px',
      },
      [theme.breakpoints.down('sm')]: {
        padding: '0',
      },
    },
    '& .MuiTab-root': {
      minWidth: '33%'
    },
    '& .MuiTabs-indicator': {
      backgroundColor: theme.palette.primary.main
    },
    '& .MuiTab-textColorPrimary.Mui-selected': {
      color: theme.palette.primary.main
    },
    '& .MuiTab-textColorPrimary': {
      color: theme.palette.text.secondary
    },
    '& .MuiTab-root:hover': {
      color: theme.palette.primary.main,
      backgroundColor: theme.palette.primary.light
    },
    [theme.breakpoints.down('lg')]: {
      '& .MuiTab-root': {
        fontSize: '12px'
      },
      '& .MuiTabs-indicator': {
        height: 2
      }
    }
  },
  tabPainel: {
    minWidth: 771,
    minHeight: 300,
    padding: 0,
    '& .MuiBox-root': {
      padding: 0,
    },
    [theme.breakpoints.down('sm')]: {
      minWidth: '100%',
      '& *': {
        fontSize: '10px',
      }
    }
  },
  sales: {
    marginTop: theme.spacing(1),
    display: 'flex',
    width: '100%'
  },
  boxAddress: {
    width: '40%'
  },
}))

export default function Home(){
  const [valueTab, setValueTab] = React.useState(0)
  const classes = useStyles()
  const { sales } = useSale()

  const salesPending = sales.filter(sale => sale.D_ENTREGA1 !== null && !sale.isWithdrawal)
  const salesWithoutAppointment = sales.filter(sale => sale.D_ENTREGA1 === null)
  const salesWithdrawn = sales.filter(sale => sale.isWithdrawal)

  return(
    <Box>      
      <Cards />

      <Tabs
        className={classes.headerTab}
        value={valueTab}
        onChange={(event, newValue) => setValueTab(newValue)}
      >
        <Tab label={`Vendas Aguardando - ${salesPending.length}`} {...a11yProps(0)}/>
        <Tab label={`Vendas S/ Agendamento - ${salesWithoutAppointment.length}`} {...a11yProps(1)}/>
        <Tab label={`Vendas Retiradas - ${salesWithdrawn.length}`} {...a11yProps(2)}/>
      </Tabs>

      <TabPanel className={classes.tabPainel} value={valueTab} index={0}>
        <Box className={classes.sales}>
          <Sales
            sales={salesPending}
            type={'home'}
          />
          <Box className={classes.boxAddress}>
            <BoxInfo />
          </Box>
        </Box>
      </TabPanel>

      <TabPanel className={classes.tabPainel} value={valueTab} index={1}>
        <Box className={classes.sales}>
          <Sales
            sales={salesWithoutAppointment}
            type={'home'}
          />
          <Box className={classes.boxAddress}>
            <BoxInfo />
          </Box>
        </Box>
      </TabPanel>

      <TabPanel className={classes.tabPainel} value={valueTab} index={2}>
        <Box className={classes.sales}>
          <Sales
            sales={salesWithdrawn}
            type={'home'}
          />
          <Box className={classes.boxAddress}>
            <BoxInfo />
          </Box>
        </Box>
      </TabPanel>
    </Box>
  )
}