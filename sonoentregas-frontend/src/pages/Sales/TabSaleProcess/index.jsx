import React, { useEffect } from 'react'

import { useSalesProcess } from '../../../context/salesProcessContext'

export function TabSalesProcess() {
  const { salesProcess } = useSalesProcess()

  useEffect(() => {
    console.log(salesProcess)
  }, [salesProcess])

  return (
    <div>Em processos!</div>
  )
}