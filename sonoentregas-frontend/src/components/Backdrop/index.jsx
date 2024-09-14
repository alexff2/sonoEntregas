import React from 'react'

import LoadingCircle from '../LoadingCircle'

import './style.css'

const Backdrop = ({ open }) => {
  return (
    <React.Fragment>
      {
        open &&
        <div className='modal-overlaw backdrop'>
          <LoadingCircle style={{marginTop: '-120px'}}/>
        </div>
      }
    </React.Fragment>
  )
}

export default Backdrop