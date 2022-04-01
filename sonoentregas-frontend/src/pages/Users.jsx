import React, { useEffect, useState } from 'react'
import { BiEdit, BiTrash } from 'react-icons/bi'

import { useUsers } from '../context/userContext'

import '../styles/pages/user.css'

import ModalAlert, { openMOdalAlert } from '../components/ModalAlert'
import api from '../services/api'
import { getLoja } from '../services/auth'

export default function User(){
  const { users, setUsers, errorUsers } = useUsers()

  const [ updateUser, setUpdateUser ] = useState([])
  const [ nameUser, setNameUser ] = useState()
  const [ passwordUser, setpasswordUser ] = useState()
  const [ rePasswordUser, setRePasswordUser ] = useState()
  const [ status, setStatus ] = useState()
  const [ childrenAlertModal, setChildrenAlertModal ] = useState('Vazio')

  const { cod } = JSON.parse(getLoja())

  useEffect(() => {
    if (errorUsers) {
      setChildrenAlertModal(errorUsers)
      openMOdalAlert()
    }
  }, [errorUsers])

  const openModalCreateUser = () => {
    document.querySelector('#modal-create-users').style.display = 'flex'
  }

  const openModalUpdateUser = user => {
    setNameUser(user[0].DESCRIPTION)
    setStatus(user[0].ACTIVE)
    setUpdateUser(user)
  }

  const closeModalCreate = e => {
    if (e.target.className === 'modal-overlaw' || e.target.className === 'cancel-modal') {
      document.querySelector('.modal-overlaw').style.display = 'none'
    }
  
  }
  const closeModalUpdate = e => {
    if (e.target.className === 'modal-overlaw' || e.target.className === 'cancel-modal') {
      setUpdateUser([])
    }
  }

  const submitUser = async e => {
    e.preventDefault()
    
    try {
      if (rePasswordUser === passwordUser){
        const dataUser = { codloja: cod, description: nameUser, active: 1, office: 'User', password: passwordUser }
        
        const { data } = await api.post('/users', dataUser)
        
        setUsers([...users, data ])
        
        document.querySelector('.modal-overlaw').style.display = 'none'
      } else {
        setChildrenAlertModal('Senhas incompatíveis')

        openMOdalAlert()
      }
    } catch (error) {
      console.log(error)

      setChildrenAlertModal('Erro ao criar usuário, entre em contato com ADM')

      openMOdalAlert()
    }
  }
  
  const submitUpdateUser = async ( e, codigo ) => {
    e.preventDefault()

    try {
      if (rePasswordUser === passwordUser){
        const dataUser = { codloja: cod, description: nameUser, active: 1, office: 'User', password: passwordUser}

        const { data } = await api.put(`/users/${codigo}`, dataUser)

        setUsers(users.map( value => value.ID === codigo ? data : value))

        document.querySelector('.modal-overlaw').style.display = 'none'
        
        setUpdateUser([])
      } else {
        setChildrenAlertModal('Senhas incompatíveis')
        openMOdalAlert()
      }
    } catch (error) {
      console.log(error)

      setChildrenAlertModal('Erro na atualização, entre em contato com ADM')
      
      openMOdalAlert()
    }
  }

  const deletetUser = async id => {
    try {
      await api.delete(`/users/${id}`)

      setUsers( users.filter( user => user.ID !== id ))
    } catch (error) {
      console.log(error)

      setChildrenAlertModal('Erro na deletar, entre em contato com ADM')
      
      openMOdalAlert()
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
            {users.map(item => {
              return item.ACTIVE ?
                  <tr key={item.ID}>
                    <td>{item.ID}</td>
                    <td>{item.DESCRIPTION}</td>
                    <td className="box-btn-ico">
                      <BiEdit color="#5965E0" onClick={() => openModalUpdateUser([item])}/> 
                      <BiTrash color="#E83F5B" onClick={() => deletetUser(item.ID)}/>
                    </td>
                  </tr>
                : false })}
          </tbody>
        </table>

        <button 
          className="circle-add"
          onClick={openModalCreateUser}
        >+</button>

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
                  onChange={e => setpasswordUser(e.target.value)}
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
              <button onClick={() => console.log(status)}>Teste</button>
              <h2>Alterar Usuário</h2>
              <form onSubmit={(e) => submitUpdateUser(e, item.ID)}>
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
                    onChange={e => setpasswordUser(e.target.value)}
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
                <div className="field-input-checkbox">
                  <p>Ativo? </p>
                  <div>
                    <input 
                      type="radio" 
                      name="sim"
                      id="sim"
                      onChange={() => setStatus(true)}
                      />
                    <label htmlFor="sim">Sim</label>
                    <input
                      type="radio" 
                      name="nao"
                      id="nao"
                      value="2"
                      onChange={() => setStatus(false)}
                    />
                    <label htmlFor="nao">Não</label>
                  </div>
                </div>
                <div className="btn-modalUser">
                  <div className="cancel-modal">Cancelar</div>
                  <button>Salvar</button>
                </div>
              </form>
            </div>
          </div>
        ))}

      </div>
      <ModalAlert>{childrenAlertModal}</ModalAlert>
    </div>
  )
}
