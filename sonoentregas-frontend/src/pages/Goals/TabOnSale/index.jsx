import React, { useState } from "react"
import { AiOutlineSearch } from 'react-icons/ai'

import Modal from "../../../components/Modal"
import ModaCreate from "./ModalCreate"

export default function TabGoals() {
  const [ search, setSearch ] = useState('')
  const [ typeSearch, setTypeSearch ] = useState('STATUS')
  const [ typesStatus, setTypesStatus ] = useState('open')
  const [ isOpenModalCreateOnSale, setIsOpenModalCreateOnSale ] = useState(true)
  const [ onSale, setOnSale ] = useState([])

  const searchOnSale = async () => console.log('searchOnSale')

  return (
    <>
      <div className="fieldsSearchSales">
        <select 
          name="typeSales"
          id="typeSales" 
          className="selectSearchSales"
          onChange={e => {
            setTypeSearch(e.target.value)
            setSearch('')
            e.target.value === 'STATUS'
              ? setTypesStatus('open')
              : setTypesStatus('')
          }}
        >
          <option value={'STATUS'}>Status</option>
          <option value={'ID_SALE'}>Código Promoção</option>
          <option value={'NOMECLI'}>Descrição</option>
        </select>

          { typeSearch === 'STATUS' &&
            <select 
              name="statusSales"
              id="statusSales" 
              className="selectSearchSales"
              onChange={e => {
                setSearch(e.target.value) 
                setTypesStatus(e.target.value)
              }}
            >
              <option value={'open'}>Abertas</option>
              <option value={'close'}>Finalizadas</option>
            </select>
          }
          { typesStatus === 'close' && 
            <div className="inputsSearchSales">
              <AiOutlineSearch />
                <input
                  type="date" 
                  onChange={e => setSearch(e.target.value)}
                />
            </div>
          }
          { typeSearch !== 'STATUS' && 
            <div className="inputsSearchSales">
              <AiOutlineSearch />
              <input
                type="text"
                placeholder="Pesquisar…"
                onChange={e => setSearch(e.target.value)}
                onKeyPress={e => e.key === 'Enter' ? searchOnSale() : null}
                value={search}
              />
            </div>
          }

        <button onClick={searchOnSale}>PESQUISAR</button>
      </div>

      {onSale.length === 0
        ? <div className="red">Nenhuma promoção cadastrada!</div>
        : <table className="tableSales"></table>}

      <button 
        className="circle-add"
        onClick={() => setIsOpenModalCreateOnSale(true)}
      >+</button>

      <Modal
        openModal={isOpenModalCreateOnSale}
        setOpenModal={setIsOpenModalCreateOnSale}
      >
        <ModaCreate />
      </Modal>
    </>
  )
}