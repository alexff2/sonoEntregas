import React, { useEffect, useState } from 'react'
import {
  AppBar,
  Box,
  FormControl,
  FormControlLabel,
  IconButton,
  MenuItem,
  Paper,
  Radio,
  RadioGroup,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Toolbar,
  Typography,
  makeStyles,
} from '@material-ui/core'
import {
  Close as CloseIcon,
  Cancel,
  Search as SearchIcon
} from '@material-ui/icons'

import BrMonetaryValue from '../../../../components/BrMonetaryValue'
import {ButtonCancel, ButtonSuccess} from '../../../../components/Buttons'
import { debounce } from '../../../../functions/debounce'
import { useBackdrop } from '../../../../context/backdropContext'
import { useAlertSnackbar } from '../../../../context/alertSnackbarContext'
/* import { Search } from '../../../../components/Search' */

import api from '../../../../services/api'

const useStyles = makeStyles((theme) => ({
  appBar: {
    position: 'relative',
  },
  title: {
    marginLeft: theme.spacing(2),
    flex: 1,
  },
}))

const Input = ({
  id,
  label,
  width='140px',
  type='text',
  disable=false,
  ...props
}) => {
  return (
    <TextField
      id={id}
      label={label}
      type={type}
      variant='outlined'
      disabled={disable}
      InputLabelProps={{
        shrink: true,
      }}
      margin='dense'
      size='small'
      style={{
        width,
        backgroundColor: 'white',
      }}
      {...props}
    />
  )
}

