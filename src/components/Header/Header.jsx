import React from 'react'
import './header.css'

const Header = ( {errorMessage, successMessage} ) => {

  return (
    <header>
      <h2>Contact Us</h2>
      <p className='success'>{successMessage}</p>
      <p className='err'>{errorMessage}</p>
    </header>
  )
}

export default Header