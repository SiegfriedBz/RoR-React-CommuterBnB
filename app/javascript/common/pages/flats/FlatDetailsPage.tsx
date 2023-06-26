import React from 'react'
import { useParams, useNavigate, Navigate, Link } from 'react-router-dom'
import { useFetch } from '../../hooks'
import { useAppContext, useUserContext, useFlatsContext, useBookingRequestsContext } from '../../contexts'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faReceipt, faCalendarDays, faTrashCan, faCloudArrowUp } from '@fortawesome/free-solid-svg-icons'
import { HostedBy } from '../../components'
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
        window.confirm("Are you sure you want to delete this flat?")

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
                            className="btn btn-outline-dark me-2"
                            >
                                <FontAwesomeIcon icon={faCloudArrowUp} />
                                {" "}Update my property
                            </Link>
                        <button 
                            type="button" 
                            onClick={handleDeleteFlat}
                            className="btn btn-outline-danger"
                            >
                                <FontAwesomeIcon icon={faTrashCan} />
                                {" "}Delete my property
                        </button>
                    </>
                }
            </div>
            
            {/* {bookingRequests.length > 0 && */}
                <button
                    onClick={() => {
                        return navigate('/my-booking-requests')
                    }}
                    className="btn btn-outline-dark mt-2 mb-3"
                >   <FontAwesomeIcon icon={faReceipt} />
                    {" "}Back to booking requests
                </button>
            {/* } */}

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
                    className="btn btn-outline-dark"
                    >
                        <FontAwesomeIcon icon={faCloudArrowUp} />
                        {" "}Update my profile
                </Link>
                : 
                <Link 
                    to="requests"
                    className="btn btn-outline-dark"
                    >
                        <FontAwesomeIcon icon={faCalendarDays} />
                        {" "}Contact Host & Book property
                </Link>
            }
            </div>
        </div>
    )
}

export default FlatDetailsPage
