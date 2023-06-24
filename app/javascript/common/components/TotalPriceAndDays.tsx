import React from 'react'
import { differenceInDays } from 'date-fns'

interface IProps {
    starting_date: string,
    ending_date: string,
    pricePerNightInCents: number,
    children?: React.ReactNode
}

const TotalPriceAndDays: React.FC<IProps> = ({ starting_date, ending_date, pricePerNightInCents, children }) => {
    const pricePerNight = Math.abs(pricePerNightInCents/100)

    const start = new Date(ending_date)
    const end = new Date(starting_date)
    const totalDays = differenceInDays(start, end)

    const totalPrice = Math.abs(totalDays * pricePerNightInCents)/100

    const pluralizeDays = totalDays > 1 ? "days" : "day"

    return (
        <>
            <span className='d-block text-dark fw-bolder'>Total</span>
            <ul className='list-unstyled'>
                <li><span className="d-block">${pricePerNight} per night</span></li>
                <li>
                    <span className="text-dark">${totalPrice}</span>
                    <span> for </span>
                    <span className="text-dark">{totalDays} {pluralizeDays}</span>
                </li>
                <li>{ children }</li>
            </ul>
        </>
    )
}

export default TotalPriceAndDays
