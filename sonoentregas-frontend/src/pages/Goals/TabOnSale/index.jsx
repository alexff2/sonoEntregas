import React, { useState, useEffect } from "react"
import { AiOutlineSearch, AiOutlineArrowDown, AiOutlineArrowUp } from 'react-icons/ai'

import Modal from "../../../components/Modal"
import ModaCreate from "./ModalCreate"

import { toLocString } from "../../../functions/toLocString"

import api from "../../../services/api"

const ProductsOnSale = ({ product }) => {
  return (
    <tr>
      <td>{product.COD_ORIGINAL}</td>
      <td>{product.NOME}</td>
      <td>{toLocString(product.valueOnSales)}</td>
    </tr>
  )
}

const RowOnSale = ({ onSale }) => {
  const [ open, setOpen ] = useState(false)

  return (
    <>
      <tr key={onSale.id}>
        <td style={{width: 10}} onClick={() => setOpen(!open)}>
          { open ? <AiOutlineArrowUp /> : <AiOutlineArrowDown /> }
        </td>
        <td>{onSale.id}</td>
        <td>{onSale.description}</td>
        <td>{onSale.dateStart}</td>
        <td>{onSale.dateFinish}</td>
      </tr>

      <tr>
        <td colSpan="5">
          <div className={open ? 'tabProdSeach openDiv': 'tabProdSeach'}>
            <table>
              <tbody>
                {onSale.products.map(product => (
                  <ProductsOnSale product={product} key={product.COD_ORIGINAL}/>
                ))}
              </tbody>
            </table>
          </div>
        </td>
      </tr>
    </>
  )
}

export default function TabGoals() {
  const [ search, setSearch ] = useState('')
  const [ typeSearch, setTypeSearch ] = useState('STATUS')
  const [ typesStatus, setTypesStatus ] = useState('open')
  const [ isOpenModalCreateOnSale, setIsOpenModalCreateOnSale ] = useState(false)
  const [ onSales, setOnSale ] = useState([])

  useEffect(() => {
    const getOnSales = async () => {
      const { data } = await api.get('/onSale/open')

      setOnSale(data)
    }
    getOnSales()
  }, [])

  const searchOnSale = async () => console.log(onSales)

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

      {onSales.length === 0
        ? <div className="red">Nenhuma promoção cadastrada!</div>
        : <table>
            <thead>
              <tr>
                <th></th>
                <th>Código</th>
                <th>Descrição</th>
                <th>Data Inicial</th>
                <th>Data Final</th>
              </tr>
            </thead>
            <tbody>
              {onSales.map(onSale => (
                <RowOnSale key={onSale.id} onSale={onSale} />
              ))}
            </tbody>
          </table>
      }

      <button 
        className="circle-add"
        onClick={() => setIsOpenModalCreateOnSale(true)}
      >+</button>

      <Modal
        openModal={isOpenModalCreateOnSale}
        setOpenModal={setIsOpenModalCreateOnSale}
      >
        <ModaCreate setOpenModalCreateOnSale={setIsOpenModalCreateOnSale} setOnSale={setOnSale}/>
      </Modal>
    </>
  )
}