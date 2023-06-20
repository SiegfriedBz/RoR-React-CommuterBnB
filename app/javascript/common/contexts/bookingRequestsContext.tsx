import React, { useState, createContext, useContext } from 'react'

const BookingRequestsContext = createContext()
export const useBookingRequestsContext = () => useContext(BookingRequestsContext)

export const BookingRequestsProvider = ({ children }) => {
    const [bookingRequests, setBookingRequests] = useState([])

    return (
        <BookingRequestsContext.Provider value={{ bookingRequests, setBookingRequests }}>
            {children}
        </BookingRequestsContext.Provider>
    )
}
