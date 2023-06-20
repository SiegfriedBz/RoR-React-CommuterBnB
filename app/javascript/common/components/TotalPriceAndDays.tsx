import React from 'react'
import { differenceInDays } from 'date-fns'

const TotalPriceAndDays = (props) => {
    const { starting_date, ending_date, pricePerNightInCents, children } = props
    
    const pricePerNight = Math.abs(pricePerNightInCents/100)

    const start = new Date(ending_date)
    const end = new Date(starting_date)
    const totalDays = differenceInDays(start, end)

    const totalPrice = Math.abs(totalDays * pricePerNightInCents)/100

    const pluralizeDays = totalDays > 1 ? "days" : "day"

    return (
        <>
            <span className='d-block text-info fw-bolder'>Total</span>
            <ul className='ps-3'>
                <li><span className="d-block">${pricePerNight} per night</span></li>
                <li>
                    <span className="text-info">${totalPrice}</span>
                    <span> for </span>
                    <span className="text-info">{totalDays} {pluralizeDays}</span>
                </li>
               { children }
            </ul>
        </>
    )
}

export default TotalPriceAndDays
