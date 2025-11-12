import React from 'react';
import {
  Box,
  Typography,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Button,
} from '@material-ui/core';
import { Print } from '@material-ui/icons';
import { useReactToPrint } from 'react-to-print';
import api from '../../../services/api';
import { useBackdrop } from '../../../context/backdropContext'

const AvailableProductsForStores = () => {
  const [products, setProducts] = React.useState([]);
  const [error, setError] = React.useState(null);
  const { setOpenBackDrop } = useBackdrop();
  const documentReport = React.useRef(null);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        setOpenBackDrop(true);
        const { data } = await api.get('/reports/available-products-for-stores');
        setProducts(data);
      } catch (e) {
        setError('Falha ao carregar dados');
      } finally {
        setOpenBackDrop(false);
      }
    };
    fetchData();
  }, [setOpenBackDrop]);

  const handlePrint = useReactToPrint({
    content: () => documentReport.current,
    documentTitle: 'Produtos Disponíveis para as lojas',
  });

  if (error) return <div>{error}</div>;
  if (!products.length) return <div>Nenhum dado disponível.</div>;

  return (
    <Box component={Paper}>
      <Box p={4} display='flex' justifyContent='space-between' alignItems='center'>
        <Button
          variant='contained'
          color="primary"
          onClick={() => window.history.back()}
        >
          Voltar
        </Button>
        <Button
          variant='contained'
          color="primary"
          onClick={handlePrint}
          startIcon={<Print />}
        >
          Imprimir
        </Button>
      </Box>
      <TableContainer component={Paper} style={{padding: 32}} ref={documentReport}>
        <Typography variant="h4" align='center'>Produtos Disponíveis para as lojas</Typography>
        <Table size='small' style={{border: 'solid 1px #CCC', marginTop: 8}}>
          <TableHead>
            <TableRow>
              <TableCell>Código</TableCell>
              <TableCell>Nome do Produto</TableCell>
              <TableCell>Quantidade</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map(product => (
              <TableRow key={product.productId}>
                <TableCell>{product.productId}</TableCell>
                <TableCell>{product.productName}</TableCell>
                <TableCell>{product.quantity}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default AvailableProductsForStores;