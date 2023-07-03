import React from 'react'
import { Outlet } from 'react-router-dom'
import { BookingsContextProvider } from '../contexts'

const BookingsLayout = () => {
  return (
    <BookingsContextProvider>
        <Outlet />
    </BookingsContextProvider> 
  )
}

export default BookingsLayout
