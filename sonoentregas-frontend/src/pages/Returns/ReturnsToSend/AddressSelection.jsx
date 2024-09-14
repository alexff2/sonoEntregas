import React from 'react'

const AddressSelection = ({ addresses, sendSalesReturns }) => {
  const handleAddressSelect = (address) => {
    sendSalesReturns(address)
  }

  return (
    <div>
      <h2>Qual endereço usar?: </h2>
      <ul className='address-selection'>
        {addresses.map((address, i) => (
          <li key={i} onClick={() => handleAddressSelect(address)}>
            <span>
              {address.street} Nº {address.houseNumber}, {address.district}, {address.city}/{address.state}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default AddressSelection