import React from 'react'
import './style.css'

import SearchGols from './Search'
import RegisterGols from './Register'

const GoalsByMonth = ({ isOpen, onClose }) => {
  const [active, setActive] = React.useState(0)
  const [registerSelected, setRegisterSelected] = React.useState(null)

  const tabs = [
    { label: 'Cadastrar', content: <RegisterGols goal={registerSelected} setGol={setRegisterSelected}/> },
    { label: 'Consultar', content: <SearchGols setRegisterSelected={setRegisterSelected} /> },
  ]

  React.useEffect(() => {
    if (registerSelected) {
      setActive(0)
    }
  }, [registerSelected])

  return (
    <React.Fragment>
      {isOpen &&
        <div className="modal-overlaw"
          style={{display: 'flex'}}
          onClick={e => {
            (e.target.className === "modal-overlaw") && onClose()
          }}
        >
          <div className="modal">
            <h2>Metas mensais</h2>

            <div className="tabs-container">
              <div className="tabs-header">
                {tabs.map((tab, idx) => (
                  <button
                    key={tab.label}
                    className={`tab-btn${active === idx ? ' active' : ''}`}
                    onClick={() => setActive(idx)}
                    type="button"
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
              <div className="tabs-content">
                {tabs[active].content}
              </div>
            </div>
          </div>
        </div>
      }
    </React.Fragment>
  )
}

export default GoalsByMonth