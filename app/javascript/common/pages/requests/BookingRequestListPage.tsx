import React, { useRef, createRef, useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { useFetch } from '../../hooks'
import { useAppContext, useBookingRequestsContext } from '../../contexts'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowUpRightDots } from '@fortawesome/free-solid-svg-icons'
import { FlashMessage } from '../../components'
import { BookingRequestCard } from '../../components/requests'
import { MessageFormModalWrapper } from '../../components/messages'
import MapView from '../../components/map/MapView'
import { IBookingRequest } from "../../utils/interfaces"

const BookingRequestListPage: React.FC = () => {
    //* hooks
    const location = useLocation()
    const { getUserTransactionRequests } = useFetch()
    const topRef = useRef(null)
    const cardRef = useRef(null)

    //* context
    const { flashMessage } = useAppContext()
    const { bookingRequests, setBookingRequests } = useBookingRequestsContext()

    //* state
    // transactionRequestId selected from /my-messages || /properties/:id
    const [cardRefSelectedId, setCardRefSelectedId] = useState<number | undefined>(undefined)
    // fly to flat map marker when flat is selected from a BookingRequestCard
    const [mapSelectedFlatId, setMapSelectedFlatId] = useState<number | undefined>(undefined)
    // send-message form modal
    const [modalIsOpen, setModalIsOpen] = useState(false)
    // message
    const [messageRecipientId, setMessageRecipientId] = useState<number | undefined>(undefined)
    const [messageFlatId, setMessageFlatId] = useState<number | undefined>(undefined)
    const [messageTransactionRequestId, setMessageTransactionRequestId] = useState<number | undefined>(undefined)

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

    //* helpers
    const getAllTransactionRequests = async() => {
      const fetchedBookingRequests = await getUserTransactionRequests()        
      if (!fetchedBookingRequests) return

      const [response, data] = fetchedBookingRequests
      if(!data) return

      const bookingRequests: IBookingRequest[] | undefined = data?.transaction_requests
      if(!bookingRequests) return

      setBookingRequests(bookingRequests)
    }

    const handleSendMessage = (messageRecipientId: number, messageFlatId: number, messageTransactionRequestId: number) => {
      // set message
      setMessageRecipientId(messageRecipientId)
      setMessageFlatId(messageFlatId)
      setMessageTransactionRequestId(messageTransactionRequestId)
      // open send-message modal
      toggleModal()
    }

    const toggleModal = () => {
      setModalIsOpen(prev => !prev)
    }

    const scrollToTop = () => {
      topRef.current.scrollIntoView({ behavior: 'smooth' })
    }
    
    return (
        <>
          <MessageFormModalWrapper 
            modalIsOpen={modalIsOpen}
            toggleModal={toggleModal}
            messageRecipientId={messageRecipientId}
            messageFlatId={messageFlatId}
            messageTransactionRequestId={messageTransactionRequestId}
          />
          <h3 ref={topRef}>Booking requests</h3>
          { flashMessage.message && <FlashMessage {...flashMessage} /> }

          <div className="row">
            {bookingRequests.length === 0 ?
              ( <span className="d-block my-1">You don't have active booking requests yet,
                  <span className="text-dark fw-bolder"> start exploring the properties on the map</span>
                </span>
              )
              :
              ( <div className={`col-12 ${bookingRequests.length > 0 && "col-xl-6"}`}>
                {bookingRequests?.map((bookingRequest) => {
                  return (
                    <BookingRequestCard
                        key={bookingRequest.transactionRequestId}
                        ref={bookingRequest.transactionRequestId === cardRefSelectedId ? cardRef : null}
                        transactionRequest={bookingRequest}
                        handleSendMessage={handleSendMessage}
                        setMapSelectedFlatId={setMapSelectedFlatId}
                    />
                  )
                })}
              </div>
              )
            }
            <div className={`col-12 ${bookingRequests.length > 0 && "col-xl-6"}`}>
              <div className='sticky-top'>
                <MapView selectedFlatId={mapSelectedFlatId} mapHeight={700} />
                <div className='d-flex justify-content-end mt-1'>
                  <button 
                    className="btn text-white fw-bolder btn-primary"
                    onClick={scrollToTop}
                  >
                    <FontAwesomeIcon icon={faArrowUpRightDots} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
    )
}

export default BookingRequestListPage
