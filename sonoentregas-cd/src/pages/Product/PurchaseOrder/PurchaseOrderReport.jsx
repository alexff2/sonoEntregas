import React, { useEffect, useState } from 'react';
import { 
  makeStyles,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  Divider,
  Grid,
  Box,
  TableFooter
} from '@material-ui/core';
import api from '../../../services/api';
import splitReportTable from '../../../functions/splitReportTable';

const useStyles = makeStyles((theme) => ({
  root: {
    fontFamily: 'Arial, sans-serif',
    position: 'relative',
    height: '100%',
  },
  companyInfo: {
    marginBottom: theme.spacing(1),
  },
  infoBlock: {
    marginTop: theme.spacing(0),
    marginBottom: theme.spacing(0),
  },
  table: {
    marginBottom: theme.spacing(2),
  },
  rowHeader: {
    backgroundColor: '#f0f0f0',
  },
  cell: {
    fontSize: '12px',
    padding: '4px 8px',
  },
  totalRow: {
    fontWeight: 'bold',
  },
  smallText: {
    fontSize: '12px',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
  }
}));

const PurchaseOrderReport = ({ purchaseOrder }) => {
  const [purchaseOrderProducts, setPurchaseOrderProducts] = useState([])
  const classes = useStyles();

  useEffect(() => {
    const findProducts = async () => {
      const { data } =  await api.get(`purchase/order/${purchaseOrder.id}/products`)

      setPurchaseOrderProducts(data.productsPurchaseOrder)
    }

    findProducts()
  }, [purchaseOrder])

  const quantityTotal = purchaseOrderProducts.reduce((prev, currentValue) => prev + currentValue.quantity, 0)
  const unitTotal = purchaseOrderProducts.reduce((prev, currentValue) => prev + currentValue.value, 0)
  const valueTotal = purchaseOrderProducts.reduce((prev, currentValue) => prev + currentValue.total, 0)

  const paginatedProducts = splitReportTable(purchaseOrderProducts, 32, 34)

  const currentDateTime = new Date().toLocaleString('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short',
  })

  return (
    <> 
      {paginatedProducts.map((products, index) => (
        <div key={index} className="report">
          <div className={classes.root}>
            {/* Company Header */}
            <div>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Typography variant="h6">{purchaseOrder.companyName}</Typography>
                <Typography className={classes.smallText}>
                  Pagina {index+1} de {paginatedProducts.length}
                </Typography>
              </Box>
              <div className={classes.companyInfo}>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Typography className={classes.smallText}>
                    CNPJ: {purchaseOrder.companyCnpj} &nbsp; IE: {purchaseOrder.companyIe}
                  </Typography>
                  <Typography className={classes.smallText}>
                    {currentDateTime}
                  </Typography>
                </Box>
                <Typography className={classes.smallText}>
                  AV 4, QD D, LOTE 3, SN DIST. INDUST, SAO LUIS - MA
                </Typography>
              </div>
            </div>

            <Divider />

            {/* Supplier Info */}
            <Grid container spacing={2} className={classes.infoBlock}>
              <Grid item xs={6}>
                <Typography className={classes.smallText}>Fornecedor: MARANHAO COLCHOES LTDA</Typography>
                <Typography className={classes.smallText}>
                  Pedido Nº: <strong>{purchaseOrder.id}</strong>
                </Typography>
                <Typography className={classes.smallText}>
                  Valor total: &nbsp;
                  <strong>
                    R$ {valueTotal.toLocaleString('pt-br', {minimumFractionDigits: 2})}
                  </strong>
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography className={classes.smallText}>Emissão: {purchaseOrder.issue}</Typography>
                <Typography className={classes.smallText}>Comprador: {purchaseOrder.employeeName}</Typography>
                <Typography className={classes.smallText}>
                  Tipo: {purchaseOrder.type === 'maintenance' ? 'Assistência' : 'Normal'}
                </Typography>
              </Grid>
            </Grid>

            <Box><strong>Obs: </strong> {purchaseOrder.obs}</Box>

            {/* Products Table */}
            <Table className={classes.table} size="small">
              <TableHead className={classes.rowHeader}>
                <TableRow>
                  <TableCell className={classes.cell}>ITEM</TableCell>
                  <TableCell className={classes.cell}>COD MASC</TableCell>
                  <TableCell className={classes.cell} width={320}>DESCRIÇÃO DO PRODUTO</TableCell>
                  <TableCell className={classes.cell}>UN</TableCell>
                  <TableCell className={classes.cell} align='center'>QUANTIDADE</TableCell>
                  <TableCell className={classes.cell} align='right'>VLR. UNITÁRIO</TableCell>
                  <TableCell className={classes.cell} align='right'>VLR. TOTAL R$</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {products?.map((product, i) => (
                  <TableRow hover key={i}>
                    <TableCell className={classes.cell}>{product.item}</TableCell>
                    <TableCell className={classes.cell}>{product.originalCode}</TableCell>
                    <TableCell className={classes.cell}>{product.name}</TableCell>
                    <TableCell className={classes.cell}>UN</TableCell>
                    <TableCell className={classes.cell} align='center'>{product.quantity}</TableCell>
                    <TableCell className={classes.cell} align='right'>
                      {product.value.toLocaleString('pt-br', {minimumFractionDigits: 2})}
                    </TableCell>
                    <TableCell  className={classes.cell} align='right'>
                      {product.total.toLocaleString('pt-br', {minimumFractionDigits: 2})}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
              { (paginatedProducts.length - 1 === index) &&
                <TableFooter>
                  <TableRow className={classes.totalRow}>
                    <TableCell className={classes.cell} colSpan={4}>TOTAL:</TableCell>
                    <TableCell className={classes.cell} align='center'>{quantityTotal}</TableCell>
                    <TableCell className={classes.cell} align='right'>
                      {unitTotal.toLocaleString('pt-br', {minimumFractionDigits: 2})}
                    </TableCell>
                    <TableCell className={classes.cell} align='right'>
                      {valueTotal.toLocaleString('pt-br', {minimumFractionDigits: 2})}
                    </TableCell>
                  </TableRow>
                </TableFooter>
              }
            </Table>

            <Box className={classes.footer}>
              Pagina {index+1} de {paginatedProducts.length}
            </Box>
          </div>
        </div>
      ))}
    </>
  );
};

export default PurchaseOrderReport;
