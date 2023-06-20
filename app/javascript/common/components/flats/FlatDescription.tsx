import React from 'react'
import FlatCategoryEnum from '../../utils/constants/flatCategoryEnum'

const FlatDescription = ({ flat }) => {
    const { title, description, address, category, pricePerNightInCents } = flat

    const flatCategory = category === FlatCategoryEnum.ENTIRE_PLACE_SERVER ?
    FlatCategoryEnum.ENTIRE_PLACE
    : FlatCategoryEnum.PRIVATE_ROOM

    return (
        <>
            <h2 className="text-info">{title}</h2>
            <p className="fw-bold">{description}</p>
            <span className="d-block">{address}</span>
            <span className="d-block">Category: {flatCategory}</span>
            <span className="d-block">Price per night: ${pricePerNightInCents/100}</span>
        </>
    )
}

export default FlatDescription
