import React from 'react'
import { Outlet } from 'react-router-dom'

import ModalALert from '../components/ModalAlert'
import { useAlert } from '../context/alertContext'

export default function External(){
  const { childrenModal, open, setOpen, type } = useAlert()
  return(
    <>
      <Outlet />
      {open && 
        <ModalALert
          children={childrenModal}
          open={open}
          setOpen={setOpen}
          type={type}
        />
      }
    </>
  )
}