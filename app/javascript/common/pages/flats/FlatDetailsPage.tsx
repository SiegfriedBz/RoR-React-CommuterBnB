import React from 'react'
import { useParams, useNavigate, Navigate, Link } from 'react-router-dom'
import { useFetch } from '../../hooks'
import { useAppContext, useUserContext, useFlatsContext, useBookingRequestsContext } from '../../contexts'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faReceipt, faCalendarDays, faTrashCan, faCloudArrowUp } from '@fortawesome/free-solid-svg-icons'
import { HostedBy, ButtonSlide } from '../../components'
import { FlatDescription, FlatCardCarousel, FlatImageGrid } from '../../components/flats'
import MapView from '../../components/map/MapView'

const FlatDetailsPage: React.FC = () => {
    //# hooks
    const { deleteFlat } = useFetch()
    const navigate = useNavigate()
    const { id: selectedFlatId } = useParams()

    //# context
    const { setFlashMessage } = useAppContext()
    const { user } = useUserContext()
    const { flats, deleteFlatInContext } = useFlatsContext()

    {/* TO FIX  */}
    // const { bookingRequests } = useBookingRequestsContext()
    {/*  */}

    if(!selectedFlatId) return <Navigate to="/" replace={true} />
    
    const flat = flats.find(flat => flat.flatId === parseInt(selectedFlatId))
    if(!flat) return <Navigate to="/" replace={true}/>

    const { flatId, owner } = flat

    const currentUserIsOwner = user?.userId === owner?.userId

    //# helpers 
    const handleDeleteFlat = async () => {
       if(!window.confirm("Are you sure you want to delete this property?")) return

        const fetchedData = await deleteFlat(selectedFlatId)
        
        if(fetchedData) {
            navigate('/')
            deleteFlatInContext(flatId)
        } else {
            setFlashMessage({ message: 'Something went wrong, please try again', type: "warning" })
        }
    }

    return (
        <div>
            <FlatDescription flat={flat} />
            <div className="my-2">
                { currentUserIsOwner &&
                    <>
                        <span className="fw-bolder text-dark d-block">You own this property</span>
                        <Link 
                            to={`/edit-property/${flatId}`}
                            >
                                 <ButtonSlide
                                    className="btn-slide btn-slide-primary top-slide me-2"
                                 >
                                    <FontAwesomeIcon icon={faCloudArrowUp} />
                                    {" "}Update my property
                                </ButtonSlide>
                            </Link>
                        <ButtonSlide 
                            type="button" 
                            onClick={handleDeleteFlat}
                            className="btn-slide btn-slide-danger bottom-slide me-2"
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
                    className="btn-slide btn-slide-dark left-slide mt-2 mb-3"
                >   <FontAwesomeIcon icon={faReceipt} />
                    {" "}Back to booking requests
                </ButtonSlide>

            {/* images */}
            <div className="row row-gap-1 row-cols-1 row-cols-md-2 mb-3">
                <div className="col">
                    <FlatCardCarousel images={flat?.images} />
                </div>
                <div className="col">
                    <FlatImageGrid images={flat?.images} />
                </div>
            </div>
            
            <div className="mb-3">
                <MapView selectedFlatId={selectedFlatId} mapHeight={400} />
            </div>

            <div className="row mb-2">
                <HostedBy selectedFlatId={selectedFlatId}/>
            </div>

            <div className="mb-3">
            { currentUserIsOwner ? 
                <Link 
                    to="/my-profile"
                    >
                        <ButtonSlide
                            className="btn-slide btn-slide-primary top-slide"
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
        </div>
    )
}

export default FlatDetailsPage
