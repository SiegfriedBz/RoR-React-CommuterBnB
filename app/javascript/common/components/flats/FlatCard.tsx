import React from 'react'
import { Link } from 'react-router-dom'
import { useFetch } from '../../hooks'
import { useAppContext, useUserContext, useFlatsContext } from '../../contexts'
import { FlatCardCarousel, FlatRating } from "../../components/flats"
import {ButtonSlide} from '../buttons'
import { LoadingSpinners } from '../../components'
import { IFlat } from '../../utils/interfaces'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHouse, faDollarSign, faHeart, faEye } from '@fortawesome/free-solid-svg-icons'


interface IProps {
    flat?: IFlat,
    flatCardOnMap?: boolean
}

const FlatCard: React.FC<IProps> = ({ flat, flatCardOnMap }) => {
    //* props
    const { flatId, title, city, country, pricePerNightInCents, isUserFavorite } = flat
    const address = `${city}, ${country}`

    //* hooks & context
    const { addFlatToUserFavorites, removeFlatFromUserFavorites } = useFetch()
    const { setFlashMessage } = useAppContext()
    const { user } = useUserContext()
    const { flats, updateFlatInContext } = useFlatsContext()

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

    if(!flat) return <LoadingSpinners />
    
    return (
        <div className={`flat-card--wrapper ${flatCardOnMap ? "flat-card-on-map" : ""} h-100`}>
            <div className="flat-card--body card-body">
                <h6 className="fw-bolder">{title}</h6>
                <div className="d-flex justify-content-between align-content-center">
                    { address && 
                        <span className="card-text text-center">
                            <FontAwesomeIcon className=" text-dark" icon={faHouse} />
                            {" "}{address}
                        </span>
                    }
                    {/* handle favorites */}
                    { user?.userId &&
                        <span 
                            className={"card-text"}
                            onClick={() => {
                                isUserFavorite ?
                                handleRemoveFromFavorites(flatId)
                                : handleAddToFavorites(flatId)
                            }}
                        >
                            <FontAwesomeIcon 
                                className={`icon ${isUserFavorite ? "text-danger" : "text-dark"}`} 
                                icon={faHeart} 
                            />
                        </span>
                    }
                </div>
            </div>
            { flat?.images && <FlatCardCarousel key={flatId} images={flat.images} className="card-img-top" />}
            <div className="flat-card--link card-footer bg-transparent border-light-subtle">
                <div className="d-flex justify-content-between align-content-center">
                    <span className="card-text my-auto">
                        <FlatRating flatRating={flat?.averageRating} />
                    </span>
                    <span className="card-text text-primary my-auto">
                            <FontAwesomeIcon icon={faDollarSign} />
                            {pricePerNightInCents/100}
                    </span>
                </div>
                <Link 
                    to={`/properties/${flatId}`} 
                >   
                     <ButtonSlide
                        className="btn-slide-sm btn-slide-primary top-slide fw-bolder w-100 mt-2"
                        >
                        <FontAwesomeIcon icon={faEye} />
                        {" "}Visit
                    </ButtonSlide>
                </Link>
            </div>
        </div>
    )
}

export default FlatCard
