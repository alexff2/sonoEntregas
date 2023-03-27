import React from 'react'

import './style.css'

export default function CheckBox({ check, color }){
  return(
    <div className='boxCheck' style={color ? {borderColor: color}: {}}>
      {check && <div style={color ? {borderColor: color}: {}}></div>}
    </div>
  )
}