import React from 'react'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faStar, faHouse, faDollarSign } from '@fortawesome/free-solid-svg-icons'
import FlatCardCarousel from './FlatCardCarousel'
import { IFlat } from '../../utils/interfaces'

interface IProps {
    flat: IFlat,
    flatCardOnMap?: boolean
}

const FlatCard: React.FC<IProps> = ({ flat, flatCardOnMap }) => {
    const { flatId, title, city, country, pricePerNightInCents } = flat
    const address = `${city}, ${country}`

    return (
        <div className={`flat-card--wrapper ${flatCardOnMap ? "flat-card-on-map" : ""} h-100`}>
            <div className="flat-card--dark card-body">
                <h6 className="card-title text-dark fw-bolder">{title}</h6>
                    {   address && 
                        <span className="card-text text-center">
                            <FontAwesomeIcon icon={faHouse} />
                            {" "}{address}
                        </span>
                    }

            </div>
            {flat?.images && <FlatCardCarousel key={flatId} images={flat.images} className="card-img-top" />}
            <div className="flat-card--link card-footer bg-transparent border-light-subtle">
                <div className="d-flex justify-content-between align-content-center">
                    <span className="card-text text-warning">
                            <FontAwesomeIcon icon={faStar} />
                            <FontAwesomeIcon icon={faStar} />
                            <FontAwesomeIcon icon={faStar} />
                            <FontAwesomeIcon icon={faStar} />
                            <FontAwesomeIcon icon={faStar} />
                    </span>
                    <span className="card-text">
                            <FontAwesomeIcon icon={faDollarSign} />
                            {pricePerNightInCents/100}
                    </span>
                </div>
                <Link 
                    to={`/properties/${flatId}`} 
                    className="btn btn-sm btn-outline-dark w-100 mt-2"
                >Visit
                </Link>
            </div>
        </div>
    )
}

export default FlatCard
