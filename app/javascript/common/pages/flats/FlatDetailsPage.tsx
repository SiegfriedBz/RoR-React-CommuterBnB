import React, { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate, Navigate, Link } from 'react-router-dom'
import { useFetch } from '../../hooks'
import { useAppContext, useUserContext, useFlatsContext, useBookingsContext } from '../../contexts'
import FlatReviewsList from './components/FlatReviewsList'
import { FlatDescription, FlatCardCarousel, FlatImageGrid, FlatHostedBy, FlatRating } from '../../components/flats'
import MapView from '../../components/map/MapView'
import { LoadingSpinners } from '../../components'
import { IFlat } from '../../utils/interfaces'
import { ButtonSlide } from '../../components/buttons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faReceipt, faCalendarDays, faTrashCan, faCloudArrowUp } from '@fortawesome/free-solid-svg-icons'

const FlatDetailsPage: React.FC = () => {
    //* hooks & context
    const { id: selectedFlatId } = useParams()
    const navigate = useNavigate()
    const { getFlatDetails, deleteFlat } = useFetch()
    const { user } = useUserContext()
    const { updateFlatInContext, deleteFlatInContext } = useFlatsContext()
    const { isLoading, setFlashMessage } = useAppContext()

    {/* TO FIX/UPDATE  */}
    // const { bookingRequests } = useBookingsContext()
    {/*  */}

    //* state
    const [flat, setFlat] = useState<IFlat | undefined>(undefined)
    const [currentUserIsOwner, setCurrentUserIsOwner] = useState<boolean>(false)

    // fetch flat details from server
    useEffect(() => {
        (async () => {
            if(!selectedFlatId) return

            const fetchedData = await getFlatDetails(selectedFlatId)
            if(!fetchedData) return
    
            const [response, data] = fetchedData
            if(!data || !data?.flat) return
    
            const updatedFlat = data.flat

            setFlat(updatedFlat)
            updateFlatInContext(updatedFlat)
        })()
    }, [selectedFlatId])

    // check if current user is owner
    useEffect(() => {
        if(!user?.userId || !flat) return

        const currentUserIsOwner = user?.userId === flat?.owner?.userId
        setCurrentUserIsOwner(currentUserIsOwner)
    }, [user, flat])

    //* handlers
    const handleDeleteFlat = async () => {
       if(!window.confirm("Are you sure you want to delete this property?")) return null

        const fetchedData = await deleteFlat(selectedFlatId)
        
        if(fetchedData) {
            navigate('/')
            deleteFlatInContext(flat?.flatId)
        } else {
            setFlashMessage({ message: 'Something went wrong, please try again', type: "warning" })
        }
    }

    if(!selectedFlatId) return <Navigate to="/" replace={true} />

    if(isLoading || !flat) return <LoadingSpinners />

    return (
        <div>
            <FlatDescription flat={flat} />
            <div className="my-2">
                { currentUserIsOwner &&
                    <>
                        <span className="fw-bolder text-dark d-block">You own this property</span>
                        <Link 
                            to={`/edit-property/${flat?.flatId}`}
                            >
                                 <ButtonSlide
                                    className="btn-slide btn-slide-blue top-slide me-2"
                                 >
                                    <FontAwesomeIcon icon={faCloudArrowUp} />
                                    {" "}Update my property
                                </ButtonSlide>
                            </Link>
                        <ButtonSlide 
                            type="button" 
                            onClick={handleDeleteFlat}
                            className="btn-slide btn-slide-red bottom-slide me-2"
                            >
                                <FontAwesomeIcon icon={faTrashCan} />
                                {" "}Delete my property
                        </ButtonSlide>
                    </>
                }
            </div>
            
            {/* {bookingRequests.length > 0 && */}
                <ButtonSlide
                    onClick={() => {
                        return navigate('/my-booking-requests')
                    }}
                    className="btn-slide btn-slide-primary left-slide mt-2 mb-3"
                >   <FontAwesomeIcon icon={faReceipt} />
                    {" "}Back to booking requests
                </ButtonSlide>

            {/* images */}
            <div className="row row-gap-1 row-cols-1 row-cols-md-2 mb-3">
                <FlatCardCarousel images={flat?.images} className="col"/>
                <FlatImageGrid images={flat?.images} className="col"/>
            </div>
            <MapView selectedFlatId={selectedFlatId} mapHeight={400} className="mb-3" />
            <FlatHostedBy hostFlat={flat} className="row mb-2"/>
            <div className="mb-3">
            { currentUserIsOwner ? 
                <Link 
                    to="/my-profile"
                    >
                        <ButtonSlide
                            className="btn-slide btn-slide-blue top-slide"
                        >
                            <FontAwesomeIcon icon={faCloudArrowUp} />
                            {" "}Update my profile
                        </ButtonSlide>
                </Link>
                : 
                <Link 
                    to="requests"
                    >
                        <ButtonSlide
                        className="btn-slide btn-slide-primary right-slide"
                        >
                            <FontAwesomeIcon icon={faCalendarDays} />
                            {" "}Contact Host & Book property
                        </ButtonSlide>
                </Link>
            }
            </div>
            <div>
                <h2>Reviews</h2>
                <FlatRating flatRating={flat?.averageRating} />
                <br/>
                <FlatReviewsList flatReviews={flat?.reviews} />
            </div>
        </div>
    )
}

export default FlatDetailsPage
