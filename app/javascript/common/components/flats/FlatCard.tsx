import React from 'react'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faStar, faHouse, faDollarSign, faHeart } from '@fortawesome/free-solid-svg-icons'
import { useFetch } from '../../hooks'
import { useAppContext, useUserContext, useFlatsContext } from '../../contexts'
import FlatCardCarousel from './FlatCardCarousel'
import { IFlat } from '../../utils/interfaces'

interface IProps {
    flat: IFlat,
    flatCardOnMap?: boolean
}

const FlatCard: React.FC<IProps> = ({ flat, flatCardOnMap }) => {
    const { addFlatToUserFavorites, removeFlatFromUserFavorites } = useFetch()
    const { setFlashMessage } = useAppContext()
    const { user } = useUserContext()
    const { flats, updateFlatInContext } = useFlatsContext()
    const { flatId, title, city, country, pricePerNightInCents, isUserFavorite } = flat
    const address = `${city}, ${country}`

    //* handlers
    const handleAddToFavorites = async(flatId: number) => {
        if(!user.userId) return

        const fetchedData = await addFlatToUserFavorites(flatId)
        if (!fetchedData) return

        const [response, data] = fetchedData
        if(!data?.favoriteFlat) return

        // update flat in context
        updateFlatInContext(data.favoriteFlat)
        // show notification
        setFlashMessage({message: "Property successfully added to favorites", type: "success"})
    }

    const handleRemoveFromFavorites = async(flatId: number) => {
        if(!user.userId) return

        const fetchedData = await removeFlatFromUserFavorites(flatId)
        if (!fetchedData) return

        const [response, data] = fetchedData
        if(!response.ok) return

        const flat = flats.find(flat => flat.flatId === flatId)
        if(!flat) return
        
        const changedFlat: IFlat = { ...flat, isUserFavorite: false }

        // update flat in context
        updateFlatInContext(changedFlat)
        // show notification
        setFlashMessage({message: "Property successfully removed from favorites", type: "success"})
    }

    return (
        <div className={`flat-card--wrapper ${flatCardOnMap ? "flat-card-on-map" : ""} h-100`}>
            <div className="flat-card--dark card-body">
                <h6 className="card-title text-dark fw-bolder">{title}</h6>
                <div className="d-flex justify-content-between align-content-center">
                    {   address && 
                        <span className="card-text text-center">
                            <FontAwesomeIcon icon={faHouse} />
                            {" "}{address}
                        </span>
                    }
                    { user.userId &&
                        <span 
                            className={`card-text ${isUserFavorite ? "text-danger" : ""}`}
                            onClick={() => {
                                isUserFavorite ?
                                handleRemoveFromFavorites(flatId)
                                : handleAddToFavorites(flatId)
                            }}
                        >
                            <FontAwesomeIcon icon={faHeart} />
                        </span>
                    }
                </div>
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
