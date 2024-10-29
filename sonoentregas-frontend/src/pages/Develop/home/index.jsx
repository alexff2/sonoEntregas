import React from 'react'
import { Link } from 'react-router-dom'

const Home = () => {
  return (
    <>
      <nav>
        <ul>
          <li><Link to="/developer/serial/delete">Delete Serial Number</Link></li>
        </ul>
      </nav>
    </>
  )
}

export default Home