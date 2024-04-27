import React, { useState, useEffect } from 'react'
import { Box, FormControl, IconButton, InputLabel, MenuItem, Paper, Select, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Tooltip, makeStyles } from '@material-ui/core'
import { Delete } from '@material-ui/icons'

import { ButtonCancel, ButtonSuccess } from '../../../components/Buttons'
import { CellStatus } from '.'

import { useAlertSnackbar } from '../../../context/alertSnackbarContext'
import { getDateSql } from '../../../functions/getDates'

import api from '../../../services/api'

const useStyles = makeStyles(theme => ({
  boxField: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: 8,
  },
  boxTablesProducts: {
    height: 400,
    position: 'relative',
    marginBottom: 20
  },
  tableSearch: {
    position: 'absolute',
    zIndex: 3,
    height: 400,
    background: '#FFF',
  },
  tableProduct: {
    height: 400,
  },
}))

export default function CreateUpdate({ transferUpdate, setTransfers, setOpen }) {
  const [ typeSearch, setTypeSearch] = useState('code')
  const [ search, setSearch] = useState('')
  const [ shopsSce, setShopSce] = useState([])
  const [ productsSearch, setProductsSearch] = useState([])

  const [ issue, setIssue] = useState(transferUpdate ? transferUpdate.issueIso : getDateSql())
  const [ reason, setReason] = useState(transferUpdate ? transferUpdate.reason : '')
  const [ observation, setObservation] = useState(transferUpdate ? transferUpdate.observation : '')
  const [ originId, setOriginId] = useState(0)
  const [ destinyId, setDestinyId] = useState(0)
  const [ products, setProducts] = useState(transferUpdate ? transferUpdate.products : [])
  const [ quantity, setQuantity] = useState(1)
  const classes = useStyles()
  const { setAlertSnackbar } = useAlertSnackbar()

  const handleSelectProduct = product => {
    if (quantity <= 0) {
      setAlertSnackbar('🚫 Quantidade não pode ser zero!')
      return
    }

    if (product.stock < quantity) {
      setAlertSnackbar('🚫 Quantidade maior que estoque!')
      return
    }

    if(products.find(productFind => product.code === productFind.code)){
      setAlertSnackbar('🚫 Produto já lançado nessa transferência!')
      return
    }

    setProducts(state => {
      return [
        ...state,
        {
          item: state.length + 1,
          quantity,
          status: 'P',
          ...product
        },
      ]
    })
    setProductsSearch([])
    setQuantity(1)
    setSearch('')
  }

  const handleSendTransfer = async e => {
    e.preventDefault()

    try {
      const originShop = shopsSce.filter(shop => shop.code === originId).map(shop => shop.name)
      const destinyShop = shopsSce.filter(shop => shop.code === destinyId).map(shop => shop.name)
  
      const dataCreate = {
        issue,
        reason,
        observation,
        originId,
        origin: originShop,
        destinyId,
        destiny: destinyShop,
        products,
      }

      const { data } = await api.post('transfer', dataCreate)
  
      setTransfers(state => [...state, data])
      setOpen(false)
    } catch (error) {
      console.log(error)

      setAlertSnackbar('Error no servidor!')
    }
  }

  const handleUpdateTransfer = e => {
    e.preventDefault()

    const originShop = shopsSce.filter(shop => shop.code === originId).map(shop => shop.name)
    const destinyShop = shopsSce.filter(shop => shop.code === destinyId).map(shop => shop.name)

    const data = {
      status: transferUpdate.status,
      code: transferUpdate.code,
      issue,
      issueIso: issue,
      reason,
      observation,
      originId,
      origin: originShop,
      destinyId,
      destiny: destinyShop,
      user: transferUpdate.user,
      products,
    }

    setTransfers(state => state.map(transf => transf.code === data.code ? data : transf))
    setOpen(false)
  }

  const handleDeleteProduct = code => {
    setProducts(state => state.filter(product => product.code !== code))
  }

  useEffect(() => {
    if (search.length > 3) {
      api.get('transfer/search/product', {
        params: {
          type: typeSearch,
          search
        }
      }).then(({ data }) => setProductsSearch(data))
    } else {
      setProductsSearch([])
    }
  }, [search, typeSearch])

  useEffect(() => {
    api.get('/shops/sce')
      .then(({ data }) => {
        setShopSce(data)
    
        transferUpdate ? setOriginId(transferUpdate.originId) : setOriginId(1)
        transferUpdate ? setDestinyId(transferUpdate.destinyId) : setDestinyId(2)
      })
  }, [transferUpdate])

  return (
    <form onSubmit={!transferUpdate ? handleSendTransfer : handleUpdateTransfer}>
      <Box mb={2} className={classes.boxField}>
        <TextField
          id="code"
          label="Código"
          variant='outlined'
          placeholder=''
          value={transferUpdate ? transferUpdate.code : ''}
          InputLabelProps={{
            shrink: true,
          }}
          required
          disabled
          style={{ width: 90 }}
          margin='dense'
        />
        <TextField
          id="issue"
          label="Emissão"
          variant='outlined'
          type='date'
          value={issue}
          onChange={e => setIssue(e.target.value)}
          InputLabelProps={{
            shrink: true,
          }}
          required
          margin='dense'
        />
        <TextField
          id="reason"
          label="Motivo"
          variant='outlined'
          placeholder='Motivo'
          value={reason}
          onChange={e => setReason(e.target.value)}
          InputLabelProps={{
            shrink: true,
          }}
          required
          margin='dense'
        />
        <TextField
          id="observation"
          label="Observação"
          variant='outlined'
          placeholder='Observação'
          value={observation}
          onChange={e => setObservation(e.target.value)}
          InputLabelProps={{
            shrink: true,
          }}
          required
          margin='dense'
        />
      </Box>

      <Box mb={2} className={classes.boxField}>
        <FormControl style={{ width: '50%' }} variant="outlined">
          <InputLabel id="originLabel">Origem</InputLabel>
          <Select
            labelId="originLabel"
            label="Origem"
            id="origin"
            value={originId}
            onChange={e => setOriginId(Number(e.target.value))}
            margin='dense'
          >
            <MenuItem value={0}>
              <em>None</em>
            </MenuItem>
            {shopsSce.length > 0 &&
              shopsSce.map(shop => (
                <MenuItem key={shop.code} value={shop.code}>{shop.code} - {shop.name}</MenuItem>    
              ))
            }
          </Select>
        </FormControl>

        <FormControl style={{ width: '50%' }} variant="outlined">
          <InputLabel id="destinyLabel">Destino</InputLabel>
          <Select
            labelId="destinyLabel"
            label="Destino"
            id="destiny"
            value={destinyId}
            onChange={e => setDestinyId(Number(e.target.value))}
            defaultValue={0}
            margin='dense'
          >
            <MenuItem value={0}>
              <em>None</em>
            </MenuItem>
            {shopsSce.length > 0 &&
              shopsSce.map(shop => (
                <MenuItem key={shop.code} value={shop.code}>{shop.code} - {shop.name}</MenuItem>    
              ))
            }
          </Select>
        </FormControl>
      </Box>

      <Box mb={2} className={classes.boxField}>
        <FormControl style={{ width: '15%' }} variant="outlined" margin='dense'>
          <InputLabel id="optionLabel">Opção</InputLabel>
          <Select
            labelId="optionLabel"
            label="Opção"
            id="option"
            value={typeSearch}
            onChange={e => {
              setSearch('')
              setTypeSearch(e.target.value)
            }}
            margin='dense'
          >
            <MenuItem value={'code'}>Código</MenuItem>
            <MenuItem value={'name'}>Descrição</MenuItem>
          </Select>
        </FormControl>

        <TextField
          id="search"
          label="Pesquisa"
          variant='outlined'
          value={search}
          onChange={e => setSearch(e.target.value)}
          InputLabelProps={{
            shrink: true,
          }}
          style={{ width: '65%' }}
          margin='dense'
        />
        <TextField
          id="quantify"
          label="Quantidade"
          variant='outlined'
          type='number'
          value={quantity}
          onChange={e => {
            if (e.target.value <= 0) {
              return
            }
            setQuantity(Number(e.target.value))
          }}
          InputLabelProps={{
            shrink: true,
          }}
          required
          style={{ width: '20%' }}
          margin='dense'
        />
      </Box>

      <Box className={classes.boxTablesProducts}>
        { productsSearch.length > 0 &&
          <TableContainer className={classes.tableSearch}>
            <Table stickyHeader size='small'>
              <TableHead>
                <TableRow>
                  <TableCell>Código</TableCell>
                  <TableCell>Descrição</TableCell>
                  <TableCell>Estoque</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {productsSearch.map((product, i) => (
                  <TableRow hover key={i} onClick={() => handleSelectProduct(product)}>
                    <TableCell>{product.generalCode}</TableCell>
                    <TableCell>{product.name}</TableCell>
                    <TableCell>{product.stock}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        }

        <TableContainer component={Paper} className={classes.tableProduct}>
          <Table stickyHeader size='small'>
            <TableHead>
              <TableRow>
                <TableCell>Item</TableCell>
                <TableCell>Quantidade</TableCell>
                <TableCell>Descrição</TableCell>
                <TableCell>Código</TableCell>
                <TableCell>status</TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {products.map((product, i) => (
                <TableRow key={i}>
                  <TableCell>{product.item}</TableCell>
                  <TableCell>{product.quantity}</TableCell>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>{product.generalCode}</TableCell>
                  <CellStatus>{transferUpdate ? product.status : 'P'}</CellStatus>
                  <TableCell>
                    { (!transferUpdate || product.status === 'P') &&
                      <Tooltip title='Excluir produto'>
                        <IconButton onClick={() => handleDeleteProduct(product.code)}>
                          <Delete />
                        </IconButton>
                      </Tooltip>
                    }
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      <Box>
        <ButtonSuccess type='submit'>{transferUpdate ? 'Atualizar' : 'Gravar'}</ButtonSuccess>
        <ButtonCancel
          onClick={() => setOpen(false)}
        >Cancelar</ButtonCancel>
      </Box>
    </form>
  )
}