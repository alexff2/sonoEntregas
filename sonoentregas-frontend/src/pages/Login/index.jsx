import React from 'react'

import ModalALert2 from '../../components/ModalAlert2'

import { useModalAlert } from '../../context/modalAlertContext'

import SignIn from './SigIn'
import SignUp from './SigUp'

import logo3 from '../../img/Sono3.jpeg'
import log from '../../img/log.svg'
import register from '../../img/register.svg'

import './style.css'

export default function Login(){
  const { open } = useModalAlert()
  /* const singInSingUp = () => {
    const container = document.querySelector(".container")

    container.classList.toggle("sign-up-mode")
  } */

  return (
    <>
      <div className="containerLogin">
        <div className="forms-container">
          <div className="signin-signup">

          <SignIn />

          <SignUp />

          </div>
        </div>

        <div className="panels-container">
          <div className="panel left-panel">
            <div className="content">
              <img src={logo3} width="200px" alt="Logo Sono e Arte" />
              <h3>Não tem usuário?</h3>
              <p>Clique no botão abaixou para se cadastrar!</p>
              <button
                className="btn transparent"
                id="sign-up-btn"

              >
                Cadastro
              </button>
            </div>
            <img src={log} className="image" alt="" />
          </div>
          <div className="panel right-panel">
            <div className="content">
              <h3>Digite seus dados ao lado</h3>
              <p>
                Atenção! Após se cadatrar, seu usuário deve-rá ser liberado pelo departamento de TI, entre em contato solicitando.
              </p>
              <button
                className="btn transparent"
                id="sign-in-btn"

              >Acessar
              </button>
            </div>
            <img src={register} className="image" alt="" />
          </div>
        </div>
      </div>
      {open && <ModalALert2 />}
    </>
  )
}