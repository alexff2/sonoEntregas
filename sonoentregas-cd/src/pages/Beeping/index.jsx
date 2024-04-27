import React, { useState } from 'react'
import {
  Box,
  Paper,
  Typography
} from '@material-ui/core'

import BarCode from './BarCode'

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
        ? <>
          <BoxBeep onClick={() => {handleRenderBox(1)}}>Cadastro de C. Barras</BoxBeep>
          <BoxBeep>Notas de entrada</BoxBeep>
          <BoxBeep>Entregas</BoxBeep>
          <BoxBeep>Transferências</BoxBeep>
        </>
        : <>
            {screenId === 1 && <BarCode handleRenderBox={handleRenderBox} />}
            {screenId === 2 && (<Box>Telas 2</Box>)}
            {screenId === 3 && (<Box>Telas 3</Box>)}
            {screenId === 4 && (<Box>Telas 4</Box>)}
            {screenId === 5 && (<Box>Telas 5</Box>)}
          </>
      }

    </Box>
  )
}