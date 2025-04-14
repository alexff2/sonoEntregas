import React from 'react'
import {
  Box,
} from '@material-ui/core'

const Report = ({selectBalanceId}) => {

  return (
    <Box
      style={{
        padding: '0 20px',
        width: 800,
        height: 600,
        overflowY: 'scroll'
      }}
    >
      <h1>Balanço selecionado: {selectBalanceId}</h1>
      <p>This is a basic component for the report page.</p>
    </Box>
  )
}

export default Report