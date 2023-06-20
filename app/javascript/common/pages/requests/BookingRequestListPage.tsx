import React, { useRef, useState, useEffect } from 'react'
import { useFetch } from '../../hooks'
import { useAppContext, useBookingRequestsContext } from '../../contexts'
import { FlashMessage } from '../../components'
import { BookingRequestCard } from '../../components/requests'
import { MessageFormModalWrapper } from '../../components/messages'
import MapView from '../../components/map/MapView'

const BookingRequestListPage: React.FC = () => {
    //* hooks
    const topRef = useRef(null)
    const { getUserTransactionRequests } = useFetch()

    //* contexts
    const { flashMessage } = useAppContext()
    const { bookingRequests, setBookingRequests } = useBookingRequestsContext()

    //* state
    // fly to flat map marker when flat is selected 
    const [mapSelectedFlatId, setMapSelectedFlatId] = useState<number | undefined>(undefined)
    // handle modal send message form
    const [modalIsOpen, setModalIsOpen] = useState(false)
    const [messageRecipientId, setMessageRecipientId] = useState<number | undefined>(undefined)
    const [messageFlatId, setMessageFlatId] = useState<number | undefined>(undefined)
    const [messageTransactionRequestId, setMessageTransactionRequestId] = useState<number | undefined>(undefined)

    //* effects
    useEffect(() => {
      (async () => {
        await getAllTransactionRequests()
      })()
    }, [])

    const getAllTransactionRequests = async() => {
      const fetchedTransactionRequests = await getUserTransactionRequests()        
      if (!fetchedTransactionRequests) return

      const [response, data] = fetchedTransactionRequests
      if(!data) return

      setBookingRequests(data.transaction_requests)
    }

    //* methods
    const handleSendMessage = (messageRecipientId: number, messageFlatId: number, messageTransactionRequestId: number) => {
      setMessageRecipientId(messageRecipientId)
      setMessageFlatId(messageFlatId)
      setMessageTransactionRequestId(messageTransactionRequestId)
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
          {flashMessage.message && <FlashMessage {...flashMessage} />}
          <div className="row">
            {bookingRequests.length === 0 ?
              ( <span className="d-block my-1">You don't have active booking requests yet,
                <span className="text-info fw-bolder"> start exploring the properties on the map
                </span>
                </span>
              )
              :
              ( <div className={`col-12 ${bookingRequests.length > 0 && "col-xl-6"}`}>
                {bookingRequests?.map((bookingRequest) => {
                  return (
                    <BookingRequestCard
                        key={bookingRequest.transactionRequestId}
                        transactionRequest={bookingRequest}
                        setMapSelectedFlatId={setMapSelectedFlatId}
                        handleSendMessage={handleSendMessage}
                    />
                  )
                })}
              </div>
              )
            }
            <div className={`col-12 ${bookingRequests.length > 0 && "col-xl-6"}`}>
              <div className='sticky-sm-top'>
                <MapView mapHeight={700} mapSelectedFlatId={mapSelectedFlatId} />
                <div className='d-flex justify-content-end mt-1'>
                  <button className="btn bi-arrow-up btn-primary" onClick={scrollToTop}>Scroll</button>
                </div>
              </div>
            </div>
          </div>
        </>
    )
}

export default BookingRequestListPage
