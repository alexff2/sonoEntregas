import React, { useState } from 'react'
import { BiEdit } from 'react-icons/bi'

import { useUsers } from '../../context/userContext'
import { useModalAlert } from '../../context/modalAlertContext'
import { useAuthenticate } from '../../context/authContext'

import './style.css'

import Modal from '../../components/Modal'
import api from '../../services/api'

const officeValues = ['Assistant', 'Dev', 'Driver', 'User', 'Master']

export default function User(){
  const [userAuthorize, setUserAuthorize] = useState({})
  const [passAuthorize, setPassAuthorize] = useState('')
  const [updateUser, setUpdateUser] = useState([])
  const [nameUser, setNameUser] = useState()
  const [office, setOffice] = useState('User')
  const [passwordUser, setPasswordUser] = useState()
  const [rePasswordUser, setRePasswordUser] = useState()
  const [status, setStatus] = useState()
  const [openAuthorize, setOpenAuthorize] = useState(false)
  const [disabled, setDisabled] = useState(false)
  const { shopAuth, userAuth } = useAuthenticate()

  const { users, setUsers } = useUsers()
  const { setAlert } = useModalAlert()

  const { cod } = shopAuth
  const { OFFICE: userAuthOffice } = userAuth

  const openModalCreateUser = () => {
    document.querySelector('#modal-create-users').style.display = 'flex'
  }

  const openModalAuthorize = user => {
    setNameUser(user.DESCRIPTION)
    setStatus(user.ACTIVE)
    setDisabled(false)

    if (userAuthOffice === 'Dev') {
      setUpdateUser([user])
    } else {
      setUserAuthorize(user)
      setOpenAuthorize(true)
    }
  }

  const closeModalCreate = e => {
    if (e.target.className === 'modal-overlaw' || e.target.className === 'cancel-modal') {
      document.querySelector('.modal-overlaw').style.display = 'none'
    }
    setDisabled(true)
  }

  const closeModalUpdate = e => {
    if (e.target.className === 'modal-overlaw' || e.target.className === 'cancel-modal') {
      setUpdateUser([])
      setNameUser([])
      setDisabled(true)
    setStatus()
    }
  }

  const submitAuthorize = async e => {
    e.preventDefault()
    setOpenAuthorize(false)

    try {
      await api.post('/authenticated', {
        userName: userAuthorize.DESCRIPTION,
        password: passAuthorize,
        codLoja: userAuthorize.CODLOJA
      })

      setUpdateUser([userAuthorize])
      setUserAuthorize({})
    } catch (error) {
      console.log(error)
      if(!error.response)
        setAlert('Rede')
      else if(error.response.status === 400)
        setAlert('Servidor')
      else setAlert(error.response.data)
    }
  }

  const submitUser = async e => {
    e.preventDefault()
    setDisabled(true)
    
    try {
      if (rePasswordUser === passwordUser){
        const codLoja = (office === 'Dev' || office === 'Master') ? 0 : cod
        const password = (office === 'Assistant' || office === 'Driver') ? 0 : passwordUser

        const dataUser = { codLoja, description: nameUser, active: 1, office, password }
        
        const { data } = await api.post('/users', dataUser)
        
        setUsers([...users, data ])
        
        document.querySelector('.modal-overlaw').style.display = 'none'
      } else {
        setAlert('Senhas incompatíveis')
      }
    } catch (error) {
      console.log(error)
      if(!error.response)
        setAlert('Rede')
      else if(error.response.status === 400)
        setAlert('Servidor')
      else setAlert(error.response.data)
    }
  }

  const submitUpdateUser = async ( e, user ) => {
    e.preventDefault()
    setDisabled(true)

    try {
      if (rePasswordUser === passwordUser){
        const userUpd = {...user }
        userUpd.DESCRIPTION = nameUser
        userUpd.ACTIVE = status
        userUpd.PASSWORD = passwordUser

        const { data } = await api.put(`/users/${userUpd.ID}`, userUpd)

        setUsers(users.map( value => value.ID === userUpd.ID ? data : value))

        document.querySelector('.modal-overlaw').style.display = 'none'
        
        setUpdateUser([])
      } else {
        setAlert('Senhas incompatíveis')
      }
    } catch (error) {
      console.log(error)
      if(!error.response)
        setAlert('Rede')
      else if(error.response.status === 400)
        setAlert('Servidor')
      else setAlert(error.response.data)
    }
  }

  return(
    <div className="container">

      <div className="header-container">
        <h2>Cadastro de Usuários</h2>
        <div className="btn-user-inative">Usuários Inativos</div>
      </div>

      <div className="body-container">
        
        <table>
          <thead>
            <tr>
              <th style={{width: '15%'}}>Código</th>
              <th>Nome</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {users.filter(item => item.ACTIVE).map(item => (
              <tr key={item.ID}>
                <td>{item.ID}</td>
                <td>{item.DESCRIPTION}</td>
                <td className="box-btn-ico">
                  <BiEdit
                    color="#5965E0"
                    onClick={() => openModalAuthorize(item)}
                    /> 
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {userAuthOffice === 'Dev' &&
          <button 
            className="circle-add"
            onClick={openModalCreateUser}
          >+</button>
        }
      </div>

      {/*Modal create User*/}
      <div className="modal-overlaw" id="modal-create-users" onClick={closeModalCreate}>
        <div className="modal">
          <h2>Cadastra Usuário</h2>
          <form onSubmit={submitUser}>
            <div className="field-input">
              <input 
                type="text" 
                name="nameUser" 
                placeholder="Nome do usuário" 
                required
                onChange={e => setNameUser(e.target.value.toUpperCase())}
                style={{textTransform: 'uppercase'}}
              />
            </div>
            {!(office === 'Assistant' || office === 'Driver') &&
              <div className="field-input">
                <input 
                  type="password" 
                  name="passwordUser" 
                  maxLength="6" 
                  required 
                  placeholder="Senha..."
                  onChange={e => setPasswordUser(e.target.value)}
                />
              </div>
            }
            <div className="field-input">
              <input 
                type="password" 
                name="rePasswordUser"
                maxLength="6" 
                required 
                placeholder="Repita a Senha..."
                onChange={e => setRePasswordUser(e.target.value)}
              />
            </div>
            <div className="field-input" onChange={e => setOffice(e.target.value)}>
              <select defaultValue={office} className='selectTransparent'>
                {officeValues.map( value => (
                  <option value={value} key={value}>{value}</option>
                ))}
              </select>
            </div>
            <div className="btn-modalUser">
              <div className="cancel-modal">Cancelar</div>
              <button>Salvar</button>
            </div>
          </form>
        </div>
      </div>

      {/*Modal Edit User*/
      updateUser.map( item => (
        <div className="modal-overlaw" id="modal-update-users" onClick={closeModalUpdate} key={item.ID}>
          <div className="modal">
            <h2>Alterar Usuário</h2>
            <form onSubmit={(e) => submitUpdateUser(e, item)}>
              <div className="field-input">
                <input 
                  type="text" 
                  name="nameUser" 
                  defaultValue={item.DESCRIPTION} 
                  required
                  onChange={e => setNameUser(e.target.value)}
                />
              </div>
              <div className="field-input">
                <input 
                  type="password" 
                  name="passwordUser" 
                  maxLength="6" 
                  required 
                  placeholder="Senha..."
                  onChange={e => setPasswordUser(e.target.value)}
                />
              </div>
              <div className="field-input">
                <input 
                  type="password" 
                  name="rePasswordUser"
                  maxLength="6" 
                  required 
                  placeholder="Repita a Senha..."
                  onChange={e => setRePasswordUser(e.target.value)}
                />
              </div>
              {userAuthOffice === 'Dev' &&
                <div className="field-input-checkbox">
                  <p>Ativo? </p>
                  <div>
                    <input 
                      type="radio" 
                      name="sim"
                      id="sim"
                      onChange={() => setStatus(true)}
                      checked={status}
                      />
                    <label htmlFor="sim">Sim</label>
                    <input
                      type="radio" 
                      name="nao"
                      id="nao"
                      value="2"
                      onChange={() => setStatus(false)}
                      checked={!status}
                    />
                    <label htmlFor="nao">Não</label>
                  </div>
                </div>
              }
              <div className="btn-modalUser">
                <div className="cancel-modal">Cancelar</div>
                <button>Salvar</button>
              </div>
            </form>
          </div>
        </div>
      ))}

      {/*Modal Authorize*/}
      <Modal
        openModal={openAuthorize}
        setOpenModal={setOpenAuthorize}
      >
        <form className='formAuthorize' onSubmit={submitAuthorize}>
          <h3>Digite a senha para autorizar as alterações</h3>

          <div className="bodyAuthorize">
            <div>
              <label className="labelField">Usuário: </label>
              <span>{userAuthorize.DESCRIPTION}</span>
            </div>

            <div>
              <label className="labelField">Senha: </label>
              <span> <input type="password" onChange={e => setPassAuthorize(e.target.value)}/></span>
            </div>
          </div>

          <button
            type="submit"
            className='btnBorderCiclo bGgreen'
            disabled={disabled}
            >Autorizar</button>
        </form>
      </Modal>

    </div>
  )
}
