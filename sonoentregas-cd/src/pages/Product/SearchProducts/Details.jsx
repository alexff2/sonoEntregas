import React from 'react'
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow
} from '@material-ui/core'
import api from '../../../services/api'

const initialState = {
  serialNumber: [],
  pendingSales: [],
  pendingAssistance: [],
  pendingPurchases: [],
  pendingTransfers: [],
  openForecasts: [],
  openRoutes: [],
  quantity: {
    total: 0,
    qtdSales: 0,
    qtdAssistance: 0,
    qtdPurchases: 0,
    qtdTransfers: 0,
    qtdForecasts: 0,
    qtdRoutes: 0,
    qtdAvailableToCD: 0,
    futureQtdAvailableToCD: 0,
    qtdAvailableToStore: 0,
    futureQtdAvailableToStore: 0,
  }
}

export default function Details({product}) {
  const [details, setDetails] = React.useState(initialState)
  const [loading, setLoading] = React.useState(false)

  React.useEffect(() => {
    const fetchProductDetails = async () => {
      setLoading(true)
      const {data} = await api.get(`product/details/${product?.CODIGO}`)
      setDetails(data.productDetails)
      setLoading(false)
    }

    !!product && fetchProductDetails()
  }, [product])

  if (loading) {
    return <Box p={4}>Loading...</Box>
  }

  return (
    <Box p={4}>
      <Typography variant="h6">Detalhes do produto: {product?.name}</Typography>
      <Box>
        <Typography style={{color: 'green', fontWeight: 'bold'}}>Números de séries/Estoque: {details.quantity.total}</Typography>
        <Box display={'flex'} flexWrap={'wrap'} mb={2}>
          {details.serialNumber.map((sn, index) => (
            <Box key={index} mr={2}>
              <strong>{index + 1}.</strong> {sn}
            </Box>
          ))}
        </Box>
        <Box mb={2}>
          <Typography>Pedidos pendentes: {details.quantity.qtdPurchases}</Typography>
          {details.pendingPurchases.length > 0 && (
            <Table size='small'>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Data</TableCell>
                  <TableCell>Quantidade</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {details.pendingPurchases.map((purchase) => (
                  <TableRow key={purchase.id}>
                    <TableCell>{purchase.id}</TableCell>
                    <TableCell>{purchase.date}</TableCell>
                    <TableCell>{purchase.quantity}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </Box>
        <Table size='small' style={{ marginBottom: '16px' }}>
          <TableHead>
            <TableRow>
              <TableCell>Em Previsão</TableCell>
              <TableCell>Em Transferência</TableCell>
              <TableCell style={{ color: 'green' }}>Disponível CD</TableCell>
              <TableCell>Prev Est</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell>{details.quantity.qtdForecasts}</TableCell>
              <TableCell>{details.quantity.qtdTransfers}</TableCell>
              <TableCell style={{ color: 'green' }}>
                {details.quantity.qtdAvailableToCD}
              </TableCell>
              <TableCell>
                {details.quantity.futureQtdAvailableToCD}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
        <Table size='small' style={{ marginBottom: '16px' }}>
          <TableHead>
            <TableRow>
              <TableCell>DAVs</TableCell>
              <TableCell>Assistências</TableCell>
              <TableCell>Transferências</TableCell>
              <TableCell style={{ color: 'green' }}>Disponível Loja</TableCell>
              <TableCell>Prev Est</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell>{details.quantity.qtdSales}</TableCell>
              <TableCell>{details.quantity.qtdAssistance}</TableCell>
              <TableCell>{details.quantity.qtdTransfers}</TableCell>
              <TableCell style={{ color: 'green' }}>
                {details.quantity.qtdAvailableToStore}
              </TableCell>
              <TableCell>
                {details.quantity.futureQtdAvailableToStore}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
        <Box mb={4}>
          <Typography>Vendas pendentes: {details.quantity.qtdSales}</Typography>
          {details.pendingSales.length > 0 && (
            <Table size='small'>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Data</TableCell>
                  <TableCell>Cliente</TableCell>
                  <TableCell>Quantidade</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {details.pendingSales.map((sale) => (
                  <TableRow key={sale.id}>
                    <TableCell>{sale.id}</TableCell>
                    <TableCell>{sale.date}</TableCell>
                    <TableCell>{sale.customer}</TableCell>
                    <TableCell>{sale.quantity}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </Box>
        <Box mb={4}>
          <Typography>Assistências pendentes: {details.quantity.qtdAssistance}</Typography>
          {details.pendingAssistance.length > 0 && (
            <Table size='small'>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Data</TableCell>
                  <TableCell>Cliente</TableCell>
                  <TableCell>Quantidade</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {details.pendingAssistance.map((assistance) => (
                  <TableRow key={assistance.id}>
                    <TableCell>{assistance.id}</TableCell>
                    <TableCell>{assistance.date}</TableCell>
                    <TableCell>{assistance.customer}</TableCell>
                    <TableCell>{assistance.quantity}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </Box>
        <Box mb={4}>
          <Typography>Previsão: {details.quantity.qtdForecasts}</Typography>
          { details.openForecasts.length > 0 && (
            <Table size='small'>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>DAV</TableCell>
                  <TableCell>Data</TableCell>
                  <TableCell>Quantidade</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {details.openForecasts.map((forecast, i) => (
                  <TableRow key={i}>
                    <TableCell>{forecast.id}</TableCell>
                    <TableCell>{forecast.idSales}</TableCell>
                    <TableCell>{forecast.date}</TableCell>
                    <TableCell>{forecast.quantity}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </Box>
        <Box mb={4}>
          <Typography>Rotas Montando: {details.quantity.qtdRoutes}</Typography>
          {details.openRoutes.length > 0 && (
            <Table size='small'>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Data</TableCell>
                  <TableCell>Rota</TableCell>
                  <TableCell>DAV</TableCell>
                  <TableCell>Quantidade</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {details.openRoutes.map((route) => (
                  <TableRow key={route.id}>
                    <TableCell>{route.id}</TableCell>
                    <TableCell>{route.date}</TableCell>
                    <TableCell>{route.route}</TableCell>
                    <TableCell>{route.idSale}</TableCell>
                    <TableCell>{route.quantity}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </Box>
        <Box mb={2}>
          <Typography>Transferências Montando: {details.quantity.qtdTransfers}</Typography>
          {details.pendingTransfers.length > 0 && (
            <Table size='small'>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Data</TableCell>
                  <TableCell>Para</TableCell>
                  <TableCell>Quantidade</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {details.pendingTransfers.map((transfer) => (
                  <TableRow key={transfer.id}>
                    <TableCell>{transfer.id}</TableCell>
                    <TableCell>{transfer.date}</TableCell>
                    <TableCell>{transfer.to}</TableCell>
                    <TableCell>{transfer.quantity}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </Box>
      </Box>
    </Box>
  )
}
