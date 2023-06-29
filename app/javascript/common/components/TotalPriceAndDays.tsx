import React from 'react'

interface IProps {
    pricePerNight: number,
    totalPriceInCents: number,
    totalDays: number,
    children?: React.ReactNode
}

const TotalPriceAndDays: React.FC<IProps> = (props) => {
    const { pricePerNight, totalPriceInCents, totalDays, children } = props
    
    const pluralizeDays = totalDays > 1 ? "days" : "day"

    return (
        <>
            <span className='d-block text-dark fw-bolder'>Total</span>
            <ul className='list-unstyled'>
                <li><span className="d-block">${pricePerNight} per night</span></li>
                <li>
                    <span className="text-dark">${totalPriceInCents/100}</span>
                    <span> for </span>
                    <span className="text-dark">{totalDays} {pluralizeDays}</span>
                </li>
                <li>{ children }</li>
            </ul>
        </>
    )
}

export default TotalPriceAndDays
