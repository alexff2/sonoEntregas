import React, { useState, useEffect } from "react"
import { AiOutlineSearch, AiOutlineArrowDown, AiOutlineArrowUp } from 'react-icons/ai'

import Modal from "../../../components/Modal"
import ModaCreate from "./ModalCreate"

import { toLocString } from "../../../functions/toLocString"

import api from "../../../services/api"
import ModalSync from "../../../components/ModalSync"

const ProductsPromotion = ({ product }) => {
  return (
    <tr>
      <td>{product.idProduct}</td>
      <td>{product.NOME}</td>
      <td>{toLocString(product.pricePromotion)}</td>
    </tr>
  )
}

const RowPromotion = ({ promotion }) => {
  const [ open, setOpen ] = useState(false)

  return (
    <>
      <tr key={promotion.id}>
        <td style={{width: 10}} onClick={() => setOpen(!open)}>
          { open ? <AiOutlineArrowUp /> : <AiOutlineArrowDown /> }
        </td>
        <td>{promotion.id}</td>
        <td>{promotion.description}</td>
        <td>{promotion.dateStart}</td>
        <td>{promotion.dateFinish}</td>
      </tr>

      <tr>
        <td colSpan="5">
          <div className={open ? 'tabProdSeach openDiv': 'tabProdSeach'}>
            <table>
              <tbody>
                {promotion.products.map(product => (
                  <ProductsPromotion product={product} key={product.idProduct}/>
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
  const [ isOpenModalSync, setIsOpenModalSync ] = useState(false)
  const [ promotions, setPromotions ] = useState([])

  useEffect(() => {
    const getPromotions = async () => {
      const { data } = await api.get('/promotion/open')

      setPromotions(data)
    }
    getPromotions()
  }, [])

  const searchOnSale = async () => console.log('searchOnSale')

  return (
    <>
      <div className="fieldsSearchSales flexRowSpaceBetween">
        <div className="searchOnSale">
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

        <div>
          <button onClick={() => setIsOpenModalSync(true)}>
            Sincronizar
          </button>
        </div>
      </div>

      {promotions.length === 0
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
              {promotions.map(promotion => (
                <RowPromotion key={promotion.id} promotion={promotion} />
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
        <ModaCreate setOpenModalCreateOnSale={setIsOpenModalCreateOnSale} setPromotions={setPromotions}/>
      </Modal>

      <Modal
        openModal={isOpenModalSync}
        setOpenModal={setIsOpenModalSync}
        closeOnOverLaw={false}
      >
        <ModalSync setIsOpenModalSync={setIsOpenModalSync}/>
      </Modal>
    </>
  )
}