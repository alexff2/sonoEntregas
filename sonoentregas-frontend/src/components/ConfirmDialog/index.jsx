import React, { useState } from 'react'
import './style.css'

function DialogBox({ title, body, onCancel, onConfirm }) {
  const [isLoading, setIsLoading] = useState(false)
  const [isDisable, setIsDisable] = useState(false)
  const [show, setShow] = useState(true)

  React.useEffect(() => {
    setTimeout(() => {
      setShow(true)
    }, 200)
  },[])

  const handleCancel = () => {
    setShow(false);
    setTimeout(() => {
      onCancel()
    }, 200)
  }

  const handleConfirm = async () => {
    setIsDisable(true)
    setIsLoading(true)
    onConfirm().then(() => {
      setShow(false)
    })
  }

  return (
    <div className={`dialog ${show ? 'dialog-active' : ''}`}>
      <div className="dialog-overlay" onClick={handleCancel}></div>
      <div className="dialog-content">
        <h2 className="dialog-title">{title}</h2>
        <p className="dialog-body">{body}</p>
        <div className="dialog-buttons">
          <button className="dialog-button-cancel" onClick={handleCancel}>
            Cancelar
          </button>
          <button className="dialog-button-confirm" onClick={handleConfirm} disabled={isDisable}>
            Confirmar
            {isLoading &&
              <div className="spinner-container">
                <div className="spinner"></div>
              </div>
            }
          </button>
        </div>
      </div>
    </div>
  )
}

export default DialogBox
