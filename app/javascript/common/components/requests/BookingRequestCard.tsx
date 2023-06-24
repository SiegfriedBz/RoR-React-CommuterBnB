import React, {
    useState,
    useEffect,
    useRef, 
    forwardRef,
    useImperativeHandle
} from 'react'
import { format, formatDistanceToNow } from 'date-fns'
import { useFetch } from '../../hooks'
import {
    useAppContext,
    useUserContext,
    useFlatsContext,
    useBookingRequestsContext
} from '../../contexts'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrashCan, faPaperPlane } from '@fortawesome/free-solid-svg-icons'
import { FlatCardCarousel } from '../../components/flats'
import { TotalPriceAndDays } from '../../components'
import BookingBy from './BookingBy'
import BookingAgreementSwitches from './BookingAgreementSwitches'
import BookingFlatsDetails from './BookingFlatsDetails'
import BookingGoToPaymentButton from './BookingGoToPaymentButton'
import { IFlat, IBookingRequest } from '../../utils/interfaces'

export interface ITransactionUser {
    userId: number,
    agreedTransaction: boolean,
    isTransactionInitiator: boolean,
    flatId?: number,
    propertyPrice?: number,
    isPayer: boolean
}

interface IProps {
    transactionRequest: IBookingRequest,
    setMapSelectedFlatId: React.Dispatch<React.SetStateAction<number | undefined>>,
    handleSendMessage: (recipientId: number) => void
}

