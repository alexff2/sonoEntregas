import React from 'react'
import { FiPlus } from 'react-icons/fi'

import './style.css'

export default function ButtonPlus({...props}){
  return(
    <button className='btnPlus' {...props}>
      <FiPlus/>
    </button>
  )
}
