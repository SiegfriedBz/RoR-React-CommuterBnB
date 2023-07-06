import React, { useState, createContext, useContext } from 'react'
import { IBookingRequest } from "../utils/interfaces"

const BookingsContext = createContext()
export const useBookingsContext = () => useContext(BookingsContext)

interface IProps {
    children: React.ReactNode
}

export const BookingsContextProvider: React.FC<IProps> = ({ children }) => {
    const [bookingRequests, setBookingRequests] = useState<IBookingRequest[] | []>([])

    return (
        <BookingsContext.Provider value={{ bookingRequests, setBookingRequests }}>
            {children}
        </BookingsContext.Provider>
    )
}
