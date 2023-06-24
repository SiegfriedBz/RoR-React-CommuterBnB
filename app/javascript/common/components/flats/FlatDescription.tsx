import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFontAwesome, faHouse, faArrowUpShortWide, faMoneyBill, faDollarSign } from '@fortawesome/free-solid-svg-icons'
import FlatCategoryEnum from '../../utils/constants/flatCategoryEnum'
import { IFlat } from '../../utils/interfaces'

const FlatDescription: React.FC<IFlat> = ({ flat }) => {
    const { title, description, city, country, pricePerNightInCents, category } = flat
    const address = `${city}, ${country}`

    const flatCategory = category === FlatCategoryEnum.ENTIRE_PLACE_SERVER ?
    FlatCategoryEnum.ENTIRE_PLACE
    : FlatCategoryEnum.PRIVATE_ROOM

    return (
        <>
            <h3 className="text-dark">{title}</h3>
            <p className="fw-bold">
                <FontAwesomeIcon icon={faFontAwesome} />
                {" "}{description}
            </p>
            <span className="d-block">
                <FontAwesomeIcon icon={faHouse} />
                {" "}{address}
            </span>
            <span className="d-block">
                <FontAwesomeIcon icon={faArrowUpShortWide} />
                {" "}{flatCategory}
            </span>
            <span className="d-block">
                <FontAwesomeIcon icon={faMoneyBill} />
                {" "}<FontAwesomeIcon icon={faDollarSign} />
                {pricePerNightInCents/100} per night
            </span>
        </>
    )
}

export default FlatDescription
