import React from 'react'
import { Link } from 'react-router-dom'
import FlatCardCarousel from './FlatCardCarousel'
import { IFlat } from '../../utils/interfaces'

const FlatCard: React.FC<IFlat> = ({ flat }) => {
    const { flatId, title, city, country, pricePerNightInCents } = flat
    const address = `${city}, ${country}`

    return (
        <div className="flat-card--wrapper h-100">
            <div className="flat-card--info card-body">
                <h6 className="card-title text-info fw-bolder">{title}</h6>
                <div className="d-flex justify-content-between align-content-center">
                    {address && <span className="card-text justify-content-start">{address}</span>}
                    <span className="card-text">$ {pricePerNightInCents/100}</span>
                </div>
            </div>
            {flat?.images && <FlatCardCarousel key={flatId} images={flat.images} className="card-img-top" />}
            <div className="flat-card--link card-footer bg-transparent border-light-subtle">
                <Link 
                    to={`/properties/${flatId}`} 
                    className="btn btn-sm btn-outline-primary w-100 mt-2"
                >Visit property
                </Link>
            </div>
        </div>
    )
}

export default FlatCard
