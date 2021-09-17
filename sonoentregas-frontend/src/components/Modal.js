import React, { useEffect, useState } from 'react'

export default function ModalALert({ children, openModal }){
  const [ open, setOpen ] = useState()
  useEffect(() =>{
    setOpen(openModal)
  },[openModal])
  return(
    <React.Fragment>
      {open ? 
        <div className="modal-overlaw" style={{display: 'flex'}}>
          <div className="modal">
            <div>
                { children }
            </div>
          </div>
        </div>
        : null
      }
    </React.Fragment>
  )
}