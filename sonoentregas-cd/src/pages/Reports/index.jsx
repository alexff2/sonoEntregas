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
import { useAuthenticate } from '../../context/authContext'

export default function Reports(){
  const classe = useStyle()
  const { userAuth } = useAuthenticate()
  const navigate = useNavigate()

  const isAuth = userAuth.OFFICE === 'Dev'

  return (
    <Box component={Paper}>
      <AppBar position='relative'>
        <Typography variant='h6' align='center' style={{ padding: '12px 0' }}>
          Relatórios
        </Typography>
      </AppBar>

      <Box p={4} style={{display: 'grid', gap: 32}}>
        <Link className={classe.link} onClick={() => navigate('/app/reports/orderSuggestion')}>
          <Assessment /> &nbsp; &nbsp; <Typography>Sugestão de pedidos</Typography>
        </Link>
        <Link className={classe.link} onClick={() => navigate('/app/reports/salesOpen')}>
          <Assessment /> &nbsp; &nbsp; <Typography>DAVs abertas</Typography>
        </Link>
        <Link className={classe.link} onClick={() => navigate('/app/reports/purchaseRequests')}>
          <Assessment /> &nbsp; &nbsp; <Typography>Pedidos de compra abertos</Typography>
        </Link>
        <Link className={classe.link} onClick={() => navigate('/app/reports/products/movement')}>
          <Assessment /> &nbsp; &nbsp; <Typography>Movimentação de produtos</Typography>
        </Link>
        <Link className={classe.link} onClick={() => navigate('/app/reports/deliveries')}>
          <Assessment /> &nbsp; &nbsp; <Typography>Entregas por data</Typography>
        </Link>
        {isAuth && 
          <Link className={classe.link} href='http://174.200.200.41:3335'>
            <Assessment /> &nbsp; &nbsp; <Typography>Dashboard CD</Typography>
          </Link>
        }
      </Box>

    </Box>
  )
}