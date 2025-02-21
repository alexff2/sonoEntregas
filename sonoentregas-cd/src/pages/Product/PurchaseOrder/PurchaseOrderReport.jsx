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
  Grid
} from '@material-ui/core';
import api from '../../../services/api';

const useStyles = makeStyles((theme) => ({
  root: {
    fontFamily: 'Arial, sans-serif',
  },
  header: {
    marginBottom: theme.spacing(2),
  },
  companyInfo: {
    marginBottom: theme.spacing(2),
  },
  infoBlock: {
    marginBottom: theme.spacing(1),
  },
  table: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  cell: {
    fontSize: '12px',
    padding: '4px 8px',
  },
  totalRow: {
    fontWeight: 'bold',
  },
  footer: {
    marginTop: theme.spacing(2),
    borderTop: `1px solid ${theme.palette.divider}`,
    paddingTop: theme.spacing(2),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  },
  smallText: {
    fontSize: '12px',
  },
  signLine: {
    borderTop: `1px solid ${theme.palette.common.black}`,
    marginTop: theme.spacing(3),
    width: 300
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

  return (
    <div className="report">
      <div className={classes.root}>
        {/* Company Header */}
        <div className={classes.header}>
          <Typography variant="h6">CD SONO ARTE</Typography>
          <div className={classes.companyInfo}>
            <Typography className={classes.smallText}>CNPJ: 07.920.906/0001-73 IE: 122263944</Typography>
            <Typography className={classes.smallText}>AV 4, QD D, LOTE 3, SN DIST. INDUST</Typography>
            <Typography className={classes.smallText}>SAO LUIS - MA</Typography>
            <Typography className={classes.smallText}>Fone/Fax: (098)3241-1220</Typography>
          </div>
        </div>

        <Divider />

        {/* Supplier Info */}
        <Grid container spacing={2} className={classes.infoBlock}>
          <Grid item xs={6}>
            <Typography className={classes.smallText}>Fornecedor: MARANHAO COLCHOES LTDA</Typography>
            <Typography className={classes.smallText}>CNPJ: 15.578.915/0001-56</Typography>
            <Typography className={classes.smallText}>RUA 4 QD D LOTE 3</Typography>
            <Typography className={classes.smallText}>SAO LUIS - MA</Typography>
            <Typography className={classes.smallText}>Fone/Fax: (098)3241-1320</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography className={classes.smallText}>
              Pedido Nº: <strong>{purchaseOrder.id}</strong>
            </Typography>
            <Typography className={classes.smallText}>Emissão: {purchaseOrder.issue}</Typography>
            <Typography className={classes.smallText}>Prev.Chegada: -</Typography>
            <Typography className={classes.smallText}>Transportadora: PROPRIA</Typography>
            <Typography className={classes.smallText}>Comprador: {purchaseOrder.employeeName}</Typography>
          </Grid>
        </Grid>

        <Divider />

        {/* Products Table */}
        <Table className={classes.table} size="small">
          <TableHead>
            <TableRow>
              <TableCell className={classes.cell}>Item</TableCell>
              <TableCell className={classes.cell}>Código</TableCell>
              <TableCell className={classes.cell}>Descrição do produto</TableCell>
              <TableCell className={classes.cell}>UN</TableCell>
              <TableCell className={classes.cell}>Quantidade</TableCell>
              <TableCell className={classes.cell}>Vlr. Unitário</TableCell>
              <TableCell className={classes.cell}>Vlr. Total R$</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {purchaseOrderProducts?.map((product, i) => (
              <TableRow hover key={i}>
                <TableCell className={classes.cell}>{product.item}</TableCell>
                <TableCell className={classes.cell}>{product.code}</TableCell>
                <TableCell className={classes.cell}>{product.name}</TableCell>
                <TableCell className={classes.cell}>UN</TableCell>
                <TableCell className={classes.cell}>{product.quantity}</TableCell>
                <TableCell  className={classes.cell}>
                  {product.value.toLocaleString('pt-br', {minimumFractionDigits: 2})}
                </TableCell>
                <TableCell  className={classes.cell}>
                  {product.total.toLocaleString('pt-br', {minimumFractionDigits: 2})}
                </TableCell>
              </TableRow>
            ))}
            <TableRow className={classes.totalRow}>
              <TableCell className={classes.cell} colSpan={4}>Total:</TableCell>
              <TableCell className={classes.cell}>{quantityTotal}</TableCell>
              <TableCell className={classes.cell}>{unitTotal.toLocaleString('pt-br', {minimumFractionDigits: 2})}</TableCell>
              <TableCell className={classes.cell}>{valueTotal.toLocaleString('pt-br', {minimumFractionDigits: 2})}</TableCell>
            </TableRow>
          </TableBody>
        </Table>

        {/* Totals */}
        <Grid container spacing={1}>
          <Grid item xs={12}>
            <Typography className={classes.smallText}>Valor do Pedido: {purchaseOrder.value}</Typography>
            <Typography className={classes.smallText}>Frete: R$ 0,00</Typography>
            <Typography className={classes.smallText}>Desconto: R$ 0,00</Typography>
            <Typography className={classes.smallText}><strong>*** Total ***: R$ {purchaseOrder.value}</strong></Typography>
          </Grid>
        </Grid>

        {/* Footer */}
        <div className={classes.footer}>
          <div className={classes.signLine}></div>
          <Typography className={classes.smallText}>CD SONO ARTE</Typography>
          <Typography className={classes.smallText}>ELEN FRASAO</Typography>
        </div>
      </div>
    </div>
  );
};

export default PurchaseOrderReport;
