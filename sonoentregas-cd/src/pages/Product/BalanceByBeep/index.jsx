import React from 'react'
import { 
  Box,
  InputBase, 
  Table, 
  TableContainer, 
  TableHead, 
  TableRow, 
  TableCell,
  TableBody, 
  Paper, 
  Button, 
  Select, 
  MenuItem, 
  FormControl, 
  InputLabel, 
  Typography,
  Fab
} from '@material-ui/core'
import { Search, Add, Print } from '@material-ui/icons'
import { useReactToPrint } from 'react-to-print'

import api from '../../../services/api'

import { useAlert } from '../../../context/alertContext'

import useStyles from '../style'
import DialogCreate from './DialogCreate'
import Report from './report'
import DialogClose from './DialogClose'

const BalanceByBeep = () => {
  const [ balances, setBalances ] = React.useState([])
  const [ dataReport, setDataReport ] = React.useState(false)
  const [ typeSearch, setTypeSearch ] = React.useState('id')
  const [ search, setSearch ] = React.useState('')
  const [ openDialogCreate, setOpenDialogCreate ] = React.useState(false)
  const [ balanceIdClose, setBalanceIdClose ] = React.useState(false)
  const documentReport = React.useRef(null)
  const { setAlert } = useAlert()
  const classes = useStyles()

  const handlePrint = useReactToPrint({
    content: () => documentReport.current,
    documentTitle: 'Relatório do Balanço ' + (dataReport ? dataReport.balance.id : '1'),
    onAfterPrint: () => setDataReport(false),
  })

  const loadData = React.useCallback(async () => {
    try {
      const { data } = await api.get('/balance-by-beep/open')
      setBalances(data.balanceOpen)
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }, [])

  const loadDataReport = async balance => {
    try {
      const {data} = await api.get(`/balance-by-beep/${balance.id}/report`)
      setDataReport(data)
      setTimeout(() => {
        handlePrint()
      }, 500)
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  const find = async () => {
    if (search === '') {
      setAlert('Preencha o campo de pesquisa')
      return
    }

    try {
      const { data } = await api.get('/balance-by-beep', {
        params: {
          typeSearch,
          search
        }
      })

      setBalances(data.balance)
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }
  
  React.useEffect(() => {
    loadData()
  }, [loadData])

  return (
    <Box>
      <Box
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 20,
          backgroundColor: 'orange',
          color: 'white',
          padding: '4px 8px',
        }}
      >
        <Typography variant='h6'>Balanço por bip</Typography>
      </Box>

      <Box className={classes.barHeader}>
        <FormControl variant="outlined">
          <InputLabel id="fieldSearch" className={classes.label}>
            Tipo
          </InputLabel>
          <Select
            label="Tipo"
            labelId="fieldSearch"
            className={classes.fieldSearch}
            value={typeSearch}
            onChange={(e) => setTypeSearch(e.target.value)}
          >
            <MenuItem value="id">Código</MenuItem>
            <MenuItem value="dtBalance">Data</MenuItem>
          </Select>
        </FormControl>

        <div className={classes.search}>
          <div className={classes.searchIcon}>
            <Search />
          </div>
          <InputBase
            placeholder="Pesquisar…"
            classes={{
              root: classes.inputRoot,
              input: classes.inputInput,
            }}
            type={typeSearch === 'id' ? 'number' : 'date'}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                find()
              }
            }}
          />
        </div>

        <Button
          className={classes.btnSearch}
          onClick={find}
        >
          Pesquisar
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow className={classes.rowHeader}>
              <TableCell>Código</TableCell>
              <TableCell>Descrição</TableCell>
              <TableCell>Data</TableCell>
              <TableCell>Dt Fim</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
          {balances.map((balance) => (
            <React.Fragment key={balance.id}>
              <TableRow
                hover
                className={classes.row}
              >
                <TableCell>{balance.id}</TableCell>
                <TableCell>{balance.description}</TableCell>
                <TableCell>{balance.dtBalance}</TableCell>
                <TableCell>
                  {balance.dtFinish
                    ? <Print onClick={() => loadDataReport(balance)}/>
                    : <Button
                        variant='contained'
                        onClick={() => setBalanceIdClose(balance.id)}
                      >Finalizar</Button>}
                  </TableCell>
              </TableRow>
            </React.Fragment>
          ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Fab 
        color="primary"
        onClick={() => setOpenDialogCreate(true)}
        style={{
          position: 'fixed',
          right: 40,
          bottom: 40
        }}
      >
        <Add />
      </Fab>

      <DialogCreate
        open={openDialogCreate}
        onClose={() => setOpenDialogCreate(false)}
        loadData={loadData}
      />

      {
        dataReport && (
        <Box ref={documentReport}>
          <Report
            data={dataReport}
          />
        </Box>
        )
      }

      <DialogClose
        balanceIdClose={balanceIdClose}
        onClose={() => {
          setBalanceIdClose(false)
          loadData()
        }}
      />
    </Box>
  )
}

export default BalanceByBeep
