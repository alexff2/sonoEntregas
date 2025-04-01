import React, { useEffect } from 'react';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography
} from '@material-ui/core'

import api from '../../../services/api'
import { useBackdrop } from '../../../context/backdropContext'

const BeepPendantModules = () => {
  const [modules, setModules] = React.useState([]);
  const { setOpenBackDrop } = useBackdrop();

  useEffect(() => {
    const fetchData = async () => {
      setOpenBackDrop(true)
      const {data} = await api.get('/beep-pendant-modules')
      setModules(data)
      setOpenBackDrop(false)
    }
    
    fetchData()
  }, [setOpenBackDrop])

  return (
    <Box component={Paper} padding={[2,3]}>
      <Typography variant='h4' align='center'>Módulos Pendentes de Bipagem</Typography>

      {modules.map((module, index) => (
        <Box key={index} marginTop={4}>
          <TableContainer component={Paper} variant='elevation'>
            <Box bgcolor="primary.main" color="#FFF" p={1}>
              <Typography variant='h6'>{module.description}</Typography>
            </Box>
            <Table size='small'>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Data</TableCell>
                  <TableCell>Qtd</TableCell>
                  <TableCell>Qtd Beep</TableCell>
                  <TableCell>Obs</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
              {module.data.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>{item.id}</TableCell>
                  <TableCell>{item.date}</TableCell>
                  <TableCell>{item.qtd}</TableCell>
                  <TableCell>{item.qtd_beep}</TableCell>
                  <TableCell>{item.obs}</TableCell>
                </TableRow>
              ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      ))}
    </Box>
  )
}

export default BeepPendantModules
