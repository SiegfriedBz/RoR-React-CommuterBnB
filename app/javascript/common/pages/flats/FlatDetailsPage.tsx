import React from 'react'
import { useParams, useNavigate, Navigate, Link } from 'react-router-dom'
import { useFetch } from '../../hooks'
import { useAppContext, useUserContext, useFlatsContext, useBookingRequestsContext } from '../../contexts'
import { HostedBy } from '../../components'
import { FlatDescription, FlatCardCarousel, FlatImageGrid } from '../../components/flats'
import MapView from '../../components/map/MapView'
import { IFlat } from '../../utils/interfaces'

const FlatDetailsPage: React.FC = () => {
    // hooks
    const { deleteFlat } = useFetch()
    const navigate = useNavigate()
    const { id: selectedFlatId } = useParams()

    // contexts
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

    // user is owner
    const handleDeleteFlat = async () => {
        window.confirm("Are you sure you want to delete this flat?")

        const fetchedData = await deleteFlat(selectedFlatId)
        
        if(fetchedData) {
            navigate('/')
            deleteFlatInContext(flatId)
        } else {
            setFlashMessage({ message: 'Something went wrong, please try again', type: "warning" })
            setTimeout(() => {
                setFlashMessage({ message: null, type: "success" })
            }, 1500)
        }
    }

    return (
        <div>
            <FlatDescription flat={flat} />
            <div className="my-2">
                {currentUserIsOwner &&
                    <>
                        <span className="fw-bolder text-info d-block">You own this property</span>
                        <Link to={`/edit-property/${flatId}`} className="btn btn-outline-primary me-2">Update my property</Link>
                        <button 
                            type="button" 
                            onClick={handleDeleteFlat}
                            className="btn btn-outline-danger"
                            >Delete my property
                        </button>
                    </>
                }
            </div>
            
            {/* {bookingRequests.length > 0 && */}
                <button
                    onClick={() => {
                        return navigate('/my-booking-requests')
                    }}
                    className="btn btn-outline-primary mt-2 mb-3"
                >
                    Back to booking request
                </button>
            {/* } */}

            <div className="row row-gap-1 row-cols-1 row-cols-md-2 mb-3">
                <div className="col">
                <FlatCardCarousel images={flat?.images} />
                </div>
                <div className="col">
                    <FlatImageGrid flat={flat} />
                </div>
            </div>
            
            <div className="mb-3">
                <MapView mapSelectedFlatId={selectedFlatId} mapHeight={400} />
            </div>

            <div className="row mb-2">
                <HostedBy />
            </div>

            <div className="mb-3">
            {currentUserIsOwner ? 
                <Link 
                    to="/my-profile"
                    className="btn btn-outline-primary"
                    >Update my profile
                </Link>
                : 
                <Link 
                    to="requests"
                    className="btn btn-outline-primary"
                    >Contact Host & Book
                </Link>
            }
            </div>
        </div>
    )
}

export default FlatDetailsPage
