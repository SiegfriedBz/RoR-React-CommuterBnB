import React, { useState } from 'react'
import { v4 as uuid } from 'uuid'
import clsx from "clsx"
import { useFetch } from '../../../hooks'
import { useAppContext } from '../../../contexts'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCloudArrowUp } from '@fortawesome/free-solid-svg-icons'
import { LoadingSpinners } from '../../../components'
import { ITransactionUser } from './BookingRequestCard'
import {ButtonSlide} from '../../../components/buttons'


interface IProps {
    transactionRequestId: number,
    currentUser: ITransactionUser,
    setCurrentUser: React.Dispatch<React.SetStateAction<ITransactionUser>>,
    secondUser: ITransactionUser
}

const BookingAgreementSwitches: React.FC<IProps>  = ({ transactionRequestId, currentUser, setCurrentUser, secondUser }) => {
    //* hooks
    const { updateBookingRequest } = useFetch()

    //* contexts
    const { isLoading, setFlashMessage } = useAppContext()

    //* state
    const [showUpdateButton, setShowUpdateButton] = useState<boolean>(false)

    //* handlers
    const handleChange = () => {
        setShowUpdateButton(true)
        setCurrentUser(prev => ({ ...prev, agreedTransaction: !prev.agreedTransaction }))
    }

    // currentUser updates his agreement status
    const handleSubmit = async(event) => {
        event.preventDefault()
        const fetchedData = await updateBookingRequest({
            transactionRequestId,
            currentUserIsTransactionInitiator: currentUser.isTransactionInitiator,
            currentUserAgreed:  currentUser.agreedTransaction
            })

        if(fetchedData) {
            const data = fetchedData[1]
            setFlashMessage({ message: data.message, type: "success" })
        } else {
            setFlashMessage({ message: "Booking request update went wrong, please try again", type: "warning" })
        }
    }

    if(isLoading) return <LoadingSpinners />

    //* clsx
    const agreedLabelClass = (user) => {
        return clsx("form-check-label", {
            "text-success fw-bold" : user?.agreedTransaction
        })
    }

    const uuidKey01 = uuid()
    const uuidKey02 = uuid()

    return (
        <form onSubmit={handleSubmit}>
            <div className="d-flex flex-row justify-content-between">
                <div className="form-check form-switch mt-2">
                    <div className="booking-request-card---switch-wrapper">
                        <div className="form-check">
                            <input  
                                checked={currentUser.agreedTransaction} 
                                onChange={handleChange} 
                                className="form-check-input" 
                                type="checkbox" 
                                role="switch" 
                                id={uuidKey01}
                            />
                            <label
                                className={agreedLabelClass(currentUser)}
                                htmlFor={`#${uuidKey01}`}
                            >I agreed
                            </label>
                        </div>

                        <div className="form-check">
                            <input 
                                disabled
                                checked={secondUser.agreedTransaction} 
                                className="form-check-input" 
                                type="checkbox" 
                                role="switch" 
                                id={uuidKey02} 
                            />
                            <label 
                                className={agreedLabelClass(secondUser)}
                                htmlFor={`#${uuidKey02}`}
                            >User #{secondUser.userId} agreed
                            </label>
                        </div>
                    </div>
                </div>
                { showUpdateButton &&
                    <ButtonSlide 
                        type="submit"
                        className="btn-slide-sm btn-slide-primary top-slide border-0 d-flex align-items-center my-auto mx-0"                        disabled={isLoading}
                    >   
                        <span className='fs-5 me-1'>
                            <FontAwesomeIcon icon={faCloudArrowUp} />
                        </span>
                        <span>update</span>
                    </ButtonSlide>
                }
            </div>
        </form>
    )
}

export default BookingAgreementSwitches
