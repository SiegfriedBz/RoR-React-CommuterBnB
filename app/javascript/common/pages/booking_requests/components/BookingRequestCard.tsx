import React, {
    useState,
    useEffect,
    useRef, 
    forwardRef,
    useImperativeHandle
} from 'react'
import { useNavigate } from 'react-router-dom'
import { formatDistanceToNow, differenceInDays } from 'date-fns'
import { useFetch } from '../../../hooks'
import {
    useAppContext,
    useUserContext,
    useFlatsContext,
    useBookingsContext
} from '../../../contexts'

import { FlatCardCarousel } from '../../../components/flats'
import { TotalPriceAndDays } from '../../../components'
import BookingInfo from './BookingInfo'
import BookingAgreementSwitches from './BookingAgreementSwitches'
import BookingFlatsDetails from './BookingFlatsDetails'
import BookingGoToPayment from './BookingGoToPayment'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrashCan, faPaperPlane } from '@fortawesome/free-solid-svg-icons'
import { formatedDate } from '../../../utils/helpers/formatedDate'
import { IFlat, IBookingRequest } from '../../../utils/interfaces'
import {ButtonSlide} from '../../../components/buttons/'


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
    handleSendMessage: (secondUserId: number, messageFlatId: number, transactionRequestId?: number) => void,
    scrollToMap: () => void
}

