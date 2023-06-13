import React from 'react'
import { useParams } from 'react-router-dom'
import { useFlatsContext } from '../contexts'

const FlatDetailsPage: React.FC = () => {
    const { id } = useParams()
    const { flats } = useFlatsContext()

    if(!flats) return null
    if(!id) return null

    const flat = flats.find(flat => flat.flatId === parseInt(id))
    if(!flat) return null

    console.log("FlatDetailsPage flat", flat)

    const { ownerId, title, description, address, longitude, latitude } = flat

    // 1. render flat with infos fetched from context (from previous getAllFlats fetch)
    // 2. fetch flat details from backend (getFlatWithOwnerDetailsAndFlatReviews) + update context for this flat
    // 2': render loading spinners for flat details not yet fetched
    // 3. render flat with infos fetched from backend

    return (
        <div>
            <h1>FlatDetailsPage</h1>
            <h2>{title}</h2>
            <p>{description}</p>
            <p>{address}</p>
            <p>{longitude}</p>
            <p>{latitude}</p>
        </div>
    )
}

export default FlatDetailsPage