import React from 'react'
import { Outlet } from 'react-router-dom'
import { BookingRequestsProvider } from '../contexts'

const BookingRequestsLayout = () => {
  return (
    <BookingRequestsProvider>
        <Outlet />
    </BookingRequestsProvider> 
  )
}

export default BookingRequestsLayout
