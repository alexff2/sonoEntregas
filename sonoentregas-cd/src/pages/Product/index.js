import { Box, makeStyles, InputBase, fade, Table, TableContainer, TableHead, TableRow, TableCell, TableBody, Paper, Button, Select, MenuItem, FormControl, InputLabel } from "@material-ui/core"
import SearchIcon from '@material-ui/icons/Search'
import React, { useState } from "react"

const useStyles = makeStyles(theme => ({
  barHeader: {
    padding: theme.spacing(2),
    background: theme.palette.primary.main,
    display: 'flex'
    //flexGrow: 1
  },
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing(2),
    width: '60%'
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: theme.palette.common.white
  },
  inputRoot: {
    color: theme.palette.common.white,
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create('width'),
    [theme.breakpoints.up('md')]: {
      width: '20ch',
    },
  },
  label: {
    color: fade(theme.palette.common.white, 0.55)
  },
  fieldSeach: {
    color: fade(theme.palette.common.white, 0.55),
    height: '2.3rem',
    width: theme.spacing(15),
    marginRight: theme.spacing(2),
  },
  btnSearch: {
    background: theme.palette.primary.dark,
    color: theme.palette.common.white
  }
}))

export default function Product() {
  const [ products, setProducts ] = useState()
  const classes = useStyles()
  const teste = () => {
    console.log(products)
  }
  return(
    <Box>
      <Box className={classes.barHeader}>

      <FormControl variant="outlined">
        <InputLabel id="fieldSeach" className={classes.label}>Tipo</InputLabel>
        <Select
          label="Tipo"
          labelId="fieldSeach"
          className={classes.fieldSeach}
          defaultValue={0}
        >
          <MenuItem value={0}>Descrição</MenuItem>
          <MenuItem value={1}>Código</MenuItem>
        </Select>
      </FormControl>

        <div className={classes.search}>
          <div className={classes.searchIcon}>
            <SearchIcon/>
          </div>
          <InputBase
            placeholder="Pesquisar…"
            classes={{
              root: classes.inputRoot,
              input: classes.inputInput,
            }}
            inputProps={{ 'aria-label': 'search' }}
            onChange={e => setProducts(e.target.value)}
          />
        </div>

        <Button className={classes.btnSearch} onClick={teste}>Pesquisar</Button>

      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Código</TableCell>
              <TableCell>Descrição</TableCell>
              <TableCell align="right">Qtd. Total</TableCell>
              <TableCell align="right">Qtd. Reservado</TableCell>
              <TableCell align="right">Qtd. Disponível</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell>1</TableCell>
              <TableCell>Cama doida</TableCell>
              <TableCell align="right">5</TableCell>
              <TableCell align="right">2</TableCell>
              <TableCell align="right">3</TableCell>
            </TableRow>

          </TableBody>
        </Table>
      </TableContainer>

    </Box>
  )
}

