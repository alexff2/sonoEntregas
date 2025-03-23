import React, { useState } from "react"
import { 
  Box,
  InputBase, 
  Table, 
  TableContainer, 
  TableHead, 
  TableRow, 
  TableCell,
  TableBody, 
  Paper, 
  Button, 
  Select, 
  MenuItem, 
  FormControl, 
  InputLabel 
} from "@material-ui/core"
import SearchIcon from '@material-ui/icons/Search'

import { useAlertSnackbar } from '../../../context/alertSnackbarContext'

import useStyles from '../style'

import api from '../../../services/api'
import { useBackdrop } from "../../../context/backdropContext"

export default function SearchProducts() {
  const [ products, setProducts ] = useState([])
  const [ serialNumbersProduct, setSerialNumbersProduct ] = useState([])
  const [ search, setSearch ] = useState()
  const [ typeSearch, setTypeSearch ] = useState('NOME')
  const classes = useStyles()
  const { setAlertSnackbar } = useAlertSnackbar()
  const { setOpenBackDrop } = useBackdrop()
  
  const searchProduct = async () => {
    try {
      if (search === '' || search === undefined) {
        setAlertSnackbar('Campo de pesquisa vazio')
        return
      }

      setOpenBackDrop(true)

      const { data } = await api.get('products', {
        params: {
          search,
          typeSearch
        }
      })

      setOpenBackDrop(false)
      setProducts(data)
    } catch (e) {
      setAlertSnackbar(e)
      setProducts([])
      setOpenBackDrop(false)
    }
  }

  const searchSerialNumber = async (product) => {
    try {
      if (product.COD_ORIGINAL === serialNumbersProduct.COD_ORIGINAL) {
        setSerialNumbersProduct({})
        return
      }

      setOpenBackDrop(true)

      const { data } = await api.get('serial/product', {
        params: { code: product.CODIGO }
      })

      setOpenBackDrop(false)
      setSerialNumbersProduct({
        COD_ORIGINAL: product.COD_ORIGINAL,
        serials: data
      })
    } catch (e) {
      setAlertSnackbar("Erro interno, entre em contato com Adm")
      setSerialNumbersProduct({})
      setOpenBackDrop(false)
    }
  }

  return (
    <Box>
      <Box className={classes.barHeader}>
        <FormControl variant="outlined">
          <InputLabel id="fieldSearch" className={classes.label}>
            Tipo
          </InputLabel>
          <Select
            label="Tipo"
            labelId="fieldSearch"
            className={classes.fieldSearch}
            onChange={(e) => setTypeSearch(e.target.value)}
            defaultValue="NOME"
          >
            <MenuItem value="NOME">Descrição</MenuItem>
            <MenuItem value="COD_ORIGINAL">Código</MenuItem>
          </Select>
        </FormControl>

        <div className={classes.search}>
          <div className={classes.searchIcon}>
            <SearchIcon />
          </div>
          <InputBase
            placeholder="Pesquisar…"
            classes={{
              root: classes.inputRoot,
              input: classes.inputInput,
            }}
            inputProps={{ "aria-label": "search" }}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && searchProduct()}
          />
        </div>

        <Button className={classes.btnSearch} onClick={searchProduct}>
          Pesquisar
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow className={classes.rowHeader}>
              <TableCell>Código</TableCell>
              <TableCell>Cod Alterna</TableCell>
              <TableCell>Descrição</TableCell>
              <TableCell align="right">Qtd Kardex</TableCell>
              <TableCell align="right">Qtd Bipada</TableCell>
              <TableCell align="right">Qtd Reservado</TableCell>
              <TableCell align="right">Qtd Disp. Loja</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
          {products.map((product) => (
            <React.Fragment key={product.COD_ORIGINAL}>
              <TableRow
                hover
                onClick={() => searchSerialNumber(product)}
                className={classes.row}
              >
                <TableCell>{product.CODIGO}</TableCell>
                <TableCell>{product.COD_ORIGINAL}</TableCell>
                <TableCell>{product.NOME}</TableCell>
                <TableCell align="right">{product.EST_KARDEX}</TableCell>
                <TableCell align="right">{product.EST_BEEP}</TableCell>
                <TableCell align="right">{product.EST_RESERVA}</TableCell>
                <TableCell align="right">{product.EST_DISPONIVEL}</TableCell>
              </TableRow>
              {serialNumbersProduct.COD_ORIGINAL === product.COD_ORIGINAL && (
                <TableRow>
                  <TableCell colSpan={6}>
                    <strong>Número de séries</strong>
                    <Box className={classes.boxSerialNumber}>
                      {serialNumbersProduct.serials.map((serial, index) => (
                        <Box key={index}>
                          <strong>{index + 1}:</strong> {serial}
                        </Box>
                      ))}
                    </Box>
                  </TableCell>
                </TableRow>
              )}
            </React.Fragment>
          ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