const BookingRequestCard: React.FC = (props: IProps, forwardedRef: React.Ref) => {
    const {
        transactionRequest,
        setMapSelectedFlatId,
        handleSendMessage,
        scrollToMap } = props

    const {
        status,
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
    const navigate = useNavigate()
    const cardRef = useRef()
    const { updateBookingRequest, createPayment } = useFetch()

    //* contexts
    const { isLoading, setFlashMessage } = useAppContext()
    const { user } = useUserContext()
    const { flats } = useFlatsContext()
    const { bookingRequests, setBookingRequests } = useBookingsContext()

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

    //* handlers
    // currentUser rejects transactionRequest
    // (TODO : ADD ADMIN DELETE)
    const handleRejectTransactionRequest = async (transactionRequestId: number) => {
        if(!window.confirm("Are you sure you want to reject this booking request?")) return

        const fetchedData = await updateBookingRequest({
            transactionRequestId,
            status: "rejected",
        })

        if(!fetchedData) {
            return setFlashMessage({ message: "Booking request update went wrong, please try again", type: "warning" })
        }

        const [response, data] = fetchedData

        // notifiy user
        setFlashMessage({ message: data.message, type: "success" })

        // update bookingRequests
        const bookingRequest = bookingRequests.find(request => request.transactionRequestId === transactionRequestId)
        const updatedBookingRequest = { ...bookingRequest, status: "rejected" }
        setBookingRequests(bookingRequests.map(request => {
            return request.transactionRequestId !== transactionRequestId ?
                request
                : updatedBookingRequest
        }))
    }

    const onCreatePayment = async (payerId: number, payeeId: number) => {
        if(!window.confirm("Please confirm proceeding to payment")) return

        const fetchedData = await createPayment(transactionRequestId, payerId, payeeId, totalPriceInCents)
        
        if(!fetchedData) {
            return setFlashMessage({ 
                message: "Something went wrong when creating payment, pelase try again",
                type: "warning" 
            })
        }

        const [response, data] = fetchedData
        const { message } = data

        const newBookingRequests = bookingRequests?.map(request => {
            return request.transactionRequestId !== transactionRequestId ?
                request
                : { ...request, status: "completed"}
        })
        setBookingRequests(newBookingRequests)
        setFlashMessage({ message: message, type: "success" })
        navigate('/my-payments')
    }

    //* helpers
    const pricePerNight = Math.abs(exchangePricePerNightInCents/100)
    const start = new Date(startingDate)
    const end = new Date(endingDate)
    const totalDays = differenceInDays(end, start)
    const totalPriceInCents = Math.abs(totalDays * exchangePricePerNightInCents)

    if(!currentUser || !secondUser) return null

    return (
        <div
            ref={cardRef}
            id={`transactionRequestId-${transactionRequestId}`}
            className="booking-request-card--wrapper mx-auto" 
            >
                <div className="card mb-3">
                    <div className="row mx-auto">
                        {/* left panel */}
                        <div className="col-md-7 d-flex flex-column justify-content-between">
                            {/* responderFlat images */}
                            <FlatCardCarousel images={flats?.find(flat => flat.flatId === responderFlatId)?.images} />
                            {/* BookingInfo */}
                            <div className='d-block d-md-none my-2'>
                                <BookingInfo
                                    transactionRequestId={transactionRequestId}
                                    status={status}
                                    currentUser={currentUser}
                                    initiatorId={initiatorId}
                                    isExchange={isExchange}
                                />
                            </div>
                            {/* Booking Flats Details */}
                            <BookingFlatsDetails
                                responderFlat={flats.find(flat => flat.flatId === responderFlatId)}
                                initiatorFlat={flats.find(flat => flat.flatId === initiatorFlatId)}
                                currentUser={currentUser}
                                secondUser={secondUser}
                                setMapSelectedFlatId={setMapSelectedFlatId}
                                isExchange={isExchange}
                                scrollToMap={scrollToMap}
                            />
                        </div>

                        {/* right panel */}
                        <div className="col-md-5">
                            <div className="card-body p-0">
                                <div className='d-none d-md-block my-2'>
                                    <BookingInfo
                                        transactionRequestId={transactionRequestId}
                                        status={status}
                                        currentUser={currentUser}
                                        initiatorId={initiatorId}
                                        isExchange={isExchange}
                                    />
                                </div>

                                {/* total */}
                                <TotalPriceAndDays className="my-md-2"
                                    pricePerNight={pricePerNight}
                                    totalPriceInCents={totalPriceInCents}
                                    totalDays={totalDays}
                                >
                                    {/* free/payer/payee */}
                                    <span className="d-block fw-bolder text-success my-2">
                                        { isPureExchange ? 
                                            "Booking is free" 
                                            : currentUser?.isPayer ?
                                            "I am the payer" 
                                            : "I am the payee"
                                        }
                                    </span>
                                    {/* dates */}
                                    <div className='mt-1'>
                                        <span className="card-text">{formatedDate(startingDate)}</span>
                                        {" "}<span className="card-text">to {formatedDate(endingDate)}</span>  
                                    </div>
                                </TotalPriceAndDays>

                                {/* agreement */}
                                { status === "pending" ?
                                    <>
                                        <BookingAgreementSwitches
                                            transactionRequestId={transactionRequestId}
                                            currentUser={currentUser}
                                            setCurrentUser={setCurrentUser}
                                            secondUser={secondUser}
                                        />
                                    </>
                                    : null
                                }

                                <div className="d-none d-md-flex mt-1 mb-2 flex-column justify-content-around">
                                    {/* send message */}
                                    <ButtonSlide
                                        className="btn-slide-sm btn-slide-primary right-slide mx-auto my-1 w-100"
                                        onClick={() => {
                                            // responderFlatId -> messageFlatId
                                            handleSendMessage(secondUser.userId, responderFlatId, transactionRequestId)
                                        }}
                                        >
                                            <FontAwesomeIcon icon={faPaperPlane} />
                                            {" "}Send message
                                    </ButtonSlide>
                                    {/* reject booking request */}
                                    { status === "pending" ?
                                        <ButtonSlide
                                            className="btn-slide-sm btn-slide-warning right-slide mx-auto my-1 w-100"
                                            onClick={() => handleRejectTransactionRequest(transactionRequestId)}
                                        >
                                            <FontAwesomeIcon icon={faTrashCan} />
                                            {" "}Reject request
                                        </ButtonSlide>
                                        : null
                                    }
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="row g-0 mt-1">
                        <div className="d-flex d-md-none justify-content-between">
                            {/* send message */}
                            <ButtonSlide
                                className="btn-slide-sm btn-slide-primary right-slide mx-2 my-1 w-100"
                                onClick={() => {
                                    // responderFlatId -> messageFlatId
                                    handleSendMessage(secondUser.userId, responderFlatId, transactionRequestId)
                                }}
                                >
                                    <FontAwesomeIcon icon={faPaperPlane} />
                                    {" "}Send message
                            </ButtonSlide>
                            {/* reject booking request */}
                            { status === "pending" ?
                                <ButtonSlide
                                    className="btn-slide-sm btn-slide-warning right-slide mx-2 my-1 w-100"
                                    onClick={() => handleRejectTransactionRequest(transactionRequestId)}
                                >
                                    <FontAwesomeIcon icon={faTrashCan} />
                                    {" "}Reject request
                                </ButtonSlide>
                                : null
                            }
                        </div>

                        {/* go to payment */}
                        { status === "pending" ? 
                            <BookingGoToPayment 
                                transactionRequestId={transactionRequestId}
                                currentUser={currentUser}
                                secondUser={secondUser}
                                isExchange={isExchange}
                                isPureExchange={isPureExchange}
                                onCreatePayment={onCreatePayment}
                            />
                            : null
                        }
                        {/* last update */}
                        <p className="card-text text-center mt-2 mb-1">
                            <small className="text-body-secondary">
                                Last update {formatDistanceToNow(new Date(updatedAt))} ago
                            </small>
                        </p>
                    </div>
                </div>
        </div>
    )
}

export default forwardRef(BookingRequestCard)
