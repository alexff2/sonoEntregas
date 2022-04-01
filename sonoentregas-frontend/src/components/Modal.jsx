import React, { useEffect, useState } from 'react'

export default function Modal({ children, openModal, styleModal, setOpenModal }){
  const [ open, setOpen ] = useState()

  useEffect(() =>{
    setOpen(openModal)
  },[openModal])

  return(
    <React.Fragment>
      {open ? 
        <div className="modal-overlaw"
          style={{display: 'flex'}}
          onClick={() => setOpenModal(false)}
        >
          <div className="modal" style={ styleModal ? styleModal : {} }>
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