import React from 'react'

import '../styles/components/CheckBox.css'

export default function CheckBox({ check, color }){
  return(
    <div className='boxCheck' style={color ? {borderColor: color}: {}}>
      {check && <div style={color ? {borderColor: color}: {}}></div>}
    </div>
  )
}