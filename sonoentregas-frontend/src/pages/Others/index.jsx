import React from 'react'
import GolsByMonth from './GolsByMonth'
import './styles.css'

const modalStates = {
  modalGoalsByMonth: true,
}

const Others = () => {
  const [modals, setModals] = React.useState(modalStates)

  return (
    <div className="container ctr-others">
      <h1>Cadastros e configurações</h1>

      <ul>
        <li onClick={() => setModals({ ...modals, modalGoalsByMonth: true })}>Configurar metas mensais</li>
      </ul>

      <GolsByMonth isOpen={modals.modalGoalsByMonth} onClose={() => setModals({ ...modals, modalGoalsByMonth: false })} />
    </div>
  )
}

export default Others