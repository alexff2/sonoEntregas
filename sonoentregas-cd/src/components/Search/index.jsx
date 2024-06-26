import React, { useEffect, useState } from 'react'
import {
  Box,
  Button,
  Checkbox,
  Dialog,
  MenuItem,
  Select,
  TextField,
  makeStyles
} from '@material-ui/core'
import { Close } from '@material-ui/icons'

import { useAlertSnackbar } from '../../context/alertSnackbarContext'
import api from '../../services/api'

const useStyles = makeStyles(theme => ({
  container: {
    padding: 4
  },
  header: {
    marginBottom: 4,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  tableContainer: {
    borderCollapse: 'collapse',
    border: 'solid 1px #CCC',
    width: '100%'
  },
  tableRow: {
    '&:hover': {
      background: theme.palette.action.hover,
      cursor: 'pointer'
    },
    '& > th' : {
      border: 'solid 1px #CCC',
      padding: '2px 4px'
    },
    '& > td' : {
      border: 'solid 1px #CCC',
      padding: '2px 4px',
      backgroundColor: '#FFF',
      '& > .tri': {
        width: 0, 
        height: 0, 
        borderLeft: '8px solid transparent',
        borderRight: '8px solid transparent',
        borderBottom: '8px solid #5386E4',
        transform: 'rotate(90deg)'
      }
    }
  }
}))

export function Search({
  title,
  route,
  open,
  setOpen,
  fieldsSearch,
  headerTable,
  handleSelect
}) {
  const [typeSearch, setTypeSearch] = useState('')
  const [modelSearch, setModelTypeSearch] = useState('beginsWith')
  const [searchAll, setSearchAll] = useState(false)
  const [search, setSearch] = useState('')
  const [dataSearch, setDataSearch] = useState([])
  const [dataSelect, setDataSelect] = useState()
  const {setAlertSnackbar} = useAlertSnackbar()
  const classe = useStyles()

  useEffect(() => {
    setTypeSearch(fieldsSearch[0].value)
    setTimeout(() => document.getElementById('searchDefaultId')?.focus(), 500)
  }, [fieldsSearch])

  useEffect(() => {
    if (searchAll) {
      api.get(route).then(({data}) => setDataSearch(data))
    }
  }, [searchAll, route])

  const handleClose = () => {
    setSearch('')
    setDataSearch([])
    setDataSelect()
    setModelTypeSearch('beginsWith')
    setSearchAll(false)
    setOpen(false)
  }

  const handleSearch = async () => {
    try {
      if (search === '') {
        setAlertSnackbar('Digite algo na pesquisa!')
        return
      }
      const { data } = await api.get(route, {
        params: {
          typeSearch,
          modelSearch,
          search
        }
      })

      setDataSearch(data)
    } catch (error) {
      console.log(error)
      setAlertSnackbar('Error na requisição, contate o ADM!')
    }
  }

  const handleSelectData = async () => {
    await handleSelect(dataSelect)
    handleClose()
  }

  return (
    <Dialog
      open={open}
      maxWidth='lg'
      onKeyDown={e => e.key === 'F2' && setSearchAll(!searchAll)}
    >
      <Box
        padding={1}
      >
        <header
          className={classe.header}
        >
          <span>{title}</span>
          <Close onClick={() => handleClose()} style={{cursor: 'pointer'}}/>
        </header>
        <Box
          border='1px solid #CCC'
          bgcolor='#F3F4F1'
          height='70vh'
          width='40vw'
          padding='1px'
        >
          <Box
            border='1px solid #CCC'
            marginBottom='4px'
          >
            <Box
              display='flex'
              justifyContent='space-between'
              padding={1}
            >
              <Box
                display='flex'
                flexDirection='column'
                width='39%'
              >
                <label htmlFor='typeSearchDefaultId'>Campos para pesquisa</label>
                <Select
                  id='typeSearchDefaultId'
                  variant='outlined'
                  value={typeSearch}
                  onChange={e => setTypeSearch(e.target.value)}
                  style={{
                    height: 40,
                    background: '#FFF',
                  }}
                >
                  { fieldsSearch.map((field, i) => (
                    <MenuItem key={i} value={field.value}>{field.description}</MenuItem>
                  ))}
                </Select>
              </Box>
              <Box
                display='flex'
                flexDirection='column'
                width='60%'
              >
                <label htmlFor='modelDefaultId'>Modelo</label>
                <Select
                  id='modelDefaultId'
                  variant='outlined'
                  value={modelSearch}
                  onChange={e => setModelTypeSearch(e.target.value)}
                  style={{
                    height: 40,
                    background: '#FFF',
                  }}
                >
                  <MenuItem value='beginsWith'>Começa com</MenuItem>
                  <MenuItem value='contain'>Contêm</MenuItem>
                  <MenuItem value='endsWith'>Termina com</MenuItem>
                </Select>
              </Box>
            </Box>
            <Box padding={1}>
              <Box
                display='flex'
                justifyContent='space-between'
              >
                <label htmlFor='searchDefaultId'>Dados a pesquisar</label>
                <Box>
                  <Checkbox
                    checked={searchAll}
                    onChange={e => setSearchAll(e.target.checked)}
                    style={{padding: 0}}
                  /> F2 - Todos
                </Box>
              </Box>
              <Box
                display='flex'
                justifyContent='space-between'
              >
                <TextField
                  id='searchDefaultId'
                  variant='outlined'
                  size='small'
                  autoComplete='off'
                  style={{
                    backgroundColor: `${searchAll ? 'transparent': 'white'}`,
                    width: '80%',
                    margin: 0
                  }}
                  disabled={searchAll}
                  value={search}
                  onChange={e => setSearch(e.target.value.toUpperCase())}
                  onKeyDown={e => e.key === 'Enter' && handleSearch()}
                />
                <Button
                  variant='contained'
                  disabled={searchAll}
                  style={{
                    width: '19%',
                    height: 38
                  }}
                  onClick={handleSearch}
                >Pesquisar</Button>
              </Box>
            </Box>
          </Box>
          <Box
            boxShadow='inset 1px 1px 2px 2px #CCCB, inset -1px -1px 2px 2px #CCC7'
            borderTop='2px solid #A2A3A099'
            padding='2px'
            height='66.5%'
          >
            <table className={classe.tableContainer}>
              <thead>
                <tr className={classe.tableRow}>
                  <th></th>
                  {
                    headerTable.map((headerName, i) => (
                      <th key={i} style={i === 0 ? {width: 60} : {}}>{headerName}</th>
                    ))
                  }
                </tr>
              </thead>
              <tbody>
                {
                  dataSearch.length > 0 
                  ? dataSearch.map((row, i) => (
                    <tr key={i} className={classe.tableRow} onClick={() => setDataSelect(row)}>
                      <td style={{background: 'transparent', width: 25, textAlign: 'right'}}>
                        { (dataSelect?.id === row.id) ? <div className='tri'></div> : null}
                      </td>
                      {Object.entries(row).map((value, i) => (
                        <td key={i}>{value[1]}</td>
                      ))}
                    </tr>
                  ))
                  :<tr className={classe.tableRow}>
                    <td style={{background: 'transparent', width: 25, height: 25, textAlign: 'right'}}></td>
                    {
                      headerTable.map((_headerName, i) => (
                        <td key={i}></td>
                      ))
                    }
                  </tr>
                }
              </tbody>
            </table>
          </Box>
          <Box
            display='flex'
            border='1px solid #CCC'
            marginTop='2px'
            padding={1}
            style={{
              gap: 10
            }}
          >
            <Button
              variant='contained'
              style={{width: 100}}
              onClick={handleSelectData}
            >Ok</Button>
            <Button
              variant='contained'
              style={{width: 100}}
              onClick={() => handleClose()}
            >Sair</Button>
          </Box>
        </Box>
      </Box>
    </Dialog>
  )
}