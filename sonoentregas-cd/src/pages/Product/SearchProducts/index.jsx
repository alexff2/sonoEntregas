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
  InputLabel, 
} from "@material-ui/core"
import { Search as SearchIcon, Visibility } from '@material-ui/icons'

import Modal from '../../../components/Modal'
import useStyles from '../style'

import api from '../../../services/api'
import {useBackdrop} from "../../../context/backdropContext"
import {useAlertSnackbar} from '../../../context/alertSnackbarContext'

import Details from "./Details"
import UpdateCost from "./UpdateCost"
import BrMonetaryValue from "../../../components/BrMonetaryValue"

export default function SearchProducts() {
  const [typeSearch, setTypeSearch] = useState('name')
  const [search, setSearch] = useState()
  const [products, setProducts] = useState([])
  const [productSelect, setProductSelect] = useState(null)
  const [productUpdateCost, setProductUpdateCost] = useState(null)
  const classes = useStyles()
  const {setAlertSnackbar} = useAlertSnackbar()
  const {setOpenBackDrop} = useBackdrop()
  
  const searchProduct = async () => {
    try {
      if (search === '' || search === undefined) {
        setAlertSnackbar('Campo de pesquisa vazio')
        return
      }

      setOpenBackDrop(true)

      const {data} = await api.get('product', {
        params: {
          search,
          type: typeSearch
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
            defaultValue="name"
          >
            <MenuItem value="name">Descrição</MenuItem>
            <MenuItem value="code">Código</MenuItem>
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
              <TableCell align="right">Estoque</TableCell>
              <TableCell align="right">Disp. CD</TableCell>
              <TableCell align="right">Custo</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
          {products.map(product => (
            <TableRow
              key={product.COD_ORIGINAL}
              hover
              className={classes.row}
            >
              <TableCell>{product.CODIGO}</TableCell>
              <TableCell>{product.COD_ORIGINAL}</TableCell>
              <TableCell>{product.NOME}</TableCell>
              <TableCell
                align="right"
                style={{cursor: 'pointer'}}
                onClick={() => setProductUpdateCost(product)}
              >
                <BrMonetaryValue value={product.purchasePrice} />
              </TableCell>
              <TableCell align="right">{product.EST_LOJA}</TableCell>
              <TableCell align="right">{product.availableStock}</TableCell>
              <TableCell align="center">
                <Visibility
                  color="secondary"
                  onClick={() => setProductSelect(product)}
                  style={{cursor: 'pointer', padding: 0}}
                />
              </TableCell>
            </TableRow>
          ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Modal
        open={Boolean(productUpdateCost)}
        setOpen={setProductUpdateCost}
      >
        <UpdateCost
          product={productUpdateCost}
          setProducts={setProducts}
          setProductUpdateCost={setProductUpdateCost}
        />
      </Modal>
      <Modal
        open={Boolean(productSelect)}
        setOpen={setProductSelect}
      >
        <Details product={productSelect}/>
      </Modal>
    </Box>
  )
}

