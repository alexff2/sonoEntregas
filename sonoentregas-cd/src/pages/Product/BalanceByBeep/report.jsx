import React from 'react'
import {
  Box,
  makeStyles,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@material-ui/core'

const useStyles = makeStyles(() => ({
  root: {
    padding: '30px 20px',
    width: '100%',
    height: '100%',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    '& > div': {
      flex: 1,
    },
    border: '1px solid #000',
    borderRadius: 5,
    padding: 10,
  },
  h1: {
    fontSize: 30,
    fontWeight: 600,
    marginBottom: 20,
  },
  h2: {
    fontSize: 18,
    fontWeight: 600,
    marginBottom: 10,
    marginTop: 10,
  },
  boxProducts:{
    border: '1px solid #000',
    borderRadius: 5,
    padding: 10,
    marginTop: 20,
  }
}))

const Report = ({data}) => {
  console.log('data', data)
  const classes = useStyles()

  return (
    <Box className={classes.root}>
      <Typography
        variant='h1'
        className={classes.h1}
      >Balanço Nº: {data.balance?.id}</Typography>

      <Box className={classes.header}>
        <Box>
          <Typography><strong>Data do Balanço</strong>: {data.balance?.dtBalance}</Typography>
          <Typography><strong>Data de Finalização</strong>: {data.balance?.dtFinish}</Typography>
          <Typography><strong>Descrição</strong>: {data.balance?.description}</Typography>
        </Box>
        <Box>
          <Typography><strong>Qtd Produtos</strong>: {data.quantityActiveProducts}</Typography>
          <Typography><strong>Qtd Produtos Div</strong>: {data.uniqueProductsWithDivergence}</Typography>
          <Typography><strong>Percentual de Div.</strong>: {data.divergencePercentage}%</Typography>
        </Box>
      </Box>

      {data.productsExcess.length > 0 && (
        <Box className={classes.boxProducts}>
          <Typography
            variant='h2'
            className={classes.h2}
          >Produtos Sobrando: {data.uniqueProductsExcess} / {data.productsExcess.length}</Typography>
          <Table size='small'>
            <TableHead>
              <TableRow>
                <TableCell>Produto</TableCell>
                <TableCell>Número de Série</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.productsExcess.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>{item.product}</TableCell>
                  <TableCell>{item.serialNumber}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      )}

      {data.productsLack.length > 0 && (
        <Box className={classes.boxProducts}>
          <Typography
            variant='h2'
            className={classes.h2}
          >Produtos Faltando: {data.uniqueProductsLack} / {data.productsLack.length}</Typography>
          <Table size='small'>
            <TableHead>
              <TableRow>
                <TableCell>Produto</TableCell>
                <TableCell>Número de Série</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.productsLack.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>{item.product}</TableCell>
                  <TableCell>{item.serialNumber}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      )}

    </Box>
  )
}

export default Report