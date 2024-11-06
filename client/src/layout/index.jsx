import React from 'react'
import logo from '../assests/logo.png';

const AuthLayouts = ({children}) => {
  return (
    <>
        <header className='flex justify-center items-center py-2 h-15 shadow-lg bg-white'>
            <img src={logo} alt='no photo' width={180} height={60}/>
        </header>
        {children}
      
    </>
  )
}

export default AuthLayouts