export default function CreateUpdatePurchaseOrder({
  setOpen,
  noteUpdate
}){
  const [typeSearch, setTypeSearch] = useState('name')
  const [search, setSearch] = useState('')
  /* const [openSearchEmployees, setOpenSearchEmployees] = useState(true)
  const [employees, setEmployees] = useState([]) */
  const [disablePurchaseOrderId, setDisablePurchaseOrderId] = useState(false)
  const [purchaseOrderId, setPurchaseOrderId] = useState('')
  const [quantifyInput, setQuantifyInput] = useState(1)
  const [searchProduct, setSearchProduct] = useState([])
  const [searchProductSelect, setSearchProductSelect] = useState(null)
  const [productsNote, setProductsNote] = useState([])
  const [note, setNote] = useState({})
  const { setAlertSnackbar } = useAlertSnackbar()
  const { setOpenBackDrop } = useBackdrop()
  const classes = useStyles()

  useEffect(() => {
    debounce(async () => {
      const {data} = await api.get('product', {
        params: {
          search,
          type: typeSearch
        }
      })

      setSearchProduct(data)
    }, 1300)
  }, [search, typeSearch])

  const handleSelectSearchProduct = prod => {
    setSearchProductSelect(prod)
    document.getElementById('quantifyId').focus()
  }

  const handleAddProductNote = () => {
    if (quantifyInput < 1) {
      setAlertSnackbar('Valor não pode ser menor ou igual a 0!')

      setQuantifyInput(1)
      return
    }

    setProductsNote([
      ...productsNote,
      {
        item: productsNote.length + 1,
        ...searchProductSelect,
        originalCode: searchProductSelect.generalCode,
        value: searchProductSelect.PCO_COMPRA,
        total: searchProductSelect.PCO_COMPRA * quantifyInput,
        quantify: quantifyInput 
      }
    ])

    setSearchProduct([])
    setSearch('')
  }

  const handleChangeQuantify = prod => {
    setProductsNote(
      states => (states.map(state => {
        if (state.item === prod.item) {
          state.quantify = prod.quantify
          state.total = prod.quantify * state.value
        }

        return state
      }))
    )
  }

  const handleCreateNote = () => {
    try {
      if (!note.id) {
        
      }
      console.log(note)
      //setOpen(false)
    } catch (error) {
      console.log(error)
    }
  }

  let quantifyFull = 0, valueTotalFull = 0

  productsNote.forEach(prod => {
    quantifyFull += prod.quantify
    valueTotalFull += prod.total
  })

  return (
    <>
      <AppBar className={classes.appBar}>
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={() => setOpen(false)} aria-label="close">
            <CloseIcon />
          </IconButton>
          <Typography variant="h6" className={classes.title}>
            {!noteUpdate ? 'Lançamento de Nota de Entrada' : 'Atualização de Nota de Entrada'}
          </Typography>
        </Toolbar>
      </AppBar>

      <Box
        padding={2}
        bgcolor='#F9F8F8'
        height='100%'
        display='flex'
        flexDirection='column'
      >
        <Box
          border='1px solid #CCC'
          padding={1}
          display='flex'
          alignItems='center'
          justifyContent='space-between'
        >
          <Input
            id="issue"
            label="Emissão"
            type='date'
            onChange={e => setNote(state => ({...state, issue: e.target.value}))}
          />
          <Box
            display='flex'
            alignItems='center'
          >
            <Input
              id='employeeId'
              label='Comprador'
              disable={true}
              style={{
                marginRight: 4
              }}
            />
            <SearchIcon />
          </Box>
          <Input
            id='factoryData'
            label='Dados da Fabrica'
          />
          <FormControl component='fieldset'>
            <RadioGroup aria-label='gender' name='gender1'>
              <FormControlLabel value='normal' control={<Radio style={{padding: 2}}/>} label='Normal' />
              <FormControlLabel value='maintenance' control={<Radio style={{padding: 2}}/>} label='Assistência' />
            </RadioGroup>
          </FormControl>
        </Box>
        <Box
          border='1px solid #CCC'
          padding={1}
          position={'relative'}
        >
          <Box
            display={'flex'}
            alignItems={'center'}
            justifyContent={'space-between'}
          >
            <Select
              variant='outlined'
              value={typeSearch}
              onChange={e => setTypeSearch(e.target.value)}
              style={{
                width: '15%',
                height: 40,
                background: '#FFF',
                margin: '8px 0 4px 0'
              }}
            >
              <MenuItem value='name'>Pelo Nome</MenuItem>
              <MenuItem value='code'>Pelo Código</MenuItem>
            </Select>
            <Input
              width='72%'
              placeholder='Digite aqui...'
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            <Input
              id={'quantifyId'}
              type='number'
              placeholder='Qtd'
              width='10%'
              value={quantifyInput}
              onChange={e => setQuantifyInput(Number(e.target.value))}
              onKeyDown={e => e.key === 'Enter' && handleAddProductNote()}
            />
          </Box>
          {
            searchProduct.length > 0 &&
            <TableContainer
              component={Paper}
              style={{
                height: '625px',
                position: 'absolute',
                zIndex: 1500,
                width: 'calc(100% - 16px)'
              }}
            >
              <Table size='small' stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell>Código</TableCell>
                    <TableCell>Alternativo</TableCell>
                    <TableCell>Nome</TableCell>
                    <TableCell>Estoque</TableCell>
                    <TableCell>Custo</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {
                    searchProduct.map( prod => (
                      <TableRow
                        hover
                        key={prod.code}
                        onClick={() => handleSelectSearchProduct(prod)}
                      >
                        <TableCell>{prod.code}</TableCell>
                        <TableCell>{prod.generalCode}</TableCell>
                        <TableCell>{prod.name}</TableCell>
                        <TableCell align='right'>{prod.stock}</TableCell>
                        <TableCell align='right'>
                          <BrMonetaryValue value={prod.PCO_COMPRA}/>
                        </TableCell>
                      </TableRow>
                    ))
                  }
                </TableBody>
              </Table>
            </TableContainer>
          }
        </Box>
        <Box
          border='1px solid #CCC'
          padding={1}
          flex='1'
        >
          <TableContainer
            component={Paper}
            style={{
              background: 'transparent',
              height: '100%'
            }}
          >
            <Table size='small' stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell>Item</TableCell>
                  <TableCell>Código</TableCell>
                  <TableCell>Alternativo</TableCell>
                  <TableCell>Descrição</TableCell>
                  <TableCell align='right'>Quantidade</TableCell>
                  <TableCell align='right'>Valor Unit</TableCell>
                  <TableCell align='right'>Valor Total</TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableHead>
              <TableBody style={{background: 'white'}}>
                {
                  productsNote.map((prod, index) => (
                    <TableRow hover key={index}>
                      <TableCell>{prod.item}</TableCell>
                      <TableCell>{prod.code}</TableCell>
                      <TableCell>{prod.originalCode}</TableCell>
                      <TableCell>{prod.name}</TableCell>
                      <TableCell align='right'>
                        <input
                          style={{
                            border: 'none',
                            width: 50,
                            textAlign: 'right'
                          }}
                          type='number'
                          value={prod.quantify}
                          onChange={e => handleChangeQuantify({
                            item: prod.item,
                            quantify: Number(e.target.value)
                          })}
                        />
                      </TableCell>
                      <TableCell align='right'>
                        <BrMonetaryValue value={prod.value}/>
                      </TableCell>
                      <TableCell align='right'>
                        <BrMonetaryValue value={prod.total}/>
                      </TableCell>
                      <TableCell align='right'>
                        <Cancel
                          color='error'
                          style={{cursor: 'pointer'}}
                          onClick={() => {
                            setProductsNote(
                              states => states.filter(
                                state => state.item !== prod.item
                              )
                            )
                          }}
                        />
                      </TableCell>
                    </TableRow>
                  ))
                }
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
        <Box
          border='1px solid #CCC'
          padding={1}
          display='flex'
          alignItems='center'
        >
          Total: &nbsp;
          <Input
            style={{margin: 0}}
            disable={true}
            value={Intl.NumberFormat('pt-br',{style: 'currency', currency: 'BRL'}).format(valueTotalFull)}
          />&nbsp;&nbsp;&nbsp;
          Total Qte:&nbsp;
          <Input
            style={{margin: 0}}
            disable={true}
            value={quantifyFull}
          />&nbsp;&nbsp;&nbsp;
          Itens:&nbsp;
          <Input
            style={{margin: 0}}
            disable={true}
            value={quantifyFull}
          />
        </Box>
        <Box
          border='1px solid #CCC'
          padding={1}
        >
          <ButtonSuccess>Gravar</ButtonSuccess>
          <ButtonCancel>Cancelar</ButtonCancel>
        </Box>
      </Box>

      {/* <Search
        title='Consulta de Func./Compradores'
        setOpen={setOpenSearchEmployees}
        open={openSearchEmployees}
        fieldsSearch={[
          {value: 'name', description: 'Pelo Nome'},
          {value: 'code', description: 'Pelo Código'},
        ]}
        fieldsModel={['Iniciar com', 'Contem']}
        headerTable={['Código', 'Nome']}
        rows={employees}
      /> */}
    </>
  )
}