const BookingRequestCard = ({
    transactionRequest,
    setMapSelectedFlatId,
    handleSendMessage }, forwardedRef) => {
    //* props
    const {
        transactionRequestId,
        updatedAt,
        startingDate,
        endingDate,
        exchangePricePerNightInCents,
        responderAgreed,
        initiatorAgreed,
        responderId,
        initiatorId,
        responderFlatId,
        initiatorFlatId
    } = transactionRequest
    
    // //* hooks
    const cardRef = useRef()
    const { deleteTransactionRequest } = useFetch()

    //* contexts
    const { isLoading, setFlashMessage } = useAppContext()
    const { user } = useUserContext()
    const { flats } = useFlatsContext()
    const { setBookingRequests } = useBookingRequestsContext()

    //* state
    const [currentUser, setCurrentUser] = useState<ITransactionUser | undefined>(undefined)
    const [secondUser, setSecondUser] = useState<ITransactionUser | undefined>(undefined)

    const [isExchange, setIsExchange] = useState<boolean>(false)
    const [isPureExchange, setIsPureExchange] = useState<boolean>(false)

    // scrollIntoView forwarded from BookingRequestListPage
    useImperativeHandle(forwardedRef, () => (
        { goIntoView: () => cardRef.current?.scrollIntoView({ behavior: 'smooth' }) }
        )
    )
    
    //* effects
    // set currentUser & secondUser from transactionRequest
    useEffect(() => {
        if(!user || !flats || !transactionRequest) return

        const initiatorFlat: IFlat | undefined = flats.find(flat => flat.flatId === initiatorFlatId)
        const responderFlat: IFlat| undefined = flats.find(flat => flat.flatId === responderFlatId)
        if(!responderFlat) return

        const initiatorFlatPrice: number | undefined = initiatorFlat?.pricePerNightInCents
        const responderFlatPrice: number | undefined  = responderFlat?.pricePerNightInCents

        const isExchange: boolean = typeof initiatorFlat !== "undefined"
        setIsExchange(isExchange)

        let isPureExchange: boolean = false
        if(isExchange) {
            isPureExchange = initiatorFlatPrice === responderFlatPrice
        }
        setIsPureExchange(isPureExchange)

        const initiatorIsPayer: boolean = (!isExchange)
            || (initiatorFlatPrice && responderFlatPrice && initiatorFlatPrice < responderFlatPrice)
            || false
            
        const initiator: ITransactionUser = {
            userId: initiatorId,
            agreedTransaction: initiatorAgreed,
            isTransactionInitiator: true,
            flatId: initiatorFlatId,
            propertyPrice: initiatorFlatPrice,
            isPayer: initiatorIsPayer && !isPureExchange
        }

        const responder: ITransactionUser = {
            userId: responderId,
            agreedTransaction: responderAgreed,
            isTransactionInitiator: false,
            flatId: responderFlatId,
            propertyPrice: responderFlatPrice,
            isPayer: !initiatorIsPayer && !isPureExchange
        }

        // currentUser is initiator
        if(user.userId === initiatorId) {
            setCurrentUser(initiator)
            setSecondUser(responder)
        } else {
             // currentUser is responder
            setCurrentUser(responder)
            setSecondUser(initiator)
        }
    }, [user, flats, transactionRequest])

    //* helpers
    const handleDeleteTransactionRequest = async (transactionRequestId: number) => {
        const fetchedData = await deleteTransactionRequest(transactionRequestId)
        if(!fetchedData) return

        const [response, data] = fetchedData

        if(fetchedData) {
            setFlashMessage({ message: data.message, type: "success" })
            setBookingRequests(prev => prev.filter(request => request.transactionRequestId !== transactionRequestId))
        } else {
            setFlashMessage({ message: "Booking request deletion went wrong, please try again", type: "warning" })
        }

        setTimeout(() => {
            setFlashMessage({ message: null, type: "success" })
        }, 3000)
    }

    if(!currentUser || !secondUser) return null

    return (
        <div
            ref={cardRef}
            id={`transactionRequestId-${transactionRequestId}`}
            className="booking-request-card--wrapper" 
            >
            <div className="card mb-3">
                <div className="row g-0">
                    {/* left panel */}
                    <div className="col-md-6">
                        {/* responderFlat images */}
                        <FlatCardCarousel images={flats?.find(flat => flat.flatId === responderFlatId)?.images} />

                        <div className='d-block d-md-none ms-2 mb-2'>
                            <BookingBy
                                transactionRequestId={transactionRequestId}
                                currentUser={currentUser}
                                initiatorId={initiatorId}
                                isExchange={isExchange}
                            />
                        </div>

                        <BookingFlatsDetails
                            responderFlat={flats.find(flat => flat.flatId === responderFlatId)}
                            initiatorFlat={flats.find(flat => flat.flatId === initiatorFlatId)}
                            currentUser={currentUser}
                            secondUser={secondUser}
                            setMapSelectedFlatId={setMapSelectedFlatId}
                            isExchange={isExchange} 
                        />
                    </div>

                    {/* right panel */}
                    <div className="col-md-6">
                        <div className="card-body">
                            <div className='d-none d-md-block'>
                                <BookingBy
                                    transactionRequestId={transactionRequestId}
                                    currentUser={currentUser}
                                    initiatorId={initiatorId}
                                    isExchange={isExchange}
                                />
                            </div>
                        
                            {/* dates */}
                            <div className='mb-2'>
                                <span className='d-block text-dark fw-bolder'>Dates</span>
                                <span className="card-text">{format(new Date(startingDate), 'MMMM d, yy')}</span>
                                {" "}<span className="card-text">to {format(new Date(endingDate), 'MMMM d, yy')}</span>  
                            </div>

                            {/* total */}
                            <TotalPriceAndDays 
                                pricePerNightInCents={exchangePricePerNightInCents}
                                starting_date={startingDate}
                                ending_date={endingDate}
                            >
                                <span className="d-block text-info fw-bolder">
                                    { isPureExchange ? 
                                        "Booking is free" 
                                        : currentUser?.isPayer ?
                                          "I am the payer" 
                                          : "I am the payee"
                                    }
                                </span>
                            </TotalPriceAndDays>

                            {/* agreement */}
                            <span className='d-block text-dark fw-bolder'>Agreement</span>
                            <BookingAgreementSwitches
                                transactionRequestId={transactionRequestId}
                                currentUser={currentUser}
                                setCurrentUser={setCurrentUser}
                                secondUser={secondUser}
                            />
                        </div>
                    </div>
                </div>

                <div className="row g-0">
                    <div className="d-flex justify-content-between">
                        {/* delete booking request */}
                        <button
                            className="btn btn-sm btn-outline-warning mx-3 my-1 w-100"
                            onClick={() => handleDeleteTransactionRequest(transactionRequestId)}
                        >
                            <FontAwesomeIcon icon={faTrashCan} />{" "}Delete request
                        </button>
                        {/* send message */}
                        <button
                            className="btn btn-sm btn-outline-primary mx-3 my-1 w-100"
                            onClick={() => {
                                // responderFlatId => messageFlatId
                                handleSendMessage(secondUser.userId, responderFlatId, transactionRequestId)
                            }}
                            >
                                <FontAwesomeIcon icon={faPaperPlane} />{" "}Send message
                        </button>
                    </div>

                    {/* go to payment */}
                    <BookingGoToPaymentButton 
                        transactionRequestId={transactionRequestId}
                        currentUser={currentUser}
                        secondUser={secondUser}
                        isExchange={isExchange}
                        isPureExchange={isPureExchange}
                    />
                    
                    {/* last update */}
                    <p className="card-text text-center mt-2 mb-1">
                        <small className="text-body-secondary">Last update {formatDistanceToNow(new Date(updatedAt))} ago
                        </small>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default forwardRef(BookingRequestCard)
