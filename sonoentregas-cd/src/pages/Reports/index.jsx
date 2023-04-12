import React from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  Box,
  Paper,
  AppBar,
  Typography,
  Link
} from '@material-ui/core'
import { Assessment } from '@material-ui/icons'

import { useStyle } from './style'

export default function Reports(){
  const classe = useStyle()
  const navigate = useNavigate()

  return (
    <Box component={Paper}>
      <AppBar position='relative'>
        <Typography variant='h6' align='center' style={{ padding: '12px 0' }}>
          Relatórios
        </Typography>
      </AppBar>

      <Box p={4} display={'flex'}>
        <Link className={classe.link} onClick={() => navigate('/app/reports/orderSuggestion')}>
          <Assessment /> <Typography>Sugestão de pedidos</Typography>
        </Link>
      </Box>

    </Box>
  )
}