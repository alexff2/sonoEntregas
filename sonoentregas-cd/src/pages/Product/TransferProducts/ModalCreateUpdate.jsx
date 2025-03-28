import React, { useState, useEffect } from 'react'
import { Box, FormControl, IconButton, InputLabel, MenuItem, Paper, Select, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Tooltip, makeStyles } from '@material-ui/core'
import { Delete } from '@material-ui/icons'

import { ButtonCancel, ButtonSuccess } from '../../../components/Buttons'
import { CellStatus } from '.'

import { useAlertSnackbar } from '../../../context/alertSnackbarContext'
import { getDateSql } from '../../../functions/getDates'
import { debounce } from '../../../functions/debounce'

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
  const [ typeSearch, setTypeSearch] = useState('name')
  const [ search, setSearch] = useState('')
  const [ shopsSce, setShopSce] = useState([])
  const [ productsSearch, setProductsSearch] = useState([])
  const [ indexSelect, setIndexSelect] = useState(0)

  const [ issue, setIssue] = useState(transferUpdate ? transferUpdate.issueIso : getDateSql())
  const [ reason, setReason] = useState(transferUpdate ? transferUpdate.reason : '')
  const [ observation, setObservation] = useState(transferUpdate ? transferUpdate.observation : '')
  const [ originId, setOriginId] = useState(0)
  const [ destinyId, setDestinyId] = useState(0)
  const [ disableDestinyId, setDisableDestinyId] = useState(false)

  const [ products, setProducts] = useState(transferUpdate ? transferUpdate.products : [])
  const [ quantity, setQuantity] = useState('')
  const classes = useStyles()
  const { setAlertSnackbar } = useAlertSnackbar()

  const changeOriginId = e => {
    const value = Number(e.target.value)
    setOriginId(value)
    if (value === 1) {
      setDisableDestinyId(false)
      setDestinyId(2)
    } else {
      setDisableDestinyId(true)
      setDestinyId(1)
    }
  }

  const changeDestinyId = e => {
    const value = Number(e.target.value)
    setDestinyId(value)
    if (value === 1) {
      setOriginId(2)
    } else {
      setOriginId(1)
    }
  }

  const keyPres = (key) => {
    if (key === 'ArrowUp' ) {
      if (indexSelect === 0) {
        return
      }
  
      setIndexSelect(state => state - 1)
    }

    if (key === 'ArrowDown') {
      if (indexSelect === productsSearch.length - 1) {
        return
      }
  
      setIndexSelect(state => state + 1)
    }

    if (key === 'Enter') {
      document.getElementById('quantifyId').focus()
    }
  }

  const setSelectProduct = async () => {
    let product = productsSearch[indexSelect]

    if (quantity <= 0) {
      setAlertSnackbar('🚫 Quantidade não pode ser zero!')
      return
    }

    if (originId === 1 && product.stock < quantity) {
      setAlertSnackbar('🚫 Quantidade maior que estoque!')
      return
    }

    if(products.find(productFind => product.code === productFind.code)){
      setAlertSnackbar('🚫 Produto já lançado nessa transferência!')
      document.getElementById('searchId').focus()
      return
    }

    product = {
      item: products.length + 1,
      quantity,
      status: 'P',
      id: product.code,
      ...product,
    }

    if (transferUpdate) {
      await api.put(`/transfer/${transferUpdate.id}/product/add`, { product })
    }

    setProducts([...products, product])
    setProductsSearch([])
    setQuantity('')
    setSearch('')

    document.getElementById('searchId').focus()
    setIndexSelect(0)
  }

  const handleSendTransfer = async e => {
    e.preventDefault()

    try {
      const originShop = shopsSce.filter(shop => shop.code === originId).map(shop => shop.name)
      const destinyShop = shopsSce.filter(shop => shop.code === destinyId).map(shop => shop.name)
  
      const transferRequest = {
        issue,
        reason,
        observation,
        originId,
        origin: originShop,
        destinyId,
        destiny: destinyShop,
        products,
      }

      const { data } = await api.post('transfer', { transferRequest })
  
      setTransfers(state => [...state, ...data])
      setOpen(false)
    } catch (error) {
      console.log(error)

      setAlertSnackbar('Error no servidor!')
    }
  }

  const handleUpdateTransfer = async e => {
    e.preventDefault()

    const { data } = await api.put(
      `transfer/${transferUpdate.id}`, 
      {
        transferOfProductRequest: {
          issue,
          reason,
          observation,
          products,
        }
      }
    )

    const { transferOfProducts } = data

    setTransfers(state => state.map(transf => transf.id === transferOfProducts.id ? transferOfProducts : transf))
    setOpen(false)
  }

  const handleDeleteProduct = async id => {
    if (transferUpdate) {
      await api.put(`/transfer/${transferUpdate.id}/product/${id}/rmv`)
    }
    setProducts(state => state.filter(product => product.id !== id))
  }

  useEffect(() => {
    debounce(() => {
      api.get('product', {
        params: {
          type: typeSearch,
          search
        }
      }).then(({ data }) => setProductsSearch(data))
    }, 1300)
  }, [search, typeSearch])

  useEffect(() => {
    api.get('/shops/sce')
      .then(({ data }) => {
        setShopSce(data)
    
        if (transferUpdate) {
          setOriginId(transferUpdate.originId)
          setDestinyId(transferUpdate.destinyId)
        } else {
          setOriginId(1)
          setDestinyId(2)
        }
          
      })
  }, [transferUpdate])

  return (
    <form>
      <Box mb={2} className={classes.boxField}>
        <TextField
          id="code"
          label="Código"
          variant='outlined'
          placeholder=''
          value={transferUpdate ? transferUpdate.id : ''}
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
            onChange={changeOriginId}
            disabled={(transferUpdate ? true : false) || products.length > 0}
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
            onChange={changeDestinyId}
            defaultValue={0}
            margin='dense'
            disabled={disableDestinyId || (transferUpdate ? true : false) || products.length > 0}
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
          id="searchId"
          label="Pesquisa"
          variant='outlined'
          value={search}
          onChange={e => setSearch(e.target.value)}
          InputLabelProps={{
            shrink: true,
          }}
          style={{ width: '65%' }}
          margin='dense'
          onKeyDown={e => keyPres(e.key)}
          autoComplete='off'
        />

        <TextField
          id="quantifyId"
          label="Quantidade"
          variant='outlined'
          value={quantity}
          onChange={e => {
            if (e.target.value <= 0) {
              setAlertSnackbar('Valor não pode ser menor que 0')
              return
            }
            setQuantity(Number(e.target.value))
          }}
          InputLabelProps={{
            shrink: true,
          }}
          style={{ width: '20%' }}
          margin='dense'
          onKeyDown={e => e.key === 'Enter' && setSelectProduct()}
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
                  <TableRow
                    hover
                    role='check-box'
                    key={i}
                    onClick={() => {
                      document.getElementById('quantifyId').focus()
                      setIndexSelect(i)
                    }}
                    selected={i===indexSelect}
                  >
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
                        <IconButton onClick={() => handleDeleteProduct(product.id)}>
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
        <ButtonSuccess
          type='button'
          onClick={!transferUpdate ? handleSendTransfer : handleUpdateTransfer}
        >
          {transferUpdate ? 'Atualizar' : 'Gravar'}
        </ButtonSuccess>
        <ButtonCancel
          onClick={() => setOpen(false)}
        >
          Cancelar
        </ButtonCancel>
      </Box>
    </form>
  )
}