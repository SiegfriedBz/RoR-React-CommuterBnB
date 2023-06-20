import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useFetch } from '../../hooks'
import { useAppContext, useUserContext, useFlatsContext } from '../../contexts'
import { IFlat } from '../../utils/interfaces'
import { LoadingSpinners, TotalPriceAndDays } from '../../components'
import { v4 as uuid } from 'uuid'
import { format, formatDistanceToNow } from 'date-fns'

const BookingRequestCard: React.FC = ({ transactionRequest, setMapSelectedFlatId, handleSendMessage }) => {
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
    
    //* hooks
    const navigate = useNavigate()
    const { updateTransactionRequest } = useFetch()

    //* contexts
    const { isLoading, setFlashMessage } = useAppContext()
    const { user } = useUserContext()
    const { flats } = useFlatsContext()

    //* state
    const [initiatorFlat, setInitiatorFlat] = useState<IFlat | undefined>(undefined)
    const [isExchange, setIsExchange] = useState<boolean>(false)
    const [responderFlat, setResponderFlat] = useState<IFlat | undefined>(undefined)

    const [currentUserIsResponder, setCurrentUserIsResponder] = useState<boolean | undefined>(undefined)
    const [requestedBy, setRequestedBy] = useState<string | undefined>(undefined)
    const [secondUserId, setSecondUserId] = useState<number | undefined>(undefined)

    const [currentUserAgreed, setCurrentUserAgreed] = useState<boolean>(false)
    const [secondUserAgreed, setSecondUserAgreed] = useState<boolean>(false)

    const [currentUserProperty, setCurrentUserProperty] = useState<IFlat | undefined>(undefined)
    const [secondUserProperty, setSecondUserProperty] = useState<IFlat | undefined>(undefined)
    
    // TODO CLEANUP AND REMOVE DUPLICATE DATA
    const [currentUserPropertyPrice, setCurrentUserPropertyPrice] = useState<number | undefined>(undefined)
    const [secondUserPropertyPrice, setSecondUserPropertyPrice] = useState<number | undefined>(undefined)
    
    const [currentUserIsPayer, setCurrentUserIsPayer] = useState<boolean>(false)
    const [isPureExchange, setIsPureExchange] = useState<boolean>(false)

    //* effects
    useEffect(() => {
        if(!user || !flats) return

        // initiatorFlat
        const initiatorFlat: IFlat | undefined = flats?.find((flat) => flat.flatId === initiatorFlatId)
        setInitiatorFlat(initiatorFlat)

        // isExchange
        const isExchange: boolean = typeof initiatorFlat !== "undefined"
        setIsExchange(isExchange)

        // responderFlat
        const responderFlat: IFlat | undefined = flats?.find((flat) => flat.flatId === responderFlatId)
        setResponderFlat(responderFlat)

        // currentUserIsResponder
        const currentUserIsResponder: boolean = user.userId === responderId 
        setCurrentUserIsResponder(currentUserIsResponder)

        // requested by & secondUserId
        setRequestedBy(currentUserIsResponder ? `User #${initiatorId}` : "Me")
        setSecondUserId(currentUserIsResponder ? initiatorId : responderId)

        // agreements
        setCurrentUserAgreed(currentUserIsResponder ? responderAgreed : initiatorAgreed)
        setSecondUserAgreed(currentUserIsResponder ? initiatorAgreed : responderAgreed)

        // properties
        setCurrentUserProperty(currentUserIsResponder ? responderFlat : initiatorFlat)
        setSecondUserProperty(currentUserIsResponder ? initiatorFlat : responderFlat)

        // property Prices
        const currentUserPropertyPrice = currentUserIsResponder ?
            responderFlat?.pricePerNightInCents
            : initiatorFlat?.pricePerNightInCents
        setCurrentUserPropertyPrice(currentUserPropertyPrice)

        const secondUserPropertyPrice = currentUserIsResponder ?
            initiatorFlat?.pricePerNightInCents
            : responderFlat?.pricePerNightInCents
        setSecondUserPropertyPrice(secondUserPropertyPrice)

        // currentUserIsPayer
        const currentUserIsPayer = 
            currentUserIsResponder ?
                isExchange && 
                    currentUserPropertyPrice && 
                        secondUserPropertyPrice && 
                            currentUserPropertyPrice < secondUserPropertyPrice
            : isExchange ?
                currentUserPropertyPrice &&
                    secondUserPropertyPrice &&
                        currentUserPropertyPrice < secondUserPropertyPrice
            : true 
        setCurrentUserIsPayer(currentUserIsPayer)

        // isPureExchange
        const isPureExchange = isExchange && 
            currentUserPropertyPrice
                && secondUserPropertyPrice
                    && currentUserPropertyPrice === secondUserPropertyPrice
        setIsPureExchange(isPureExchange)
    }, [user,
        flats,
        isPureExchange,
        responderFlat,
        currentUserIsResponder,
        requestedBy,
        currentUserPropertyPrice,
        secondUserPropertyPrice,
        currentUserIsPayer])
    
    //* handlers
    const handleChange = () => {
        console.log("handleChange checked")
        setCurrentUserAgreed(prev => !prev)
    }

    // currentUser updates his agreement status
    const handleSubmit = async(event) => {
        event.preventDefault()
        const fetchedData = await updateTransactionRequest(transactionRequestId, currentUserIsResponder, currentUserAgreed)

        if(fetchedData) {
            const data = fetchedData[1]
            setFlashMessage({ message: data.message, type: "success" })
        } else {
            setFlashMessage({ message: "Booking request creation went wrong", type: "warning" })
        }

        setTimeout(() => {
            setFlashMessage({ message: null, type: "success" })
        }, 3000)
    }

    if(isLoading || typeof currentUserIsResponder === "undefined") return <LoadingSpinners />


    //* render
    // requested by
    const renderRequestedBy = () => {
        return (
            <>
                <h5 className="card-title">Booking request #{transactionRequestId}</h5>
                <span className="card-text d-block">Requested by: {requestedBy}</span>
                {isExchange && <span className="card-text text-info d-block fw-bolder mb-2">Exchange request</span>}
            </>
        )
    }

    // aggreement switches
    const uuidKey01 = uuid()
    const uuidKey02 = uuid()

    const renderAgreementSwitches = () => {
        return (
            <div className="booking-request-card---switch-wrapper">
                <div className="form-check">
                    <input  
                        checked={currentUserAgreed} 
                        onChange={handleChange} 
                        className="form-check-input" 
                        type="checkbox" 
                        role="switch" 
                        id={uuidKey01}
                     />
                    <label className="form-check-label" htmlFor={`#${uuidKey01}`} >I agreed</label>
                </div>
    
                <div className="form-check">
                    <input 
                        disabled
                        checked={secondUserAgreed} 
                        className="form-check-input" 
                        type="checkbox" 
                        role="switch" 
                        id={uuidKey02} 
                    />
                    <label className="form-check-label" htmlFor={`#${uuidKey02}`}>User #{secondUserId} agreed</label>
                </div>
            </div>
        )
    }
    
    // properties info & show flat on map buttons & send message button(d-none d-md-block)
    const renderLeftPanel = () => {
        return(
            <div className="booking-request-card---left-panel">
                {/* request by */}
                <div className='d-block d-md-none ms-2 mb-2'>
                    {renderRequestedBy()}
                </div>
                <div>
                    { currentUserIsResponder ?
                       <>
                        <div className="d-flex">
                            <div className='ms-2'>
                                <span className='d-block text-info fw-bolder'>My flat</span>
                                <ul>
                                    <li><span className='d-block'>{responderFlat?.address}</span></li>
                                    <li><span className='d-block'> ${responderFlat?.pricePerNightInCents/100} per night</span></li>
                                </ul>
                            </div>
                            <button 
                                type='button'
                                className='btn btn-sm btn-outline-primary my-auto me-2 me-md-0'
                                onClick={() => setMapSelectedFlatId(responderFlatId)}
                                >See flat on map
                            </button>
                        </div>
                        { isExchange && 
                        <div className="d-flex justify-content-between">
                            <div className='ms-2'>
                                <span className='d-block text-info fw-bolder'>User #{initiatorId}</span>
                                <ul>
                                    <li><span className='d-block'>{initiatorFlat?.address}</span></li>
                                    <li><span className='d-block'> ${initiatorFlat?.pricePerNightInCents/100} per night</span></li>
                                </ul>
                            </div>
                            <button 
                                type='button'
                                className='btn btn-sm btn-outline-primary my-auto me-2 me-md-0'
                                onClick={() => setMapSelectedFlatId(initiatorFlatId)}
                                >See flat on map
                            </button>
                        </div>
                        }
                    </>
                    : 
                    <>
                        { isExchange && 
                        <div className="d-flex justify-content-between">
                            <div className='ms-2'>
                                <span className='d-block text-info fw-bolder'>My flat</span>
                                <ul>
                                    <li><span className='d-block'>{initiatorFlat?.address}</span></li>
                                    <li><span className='d-block'> ${initiatorFlat?.pricePerNightInCents/100} per night</span></li>
                                </ul>
                            </div>
                            <button 
                                type='button'
                                className='btn btn-sm btn-outline-primary my-auto me-2 me-md-0'
                                onClick={() => setMapSelectedFlatId(initiatorFlatId)}
                                >See flat on map
                            </button>
                        </div>
                        }
                        <div className="d-flex justify-content-between">
                            <div className='ms-2'>
                                <span className='d-block text-info fw-bolder'>User #{responderId} flat</span>
                                <ul>
                                    <li><span className='d-block'>{responderFlat?.address}</span></li>
                                    <li> <span className='d-block'>${responderFlat?.pricePerNightInCents/100} per night</span></li>
                                </ul>
                            </div>
                            <button 
                                type='button'
                                className='btn btn-sm btn-outline-primary my-auto me-2 me-md-0'
                                onClick={() => setMapSelectedFlatId(responderFlatId)}
                                >See flat on map
                            </button>
                        </div>
                    </>
                    }
                </div>
                
                 {/* send message */}
                 <div className="d-none d-md-block ms-2">
                    <button 
                        className="btn btn-sm btn-outline-primary mx-auto mt-1 w-50"
                        onClick={() => handleSendMessage(secondUserId, secondUserProperty?.flatId || currentUserProperty?.flatId, transactionRequestId)}
                    >Send message
                    </button>
                 </div>

                {/* delete booking request */}
                <div className="d-none d-md-block ms-2">
                    <button className="btn btn-sm btn-outline-warning mx-auto my-1 w-50">Deelete request</button>
                </div>
            </div>
        )

    } 

    // proceed to payment button
    const renderProceedToPaymentButton = () => {

        // waiting for both parties to agree
        if(!responderAgreed || !initiatorAgreed ) return null

        // not exchange scenario && currentUser is not responder: initiator must pay
        if(!initiatorFlat && !currentUserIsResponder) return (
            <Link to="/payments" state={ { mustBePaidToUserId: user.userId , transactionRequestId } } className="btn btn-sm btn-outline-primary mt-1 w-100">
                Proceed to payment
            </Link>
        )

        // exchange scenario
        if(initiatorFlat) {
            const rMinusIPriceDelta = responderFlat?.pricePerNightInCents - initiatorFlat?.pricePerNightInCents
            
            // pure exchange
            if(rMinusIPriceDelta === 0) {
                return <span className="btn btn-sm btn-outline-success mt-1 w-100">You can validate the transaction by creating a 0 value payment</span>
            }
            
            const responderMustPay = rMinusIPriceDelta < 0

            // currentUser is responder
            if(currentUserIsResponder) {
                // responder must pay
                if(responderMustPay) {
                    return (
                        <Link 
                            to="/my-payments"
                            state={ { mustBePaidByUserId: user.userId , transactionRequestId } }
                            className="btn btn-sm btn-success mt-1 w-100">
                            Proceed to payment
                        </Link>
                    )
                } else {
                    // initiator must pay
                    return (
                        <span className="btn btn-sm btn-success mt-1 w-100">Waiting for payment</span>
                    )
                }
            } else {
                // currentUser is not responder
                if(responderMustPay) {
                    return (
                        <span className="btn btn-sm btn-success mt-1 w-100">Waiting for payment</span>
                    )
                } else {
                    // initiator must pay
                    return (
                        <Link
                            to="/my-payments"
                            state={ { mustBePaidToUserId: user.userId , transactionRequestId } }
                            className="btn btn-sm btn-success mt-1 w-100">
                            Proceed to payment
                        </Link>
                    )
                }
            }
        }
    }

    return (
        <div className="booking-request-card--wrapper">
            <div className="card mb-3" >
                <div className="row g-0">
                    <div className="col-md-6">
                        <img src={responderFlat?.images[0]} className="img-fluid rounded-start mb-1" alt="..."/>
                        {/* properties info & show on map buttons */}
                        {renderLeftPanel()}
                    </div>

                    <div className="col-md-6">
                        <div className="card-body">
                            {/* request by */}
                            <div className='d-none d-md-block'>
                                {renderRequestedBy()}
                            </div>
                           
                            {/* dates */}
                            <div className='mb-2'>
                                <span className='d-block text-info fw-bolder'>Dates</span>
                                <span className="card-text d-block">From {format(new Date(startingDate), 'MMMM d, yy')}</span>
                                <span className="card-text d-block">to {format(new Date(endingDate), 'MMMM d, yy')}</span>  
                            </div>

                            {/* total */}
                            <TotalPriceAndDays 
                                pricePerNightInCents={exchangePricePerNightInCents}
                                starting_date={startingDate}
                                ending_date={endingDate}
                            >
                                <li>
                                    <span className="d-block text-info fw-bolder">I am the { currentUserIsPayer ? "payer" : "payee"}
                                    </span>
                                </li>
                            </TotalPriceAndDays>

                            {/* agreement */}
                            <span className='d-block text-info fw-bolder'>Agreement</span>
                            <form onSubmit={handleSubmit}>
                                <div className="form-check form-switch mt-2">
                                    {renderAgreementSwitches()}
                                </div>
                                <button 
                                    type="submit"
                                    className="btn btn-sm btn-outline-primary mt-1 w-100"
                                    disabled={isLoading}
                                    >Update agreement
                                </button>
                            </form>

                            {/* send message */}
                            <div className="d-block d-md-none">
                                <button 
                                    className="btn btn-sm btn-outline-primary mx-auto mt-1 w-100"
                                    onClick={() => {
                                        return handleSendMessage(secondUserId, secondUserProperty?.flatId || currentUserProperty?.flatId, transactionRequestId)}
                                    }
                                    >Send message
                                </button> 
                            </div>
                            
                            {/* delete booking request */}
                            <div className="d-block d-md-none">
                                <button
                                    className="btn btn-sm btn-outline-warning mx-auto mt-1 w-100"
                                >Deelete request
                                </button>
                            </div>

                            {/* go to payment */}
                            <div className=''>
                                { renderProceedToPaymentButton() }
                            </div>

                            {/* last update */}
                            <p className="card-text text-center mt-1">
                                <small className="text-body-secondary">Last update {formatDistanceToNow(new Date(updatedAt))} ago
                                </small>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default BookingRequestCard
