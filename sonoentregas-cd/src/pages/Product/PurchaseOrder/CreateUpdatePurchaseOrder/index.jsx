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
import { Search } from '../../../../components/Search'

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
  style,
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
        backgroundColor: disable ? 'transparent' : 'white',
        ...style
      }}
      {...props}
    />
  )
}

const purchaseOrderStates = {
  id: 0,
  issue: '2010-01-01',
  type: 'normal',
  type1: 'normal',
  factoryData: '',
  employeeId: '',
  employeeName: '',
  obs: ''
}

export default function CreateUpdatePurchaseOrder({
  setOpen,
  setPurchaseOrders
}){
  const [openSearchEmployees, setOpenSearchEmployees] = useState(false)
  const [typeSearch, setTypeSearch] = useState('name')
  const [search, setSearch] = useState('')
  const [searchProduct, setSearchProduct] = useState([])
  const [indexProductSearchSelected, setIndexProductSearchSelected] = useState(0)
  const [quantityInput, setQuantityInput] = useState('')
  const [productsPurchaseOrder, setProductsPurchaseOrder] = useState([])
  const [purchaseOrder, setPurChaseOrder] = useState(purchaseOrderStates)
  const { setAlertSnackbar } = useAlertSnackbar()
  const { setOpenBackDrop } = useBackdrop()
  const classes = useStyles()

  useEffect(() => {
    async function createOpenPurchaseOrder(){
      setOpenBackDrop(true)

      const { data } = await api.post('purchase/order')

      setPurChaseOrder({
        id: data.purchaseOrder.id,
        issue: data.purchaseOrder.issueToInput,
        type: data.purchaseOrder.type,
        type1: data.purchaseOrder.type1,
        factoryData: data.purchaseOrder.factoryData,
        obs: data.purchaseOrder.obs,
        employeeId: data.purchaseOrder.employeeId,
        employeeName: data.purchaseOrder.employeeName,
      })

      setProductsPurchaseOrder(data.purchaseOrder.products)

      setOpenBackDrop(false)
    }

    createOpenPurchaseOrder()
  }, [setOpenBackDrop])

  useEffect(() => {
    debounce(async () => {
      if (search !== '') {
        const {data} = await api.get('product', {
          params: {
            search,
            type: typeSearch
          }
        })
  
        setSearchProduct(data)
      }
    }, 1300)
  }, [search, typeSearch])

  const handleChange = async e => {
    try {
      setPurChaseOrder(state => ({...state, [e.target.id]: e.target.value}))

      debounce(async () => {
        setOpenBackDrop(true)
        await api.put(`purchase/order/${purchaseOrder.id}`, {
          fieldToUpdate: e.target.id,
          value: e.target.value
        })

        setOpenBackDrop(false)
      }, 1300)
    } catch (error) {
      console.log(error)
      setAlertSnackbar('Erro interno!')
    }
  }

  const handleSetEmployee = async employee => {
    setPurChaseOrder(state => ({
      ...state,
      employeeId: employee.id,
      employeeName: employee.name
    }))
    await api.put(`purchase/order/${purchaseOrder.id}`, {
      fieldToUpdate: 'employeeId',
      value: employee.id
    })
  }

  const handleSelectSearchProductByKey = (key) => {
    if (key === 'ArrowUp' ) {
      if (indexProductSearchSelected === 0) {
        return
      }
  
      setIndexProductSearchSelected(state => state - 1)
    }

    if (key === 'ArrowDown') {
      if (indexProductSearchSelected === searchProduct.length - 1) {
        return
      }
  
      setIndexProductSearchSelected(state => state + 1)
    }

    if (key === 'Enter' && searchProduct.length > 0) {
      document.getElementById('quantityId').focus()
    }
  }

  const handleSelectSearchProduct = index => {
    setIndexProductSearchSelected(index)
    document.getElementById('quantityId').focus()
  }

  const handleChangeQuantityInput = e => {
    if (e.target.value === '') setQuantityInput(e.target.value)
    else if (!isNaN(parseInt(e.target.value))) setQuantityInput(Number(e.target.value))
    else setAlertSnackbar('Digite apenas números')
  }

  const handleAddProduct = async () => {
    try {
      if (quantityInput < 1) {
        setAlertSnackbar('Valor não pode ser menor ou igual a 0!')
  
        setQuantityInput(1)
        return
      }
  
      const searchProductSelect = searchProduct[indexProductSearchSelected]
  
      const {data} = await api.post(`purchase/order/${purchaseOrder.id}/product`, {
        productId: searchProductSelect.code,
        productName: searchProductSelect.name,
        quantity: quantityInput,
        value: searchProductSelect.purchasePrice
      })
  
      setProductsPurchaseOrder([
        ...productsPurchaseOrder,
        {
          item: data.itemId,
          ...searchProductSelect,
          originalCode: searchProductSelect.generalCode,
          value: purchaseOrder.type1 === 'normal' ? searchProductSelect.purchasePrice : 0,
          total: purchaseOrder.type1 === 'normal' ? searchProductSelect.purchasePrice * quantityInput : 0,
          quantity: quantityInput 
        }
      ])
  
      setSearchProduct([])
      setSearch('')
      setQuantityInput('')
      document.getElementById('searchId').focus()
    } catch (error) {
      console.log(error)

      if (error.response.data === 'Product already added') {
        setAlertSnackbar('Produto já adicionado ao pedido de compra!')

        return
      }

      setAlertSnackbar('Erro interno!')
    }
  }

  const handleRmvProduct = async prod => {
    await api.delete(`purchase/order/${purchaseOrder.id}/product/${prod.item}`)

    setProductsPurchaseOrder(
      states => states.filter(
        state => state.item !== prod.item
      )
    )
  }

  const handleChangeQuantity = async prod => {
    await api.put(`purchase/order/${purchaseOrder.id}/product/${prod.item}`,{
      quantity: prod.quantity
    })

    setProductsPurchaseOrder(
      states => (states.map(state => {
        if (state.item === prod.item) {
          state.quantity = prod.quantity
          state.total = prod.quantity * state.value
        }

        return state
      }))
    )
  }

  const handleClosePurchaseOrder = async () => {
    try {
      setOpenBackDrop(true)
      if (!purchaseOrder.employeeId) {
        setAlertSnackbar('Selecione o comprador!')
        setOpenBackDrop(false)
        return
      }

      if (productsPurchaseOrder.length === 0) {
        setAlertSnackbar('Selecione pelo menos 1 produto!')
        setOpenBackDrop(false)
        return
      }

      await api.patch(`purchase/order/${purchaseOrder.id}/close`)

      await handleClose()
      setOpenBackDrop(false)
    } catch (error) {
      console.log(error)
    }
  }

  const handleClose = async () => {
    try {
      setOpenBackDrop(true)
      const {data} = await api.get('purchase/order/open')
      setPurchaseOrders(data.purchaseOrder)
      setOpen(false)
      setOpenBackDrop(false)
    } catch (error) {
      setOpenBackDrop(false)
      console.log(error)
      setAlertSnackbar('Erro no servidor')
    }
  }

  let quantityFull = 0, valueTotalFull = 0

  productsPurchaseOrder.forEach(prod => {
    quantityFull += prod.quantity
    valueTotalFull += prod.total
  })

  return (
    <>
      <AppBar className={classes.appBar}>
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
            <CloseIcon />
          </IconButton>
          <Typography variant="h6" className={classes.title}>
            Lançamento de Nota de Pedido de compra
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
            id="purchaseId"
            label="Código"
            disable={true}
            value={purchaseOrder.id}
          />
          <Input
            id="issue"
            label="Emissão"
            type='date'
            value={purchaseOrder.issue}
            onChange={handleChange}
          />
          <Box
            display='flex'
            alignItems='center'
          >
            <Input
              id='employeeId'
              label='Comprador'
              disable={true}
              width={210}
              value={purchaseOrder.employeeName}
              style={{
                marginRight: 4,
                backgroundColor: 'transparent'
              }}
            />
            <SearchIcon
              onClick={() => setOpenSearchEmployees(true)}
              style={{
                cursor: 'pointer'
              }}
            />
          </Box>
          <Input
            id='factoryData'
            label='Dados da Fabrica'
            width={210}
            value={purchaseOrder.factoryData}
            onChange={handleChange}
          />
          <FormControl component='fieldset'>
            <RadioGroup
              aria-label='type'
              name='type1'
              value={purchaseOrder.type}
              onChange={handleChange}
            >
              <FormControlLabel
                value='normal'
                control={<Radio id='type' style={{padding: 2}}/>}
                label='Normal'
              />
              <FormControlLabel
                value='maintenance'
                control={<Radio id='type' style={{padding: 2}}/>}
                label='Assistência'
              />
            </RadioGroup>
          </FormControl>
          <FormControl component='fieldset'>
            <RadioGroup
              aria-label='type'
              name='type12'
              value={purchaseOrder.type1}
              onChange={handleChange}
            >
              <FormControlLabel
                value='normal'
                control={<Radio id='type1' style={{padding: 2}}/>}
                label='Normal'
              />
              <FormControlLabel
                value='bonus'
                control={<Radio id='type1' style={{padding: 2}}/>}
                label='Bonificado'
              />
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
            gridGap={8}
          >
            <Select
              variant='outlined'
              value={typeSearch}
              onChange={e => setTypeSearch(e.target.value)}
              style={{
                width: '15%',
                minWidth: '126px',
                height: 40,
                background: '#FFF',
                margin: '8px 0 4px 0'
              }}
            >
              <MenuItem value='name'>Pelo Nome</MenuItem>
              <MenuItem value='code'>Pelo Código</MenuItem>
            </Select>
            <Input
              id='searchId'
              style={{flex: 1}}
              placeholder='Digite aqui...'
              value={search}
              onChange={e => setSearch(e.target.value)}
              onKeyDown={e => handleSelectSearchProductByKey(e.key)}
            />
            <Input
              id={'quantityId'}
              placeholder='Qtd'
              width='10%'
              value={quantityInput}
              onChange={handleChangeQuantityInput}
              onKeyDown={e => e.key === 'Enter' && handleAddProduct()}
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
                    <TableCell align='right'>Estoque</TableCell>
                    <TableCell align='right'>Custo</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {
                    searchProduct.map((prod, index) => (
                      <TableRow
                        hover
                        key={prod.code}
                        onClick={() => handleSelectSearchProduct(index)}
                        selected={index === indexProductSearchSelected}
                      >
                        <TableCell>{prod.code}</TableCell>
                        <TableCell>{prod.generalCode}</TableCell>
                        <TableCell>{prod.name}</TableCell>
                        <TableCell align='right'>{prod.stock}</TableCell>
                        <TableCell align='right'>
                          <BrMonetaryValue value={prod.purchasePrice}/>
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
                  productsPurchaseOrder.map((prod, index) => (
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
                          value={prod.quantity}
                          onChange={e => handleChangeQuantity({
                            item: prod.item,
                            quantity: Number(e.target.value)
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
                          onClick={() => handleRmvProduct(prod)}
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
          Total Vlr: &nbsp;
          <Input
            style={{margin: 0}}
            disable={true}
            value={Intl.NumberFormat('pt-br',{style: 'currency', currency: 'BRL'}).format(valueTotalFull)}
          />&nbsp;&nbsp;&nbsp;
          Total Qte:&nbsp;
          <Input
            style={{margin: 0}}
            disable={true}
            value={quantityFull}
          />&nbsp;&nbsp;&nbsp;
          Itens:&nbsp;
          <Input
            style={{margin: 0}}
            disable={true}
            value={productsPurchaseOrder.length}
          />&nbsp;&nbsp;&nbsp;
          Observações: &nbsp;
          <Input
            id='obs'
            style={{margin: 0, flex: 1}}
            value={purchaseOrder.obs}
            onChange={handleChange}
          />
        </Box>

        <Box
          border='1px solid #CCC'
          padding={1}
        >
          <ButtonSuccess
            onClick={handleClosePurchaseOrder}
          >Gravar</ButtonSuccess>
          <ButtonCancel
            onClick={handleClose}
          >Cancelar</ButtonCancel>
        </Box>
      </Box>

      <Search
        title='Consulta de Func./Compradores'
        route='employee'
        setOpen={setOpenSearchEmployees}
        open={openSearchEmployees}
        fieldsSearch={[
          {value: 'name', description: 'Pelo Nome'},
          {value: 'code', description: 'Pelo Código'},
        ]}
        headerTable={['Código', 'Nome']}
        handleSelect={handleSetEmployee}
      />
    </>
  )
}