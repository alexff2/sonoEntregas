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
  open,
  setOpen,
  fieldsSearch,
  fieldsModel,
  headerTable,
  rows
}) {
  const [typeSearch, setTypeSearch] = useState('')
  const [modelSearch, setModelTypeSearch] = useState('')
  const classe = useStyles()

  useEffect(() => {
    setTypeSearch(fieldsSearch[0].value)
    setModelTypeSearch(fieldsModel[0])
    setTimeout(() => document.getElementById('searchDefaultId').focus(), 500)
  }, [])
  return (
    <Dialog
      open={open}
      maxWidth='lg'
      onKeyDown={e => e.key === 'F2' && console.log(e.key)}
    >
      <Box
        padding={1}
      >
        <header
          className={classe.header}
        >
          <span>{title}</span>
          <Close onClick={() => setOpen(false)} style={{cursor: 'pointer'}}/>
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
                  { fieldsModel.map((model, i) => (
                    <MenuItem key={i} value={model}>{model}</MenuItem>
                  ))}
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
                  <Checkbox style={{padding: 0}}/> F2 - Todos
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
                  style={{
                    backgroundColor: 'white',
                    width: '80%',
                    margin: 0
                  }}
                />
                <Button
                  variant='contained'
                  style={{
                    width: '19%',
                    height: 38
                  }}
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
                      <th key={i}>{headerName}</th>
                    ))
                  }
                </tr>
              </thead>
              <tbody>
                {
                  rows.length > 0 
                  ? rows.map((row, i) => (
                    <tr key={i} className={classe.tableRow}>
                      <td style={{background: 'transparent', width: 16, textAlign: 'right'}}>
                        <div className='tri'></div>
                      </td>
                      {Object.entries(row).map((value, i) => (
                        <td key={i}>{value[1]}</td>
                      ))}
                    </tr>
                  ))
                  :<tr className={classe.tableRow}>
                    <td style={{background: 'transparent', width: 16, textAlign: 'right'}}>
                      <div className='tri'></div>
                    </td>
                    {
                      headerTable.map((_headerName, i) => (
                        <th key={i} style={i === 0 ? {width: 60} : {}}></th>
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
            >Ok</Button>
            <Button
              variant='contained'
              style={{width: 100}}
              onClick={() => setOpen(false)}
            >Sair</Button>
          </Box>
        </Box>
      </Box>
    </Dialog>
  )
}