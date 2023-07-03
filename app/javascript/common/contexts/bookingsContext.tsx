import React, { useState, createContext, useContext } from 'react'
import { IBookingRequest } from "../utils/interfaces"

const BookingsContext = createContext()
export const useBookingsContext = () => useContext(BookingsContext)

export const BookingsContextProvider = ({ children }) => {
    const [bookingRequests, setBookingRequests] = useState<IBookingRequest[] | []>([])

    return (
        <BookingsContext.Provider value={{ bookingRequests, setBookingRequests }}>
            {children}
        </BookingsContext.Provider>
    )
}
