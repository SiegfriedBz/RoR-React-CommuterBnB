import React, { useRef, useState, useEffect } from 'react'
import { useLocation, Link } from 'react-router-dom'
import { useFetch } from '../../hooks'
import { useBookingsContext } from '../../contexts'
import BookingRequestCard from './components/BookingRequestCard'
import MapView from '../../components/map/MapView'
import { ButtonSlide, ButtonScrollToTop } from '../../components/buttons/'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHouse, faEye } from '@fortawesome/free-solid-svg-icons'
import { IBookingRequest } from "../../utils/interfaces"

const BookingRequestListPage: React.FC = () => {
    //* hooks
    const location = useLocation()
    const { getUserBookingRequests } = useFetch()
    const topRef = useRef(null)
    const mapRef = useRef(null)
    const cardRef = useRef(null)
    const containerRef = useRef(null)

    //* context
    const { bookingRequests, setBookingRequests } = useBookingsContext()

    //* state
    // transactionRequestId selected from /my-messages || /properties/:id
    const [cardRefSelectedId, setCardRefSelectedId] = useState<number | undefined>(undefined)
    // fly to flat map marker when flat is selected from a BookingRequestCard
    const [mapSelectedFlatId, setMapSelectedFlatId] = useState<number | undefined>(undefined)
    //  showOnlyPending bookings
    const [showOnlyPending, setShowOnlyPending] = useState(false)
    // containerWidth for modal
    const [containerWidth, setContainerWidth] = useState(undefined)
    
    //* effects
    // fetch all transaction requests and set them in context
    useEffect(() => {
      (async () => {
        await getAllTransactionRequests()
      })()
    }, [])
    
    // set cardRef on card w/ transactionRequestId selected from /my-messages || /properties/:id
    useEffect(() => {
      if(bookingRequests.length === 0 || !location?.state?.selectedBookingRequestId) return
      
      const selectedBookingRequestId = location.state?.selectedBookingRequestId
      
      setCardRefSelectedId(selectedBookingRequestId)
    }, [bookingRequests, location])

    // scroll to card w/ transactionRequestId === cardRefSelectedId
    useEffect(() => {
      if(bookingRequests.length === 0 || !cardRefSelectedId) return 
      
      cardRef?.current.goIntoView()

    }, [bookingRequests, cardRefSelectedId])

    // containerWidth for modal
    useEffect(() => {
      const containerWidth = containerRef?.current?.offsetWidth
      if(!containerWidth) return 

      setContainerWidth(containerWidth)
    }, [])

    //* helpers
    const getAllTransactionRequests = async() => {
      const fetchedBookingRequests = await getUserBookingRequests()        
      if (!fetchedBookingRequests) return

      const [response, data] = fetchedBookingRequests
      if(!data) return

      const bookingRequests: IBookingRequest[] | undefined = data?.transaction_requests
      if(!bookingRequests) return

      setBookingRequests(bookingRequests)
    }

    const scrollToTop = () => {
      topRef.current.scrollIntoView({ behavior: 'smooth' })
    }

    // scroll to map on mobile
    const scrollToMap = () => {
      mapRef.current.scrollIntoView({ behavior: 'smooth' })
    }

    const selectedBookingRequests = showOnlyPending ?
      bookingRequests.filter(bookingRequest => bookingRequest.status === 'pending')
      : bookingRequests

    if(bookingRequests.length === 0) {
      return (
        <div className="text-center">
          <Link to="/" replace={true} className="text-primary fs-5 text-decoration-none mb-2">
            <FontAwesomeIcon icon={faHouse} />
            {" "}<span className="d-block text-primary fs-5">Start contacting members to rent or swap your property</span>
          </Link>
          <MapView />
        </div>
      )
    }
    
    return (
        <div ref={containerRef}>
          <div ref={topRef} className="d-flex justify-content-center w-100 mt-2 mb-3">
            <ButtonSlide
              className="fs-5 btn-slide btn-slide-primary bottom-slide"
              onClick={() => setShowOnlyPending(!showOnlyPending)}
            >
              <FontAwesomeIcon icon={faEye} />
              {" Show "}{showOnlyPending ? "all booking requests" : "only pending booking requests"} 
            </ButtonSlide>
          </div>

          <div className="row row-cols-1 row-cols-xl-2 mx-auto">

            {/* ( <div className={`mx-auto ${selectedBookingRequests.length > 0 && "row row-cols-1 row-cols-lg-2 gb-2gx-lg-2 row-cols-xl-1 gx-xl-0"}`}> */}
            <div className={`mx-auto col`}>
              {selectedBookingRequests?.map((bookingRequest) => {
                return (
                  <BookingRequestCard
                      key={bookingRequest.transactionRequestId}
                      ref={bookingRequest.transactionRequestId === cardRefSelectedId ? cardRef : null}
                      transactionRequest={bookingRequest}
                      setMapSelectedFlatId={setMapSelectedFlatId}
                      scrollToMap={scrollToMap}
                      containerWidth={containerWidth}
                  />
                )
              })}
            </div>
            
            {/* <div className={`mx-auto col ${selectedBookingRequests.length > 0 && "col"}`}> */}
            <div className={`mx-auto col`}>
              <div className='sticky-top'>
                <div ref={mapRef}>
                  <MapView selectedFlatId={mapSelectedFlatId} mapHeight={700} />
                </div>
                <ButtonScrollToTop scrollToTop={scrollToTop} />
              </div>
            </div>
          </div>
        </div>
    )
}

export default BookingRequestListPage
