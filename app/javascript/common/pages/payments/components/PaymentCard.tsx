import React, { useState, useEffect} from 'react'
import { useUserContext, useFlatsContext } from '../../../contexts'
 import ReviewForm from './ReviewForm'
import { ModalWrapper, Status } from '../../../components'
import {ButtonSlide} from '../../../components/buttons'
import { IUser, IFlat, IReview } from '../../../utils/interfaces'
import { formatedDate } from '../../../utils/helpers/formatedDate'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import {
    faDollarSign,
    faReceipt,
    faCashRegister,
    faHouse,
    faPaperPlane,
    faMoneyCheckDollar,
    faHandHoldingDollar
 } from '@fortawesome/free-solid-svg-icons'
import { tr } from 'date-fns/locale'

interface IProps {
    payment: {
        paymentId: number,
        transactionRequestId: number,
        payer: IUser,
        payee: IUser,
        flats: {
            responder_flat: IFlat,
            initiator_flat: IFlat
        },
        amountInCents: number,
        status: string,
        createdAt: string
    }
}

const PaymentCard: React.FC = (props) => {
    const { payment:
        { 
            paymentId,
            transactionRequestId,
            payer,
            payee,
            flats: paymentFlats,
            amountInCents,
            status,
            createdAt
        }
     } = props

    // * hooks & context
    const { user } = useUserContext()
    const { flats } = useFlatsContext()

    //* state
    // payment
    const [payerFlat, setPayerFlat] = useState<IFlat | undefined>(undefined)
    const [payeeFlat, setPayeeFlat] = useState<IFlat | undefined>(undefined)
    const [currentUserIsPayer, setCurrentUserIsPayer] = useState<boolean>(false)
    const [currentUserFlat, setCurrentUserFlat] = useState<IFlat | undefined>(undefined)
    const [secondUserFlat, setSecondUserFlat] = useState<IFlat | undefined>(undefined)
    const [isExchange, setIsExchange] = useState<boolean>(false)
    const [isPureExchange, setIsPureExchange] = useState<boolean>(false)
    // review
    const [currentUserDidReview, setCurrentUserDidReview] = useState<boolean>(false)
    // modal
    const [modalIsOpen, setModalIsOpen] = useState(false)

    //* effects
    useEffect(() => {
        if(!user || !flats || !paymentFlats) return

        const { initiator_flat: initiatorFlat, responder_flat: responderFlat } = paymentFlats

        // set payerFlat & payeeFlat
        const payerFlat = payer?.userId === responderFlat?.owner?.userId ?
                responderFlat
                : initiatorFlat
        
        const payeeFlat = payee?.userId=== responderFlat?.owner?.userId ?
                responderFlat
                : initiatorFlat

        // set currentUserIsPayer & currentUserFlat
        const currentUserIsPayer = user?.userId === payer?.userId
        const currentUserFlat = currentUserIsPayer ? payeeFlat : payerFlat

        // set secondUserFlat
        const secondUserFlat = currentUserIsPayer ? payeeFlat : payerFlat

        // set isExchange
        const isExchange = typeof initiatorFlat?.flatId === "number"

        // set currentUserDidReview the second user flat for the current payment
        const getPaymentFlatsUserReviews = (paymentFlats: IFlat[]): IReview[] => Object.entries(paymentFlats)
        .flatMap(([key, flat]) => {
            if(!flat) return []

            const { reviews } = flat
            if(!reviews) return []
            
            const flatUserReviews = reviews?.filter(review => {
                return review?.reviewer?.userId === user?.userId
            })
            return flatUserReviews
        })

        const paymentFlatsUserReviews = getPaymentFlatsUserReviews(paymentFlats)

        if(paymentFlatsUserReviews.length === 0) {
            setCurrentUserDidReview(false)
        } else {
            const userReviewForCurrentPayment = paymentFlatsUserReviews?.find(review => {
                return review?.transactionRequest?.transactionRequestId === transactionRequestId
            })
            setCurrentUserDidReview(typeof userReviewForCurrentPayment !== "undefined")
        }

        setPayerFlat(payerFlat)
        setPayeeFlat(payeeFlat)
        setCurrentUserIsPayer(currentUserIsPayer)
        setCurrentUserFlat(currentUserFlat)
        setSecondUserFlat(secondUserFlat)
        setIsExchange(isExchange)
        setIsPureExchange(isExchange && amountInCents === 0)
    }, [user, flats, paymentFlats])
    

    //* handlers
    const handleSendReview = () => {
        if(!transactionRequestId || !secondUserFlat) return
        
        // open modal with review form
        toggleModal()
    }

    const toggleModal = () => {
      setModalIsOpen(prev => !prev)
    }

    //* helpers
    const name = (email: string) => email?.split("@")[0]
    const address = (flat: IFlat) => {
        if(!flat) return

        return `${flat.city}, ${flat.country}`
    }
  

    console.log("currentUserDidReview", currentUserDidReview)
    
    return (
        <>  
            <ModalWrapper 
                modalIsOpen={modalIsOpen}
                toggleModal={toggleModal}
            > 
                <>
                    <h3 className="text-dark">Send review</h3>
                    <ReviewForm
                        flatId={secondUserFlat?.flatId}
                        transactionRequestId={transactionRequestId}
                    />
                </>
            </ModalWrapper>
            <div className="card payment-card">
                <div className="card-body">
                    <h4 className="card-title text-primary">
                        <FontAwesomeIcon icon={faCashRegister} />
                        {" "}Payment #{paymentId}
                    </h4>
                    <div className="mb-2">
                        <span className="card-text d-block">
                            <Status status={status} />
                            {" "}on{" "}{formatedDate(createdAt)}
                        </span>
                    </div>
                    <div className="my-2">
                        <span className="card-text d-block text-primary">
                            <FontAwesomeIcon icon={faReceipt} />
                            {" "}Booking request #{transactionRequestId}
                        </span>
                    </div>

                    { isExchange &&
                        <div className="my-2">
                            <span className="card-text d-block text-success fw-bolder">
                                Exchange { isPureExchange ? "& Free Booking!" : "" }
                            </span>
                        </div>
                    }
                    { isPureExchange &&
                        <>
                            { currentUserFlat && 
                                <div className="my-2">
                                    <span className="card-text d-block">
                                        <FontAwesomeIcon className="text-dark" icon={faHouse} />
                                        {" "}My property
                                    </span>
                                    <span className="card-text d-block">
                                        { address(currentUserFlat) }
                                    </span>
                                </div>
                            }
                            { secondUserFlat && 
                                <div className="my-2">
                                    <span className="card-text d-block">
                                        <FontAwesomeIcon className="text-dark" icon={faHouse} />
                                        {" "}{currentUserIsPayer ? name(payee?.email) : name(payer?.email)}'s property
                                    </span>
                                    <span className="card-text d-block">
                                        { address(secondUserFlat) }
                                    </span>
                                </div>
                            }
                        </>
                    }

                    { !isPureExchange &&
                    <>
                        <div className="my-2">
                            <span className="card-text d-block">
                                <FontAwesomeIcon className="text-dark" icon={faMoneyCheckDollar} />
                                {" "}Payer is{" "}{currentUserIsPayer ? "Me" : name(payer?.email)}
                            </span>
                            { payerFlat && 
                                <span className="card-text d-block">
                                    <FontAwesomeIcon className="text-dark" icon={faHouse} />
                                    {" "}{ address(payerFlat) }
                                </span>
                            }
                        </div>
                        <div className="mb-2">
                            <span className="card-text d-block">
                                <FontAwesomeIcon className="text-dark" icon={faHandHoldingDollar} />
                                {" "}Payee is{" "}{currentUserIsPayer ? name(payee?.email) : "Me" }
                            </span>
                            { payeeFlat &&
                                <span className="card-text d-block">
                                    <FontAwesomeIcon className="text-dark" icon={faHouse} />
                                    {" "}{ address(payeeFlat) }
                                </span>
                            }
                        </div>
                        <div className="mb-2">
                            <span className="card-text d-block fw-bold text-primary">
                                <FontAwesomeIcon icon={faDollarSign} />
                                {amountInCents/100}
                            </span>
                        </div>
                    </>
                    }
                </div>

                {
                    currentUserDidReview ?
                    (
                        <span
                            className="text-center text-primary my-3 mx-auto"
                            >
                                You reviewed this booking
                        </span>
                    )
                    : typeof secondUserFlat?.flatId === "number" ?
                    (
                        <div className="card-footer bg-transparent">
                            <ButtonSlide
                                className="btn-slide btn-slide-primary right-slide mt-2 w-100"
                                onClick={handleSendReview}
                                >
                                    <FontAwesomeIcon icon={faPaperPlane} />
                                    {" "}Post a review
                            </ButtonSlide>
                        </div>
                    )
                    : null
                }
            </div>
        </>
    )
}

export default PaymentCard
