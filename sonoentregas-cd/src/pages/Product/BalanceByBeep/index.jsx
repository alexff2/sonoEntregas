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

import api from '../../../services/api'

import useStyles from '../style'
import DialogCreate from './DialogCreate'

const BalanceByBeep = () => {
  const [ balances, setBalances ] = React.useState([])
  const [ typeSearch, setTypeSearch ] = React.useState('id')
  const [ openDialogCreate, setOpenDialogCreate ] = React.useState(false)
  const classes = useStyles()

  const loadData = React.useCallback(async () => {
    try {
      const { data } = await api.get('/balance-by-beep/open')
      setBalances(data.balanceOpen)
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }, [])
  
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
            inputProps={{ "aria-label": "search" }}
          />
        </div>

        <Button className={classes.btnSearch}>
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
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
          {balances.map((product) => (
            <React.Fragment key={product.id}>
              <TableRow
                hover
                className={classes.row}
              >
                <TableCell>{product.id}</TableCell>
                <TableCell>{product.description}</TableCell>
                <TableCell>{product.dtBalance}</TableCell>
                <TableCell>{product.dtFinish}</TableCell>
                <TableCell align="right">
                  <Print onClick={() => {
                    /* setOpenPurchaseReport(true)
                    setPurchaseOrderSelected(purchaseOrder) */
                  }}/>
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
    </Box>
  )
}

export default BalanceByBeep
