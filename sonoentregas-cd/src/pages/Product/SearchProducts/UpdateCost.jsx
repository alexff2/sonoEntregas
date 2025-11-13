import React from 'react'
import {
  Box,
  Typography,
  TextField,
  Button
} from '@material-ui/core'
import api from '../../../services/api'

export default function UpdateCost(props) {
  const [purchasePrice, setPurchasePrice] = React.useState(props.product ? props.product.purchasePrice : '')

  const handleSave = async () => {
    try {
      await api.put(`product/${props.product.code}/purchase-cost`, {
        purchaseCost: parseFloat(purchasePrice)
      })
      props.setProducts(oldProducts => {
        return oldProducts.map(product => {
          if (product.code === props.product.code) {
            return {
              ...product,
              purchasePrice: parseFloat(purchasePrice)
            }
          }
          return product
        })
      })
      props.setProductUpdateCost(null)
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" p={2}>
      <Typography variant="h6">
        {props.product && props.product.NOME}
      </Typography>

      <Typography variant="body1">
        Aqui você poderá atualizar o custo de compra do produto.
      </Typography>

      <TextField
        label="Custo de Compra"
        type="number"
        margin="normal"
        value={purchasePrice}
        onChange={e => setPurchasePrice(e.target.value)}
      />

      <Button
        variant="contained"
        color="primary"
        onClick={handleSave}
      >
        Salvar
      </Button>
    </Box>
  )
}
