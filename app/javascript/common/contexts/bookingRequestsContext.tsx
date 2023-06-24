import React, { useState, createContext, useContext } from 'react'
import { IBookingRequest } from "../utils/interfaces"

const BookingRequestsContext = createContext()
export const useBookingRequestsContext = () => useContext(BookingRequestsContext)

export const BookingRequestsProvider = ({ children }) => {
    const [bookingRequests, setBookingRequests] = useState<IBookingRequest[] | []>([])

    return (
        <BookingRequestsContext.Provider value={{ bookingRequests, setBookingRequests }}>
            {children}
        </BookingRequestsContext.Provider>
    )
}
