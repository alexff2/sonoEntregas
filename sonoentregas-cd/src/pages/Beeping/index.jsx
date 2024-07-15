import React, { useState } from 'react'
import {
  Box,
  Paper,
  Typography
} from '@material-ui/core'

import { useAuthenticate } from '../../context/authContext'

import BarCode from './BarCode'
import BarCodeEndSingleEntered from './BarCodeEndSingleEntered'
import EntryNote from './EntryNote'
import Deliveries from './Deliveries'
import Transfers from './Transfers'

const userAuthToSingleEntered = (userName) => {
  const users = [
    'ALEXANDRE',
    'ANDRESSA'
  ]

  return !!users.find(user => user === userName)
}

const BoxBeep = ({ children, ...props }) => {
  return (
  <Box
    {...props}
    component={Paper}
    style={{
      padding: 40,
      boxShadow: '0px 3.21306px 5.3551px rgba(0, 0, 0, 0.2), 0px 1.07102px 19.2783px rgba(0, 0, 0, 0.12), 0px 6.42612px 10.7102px rgba(0, 0, 0, 0.14)',
      marginBottom: 10
    }}
  >
    <Typography color='primary'>{children}</Typography>
  </Box>
  )
}

export default function Beeping() {
  const [ renderBeepBox, setRenderBeepBox ] = useState(false)
  const [ screenId, setScreenId ] = useState(0)
  const { userAuth } = useAuthenticate()

  const handleRenderBox = (screenId = 1) => {
    setRenderBeepBox(!renderBeepBox)
    setScreenId(screenId)
  }

  return (
    <Box
      style={{ textAlign: 'center' }}
    >
      <h2 style={{ fontSize: 16, marginBottom: 28 }} onClick={() => {console.log(renderBeepBox)}}>Bipagens</h2>

      {
        !renderBeepBox
        ? 
          <>
            <BoxBeep onClick={() => {handleRenderBox(1)}}>Cadastro de C. Barras</BoxBeep>
            {
              userAuthToSingleEntered(userAuth.DESCRIPTION) &&
              <BoxBeep onClick={() => {handleRenderBox(2)}}>Cadastro de C. Barras e Entrada avulsa</BoxBeep>
            }
            <BoxBeep onClick={() => {handleRenderBox(3)}}>Nota de entrada</BoxBeep>
            <BoxBeep onClick={() => {handleRenderBox(4)}}>Rotas de entregas</BoxBeep>
            <BoxBeep onClick={() => {handleRenderBox(5)}}>Transferências</BoxBeep>
          </>
        : 
          <>
            {screenId === 1 && <BarCode handleRenderBox={handleRenderBox} />}
            {
              (screenId === 2 && userAuthToSingleEntered(userAuth.DESCRIPTION))
              && <BarCodeEndSingleEntered handleRenderBox={handleRenderBox} />
            }
            {screenId === 3 && <EntryNote handleRenderBox={handleRenderBox} />}
            {screenId === 4 && <Deliveries handleRenderBox={handleRenderBox} />}
            {screenId === 5 && <Transfers handleRenderBox={handleRenderBox} />}
          </>
      }

    </Box>
  )
}