import React from 'react'

export default function Modal({ children, openModal, styleModal, setOpenModal }){
  return(
    <React.Fragment>
      {openModal &&
        <div className="modal-overlaw"
          style={{display: 'flex'}}
          onClick={e => {
            e.target.className === "modal-overlaw"
              && setOpenModal(false)
          }}
        >
          <div className="modal" style={ styleModal ? styleModal : {} }>
            <div>
                { children }
            </div>
          </div>
        </div>
      }
    </React.Fragment>
  )
}