import React from 'react'

export default function Modal({ children, openModal, styleModal, setOpenModal, closeOnOverLaw = true }){
  return(
    <React.Fragment>
      {openModal &&
        <div className="modal-overlaw"
          style={{display: 'flex'}}
          onClick={e => {
            if(setOpenModal){
              (e.target.className === "modal-overlaw" && closeOnOverLaw) && setOpenModal(false)
            }
          }}
        >
          <div className="modal" style={ styleModal ? styleModal : {} }>
            { children }
          </div>
        </div>
      }
    </React.Fragment>
  )
}