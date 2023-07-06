import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFontAwesome, faHouse, faArrowUpShortWide, faMoneyBill, faDollarSign } from '@fortawesome/free-solid-svg-icons'
import { useAppContext } from '../../contexts'
import { LoadingSpinners } from '../../components'
import FlatCategoryEnum from '../../utils/constants/flatCategoryEnum'
import { IFlat } from '../../utils/interfaces'

const FlatDescription: React.FC<IFlat> = ({ flat }) => {
    const { isLoading } = useAppContext()
  
    if(isLoading || !flat) return <LoadingSpinners />

    const { title, description, city, country, pricePerNightInCents, category } = flat
    const address = `${city}, ${country}`

    const flatCategory = category === FlatCategoryEnum.ENTIRE_PLACE_SERVER ?
        FlatCategoryEnum.ENTIRE_PLACE
        : FlatCategoryEnum.PRIVATE_ROOM

    return (
        <>
            <h1>{title}</h1>
            <h3>
                <FontAwesomeIcon className="text-primary" icon={faFontAwesome} />
                {" "}{description}
            </h3>
            <span className="d-block">
                <FontAwesomeIcon className="text-primary" icon={faHouse} />
                {" "}{address}
            </span>
            <span className="d-block my-1">
                <FontAwesomeIcon className="text-primary" icon={faArrowUpShortWide} />
                {" "}{flatCategory}
            </span>
            <span className="d-block">
                <FontAwesomeIcon className="text-primary" icon={faMoneyBill} />
                {" "}<FontAwesomeIcon icon={faDollarSign} />
                {pricePerNightInCents/100} per night
            </span>
        </>
    )
}

export default FlatDescription
