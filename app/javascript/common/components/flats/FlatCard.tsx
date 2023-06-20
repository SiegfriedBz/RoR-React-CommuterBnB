import React from 'react'
import { Link } from 'react-router-dom'
import { IFlat } from '../../utils/interfaces'
import FlatCardCarousel from './FlatCardCarousel'

const FlatCard: React.FC<IFlat> = ({ flat }) => {
    return (
        <div className="flat-card--wrapper h-100">
            <div className="flat-card--info card-body">
                <h6 className="card-title text-info fw-bolder">{flat.title}</h6>
                <div className="d-flex justify-content-between align-content-center">
                    <span className="card-text justify-content-start">{flat.address}</span>
                    <span className="card-text">$ {flat.pricePerNightInCents/100}</span>
                </div>
            </div>
            {flat?.images && <FlatCardCarousel key={flat.flatId} flat={flat} className="card-img-top" />}
            <div className="flat-card--link card-footer bg-transparent border-light-subtle">
                <Link to={`/properties/${flat.flatId}`} className="btn btn-sm btn-outline-primary w-100 mt-2">Visit property</Link>
            </div>
        </div>
    )
}

export default FlatCard
