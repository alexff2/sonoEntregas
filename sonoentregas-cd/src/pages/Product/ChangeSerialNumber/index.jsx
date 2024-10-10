import React from 'react'
import { 
  Box,
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Checkbox
 } from '@material-ui/core'
import { Edit } from '@material-ui/icons'

import Modal from '../../../components/Modal'
import { useAlert } from '../../../context/alertContext'
import api from '../../../services/api'

export default function ChangeSerialNumber() {
  const [serialNumber, setSerialNumber] = React.useState('')
  const [openModalChangeProduct, setOpenModalChangeProduct] = React.useState(false)
  const [product, setProduct] = React.useState()
  const [typeSearchNewProduct, setTypeSearchNewProduct] = React.useState('NOME')
  const [searchNewProduct, setSearchNewProduct] = React.useState('')
  const [newProducts, setNewProducts] = React.useState()
  const { setAlert } = useAlert()

  const handleSearch = async () => {
    try {
      const { data } = await api.get('/serial/product/open', {
        params: { serialNumber }
      })

      setProduct(data.product)
    } catch (error) {
      console.log(error)
      setAlert('Erro ao buscar produto')
    }
  }

  const handleSearchNewProduct = async () => {
    try {
      if (searchNewProduct !== '') {
        const { data } = await api.get('products', {
          params: {
            search: searchNewProduct,
            typeSearch: typeSearchNewProduct
          }
        })
        setNewProducts(data)
      } else {
        setNewProducts([])
      }
    } catch (e) {
      setAlert('Erro ao buscar produto')
      setNewProducts([])
    }
  }

  const handleChangeSerialNumber = async productSelected => {
    try {
      await api.put('/serial/change/product', {
        serialNumber,
        newProductId: productSelected.CODIGO
      })

      setProduct({
        id: productSelected.CODIGO,
        name: productSelected.NOME
      })

      setAlert('Número de série alterado com sucesso', 'success')
      setOpenModalChangeProduct(false)
      setNewProducts([])
    } catch (error) {
      console.log(error)
      setAlert('Erro ao alterar número de série')
    }
  }

  return (
    <Box>
      <Typography
        variant='h1'
        style={{ fontSize: '1.5rem', fontWeight: 'bold', textAlign: 'center' }}
      >
        Alterar Número de Serie
      </Typography>

      <Divider style={{margin: '20px 0'}}/>

      <Box>
        <TextField
          label='Número de Serie'
          variant='outlined'
          fullWidth
          value={serialNumber}
          onChange={e => setSerialNumber(e.target.value)}
          onKeyPress={e => e.key === 'Enter' && handleSearch()}
        />

        <Box mt={2}>
          <Typography
            style={{
              display: 'flex',
              justifyContent: 'start',
              alignItems: 'center',
              gap: 20
            }}
          >
            Produto: <strong>{product?.name}</strong> 
            { 
              product && <Edit style={{cursor: 'pointer', fontSize: 18}} onClick={() => setOpenModalChangeProduct(true)}/>
            }
          </Typography>
        </Box>
      </Box>

      <Modal
        open={openModalChangeProduct}
        setOpen={setOpenModalChangeProduct}
        title={'Alterar Produto'}
      >
        <Box
          display={'flex'}
          gridGap={20}
        >
          <FormControl variant='outlined' style={{width: 200}}>
            <InputLabel id='fieldTypeSearchNewProduct'>Tipo</InputLabel>
            <Select
              label='Tipo'
              labelId='fieldTypeSearchNewProduct'
              value={typeSearchNewProduct}
              onChange={e => setTypeSearchNewProduct(e.target.value)}
            >
              <MenuItem value={'NOME'}>Descrição</MenuItem>
              <MenuItem value={'COD_ORIGINAL'}>Código</MenuItem>
            </Select>
          </FormControl>

          <TextField
            label='Buscar Produto'
            variant='outlined'
            fullWidth
            value={searchNewProduct}
            onChange={e => setSearchNewProduct(e.target.value)}
            onKeyPress={e => e.key === 'Enter' && handleSearchNewProduct()}
          />
        </Box>

        <Box mt={2}>
          <TableContainer>
            <Table size='small'>
              <TableHead>
                <TableRow>
                  <TableCell>Código</TableCell>
                  <TableCell>Descrição</TableCell>
                  <TableCell>Selecionar</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {
                  newProducts?.map((newProduct, index) => (
                    <TableRow key={index}>
                      <TableCell>{newProduct.COD_ORIGINAL}</TableCell>
                      <TableCell>{newProduct.NOME}</TableCell>
                      <TableCell>
                        <Checkbox
                          style={{cursor: 'pointer'}}
                          onClick={() => handleChangeSerialNumber(newProduct)}
                        />
                      </TableCell>
                    </TableRow>
                  ))
                }
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Modal>
    </Box>
  )
}