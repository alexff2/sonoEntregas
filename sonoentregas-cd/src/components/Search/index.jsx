import React from 'react'
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
  title
}) {
  const classe = useStyles()
  return (
    <Dialog
      open={true}
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
          <Close/>
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
                  defaultValue='name'
                  style={{
                    height: 40,
                    background: '#FFF',
                  }}
                >
                  <MenuItem value='name'>Pelo Nome</MenuItem>
                  <MenuItem value='code'>Pelo Código</MenuItem>
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
                  defaultValue='name'
                  style={{
                    height: 40,
                    background: '#FFF',
                  }}
                >
                  <MenuItem value='name'>Iniciar com</MenuItem>
                  <MenuItem value='code'>Código</MenuItem>
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
            height='67.5%'
          >
            <table className={classe.tableContainer}>
              <thead>
                <tr className={classe.tableRow}>
                  <th></th>
                  <th>Código</th>
                  <th>Nome</th>
                </tr>
              </thead>
              <tbody>
                <tr className={classe.tableRow}>
                  <td style={{background: 'transparent', width: 16, textAlign: 'right'}}>
                    <div className='tri'></div>
                  </td>
                  <td style={{width: 60}}>1</td>
                  <td>ALEXANDRE</td>
                </tr>
              </tbody>
            </table>
          </Box>
          <Box
            display='flex'
            padding={1}
            style={{
              gap: 10
            }}
          >
            <Button variant='contained' style={{width: 100}}>Gravar</Button>
            <Button variant='contained' style={{width: 100}}>Sair</Button>
          </Box>
        </Box>
      </Box>
    </Dialog>
  )
}