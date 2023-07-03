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
        <div className="d-flex flex-column">
            <span className="d-block">${pricePerNight} per night</span>
            <span className="d-block">
            <span className="text-success fw-bold">${totalPriceInCents/100}</span>
                <span> for </span>
                <span className="text-success fw-bold">{totalDays} {pluralizeDays}</span>
            </span>
            <div>{ children }</div>
        </div>
    )
}

export default TotalPriceAndDays
