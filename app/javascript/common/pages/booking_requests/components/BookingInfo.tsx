import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faReceipt } from '@fortawesome/free-solid-svg-icons'
import { ITransactionUser } from "./BookingRequestCard"
import { Status } from '../../../components'

interface IProps {
    transactionRequestId: number,
    status: string,
    currentUser: ITransactionUser,
    initiatorId: number,
    isExchange: boolean
}

const BookingInfo: React.FC<IProps> = ({ transactionRequestId, status, currentUser, initiatorId, isExchange }) => {
    return(
        <>
            <h5 className="card-title text-primary">
                <FontAwesomeIcon icon={faReceipt} />
                {" "}Booking request #{transactionRequestId}    
            </h5>
            <span className="card-text d-block sub-title fw-bolder">
                Created by {currentUser?.isTransactionInitiator ? "Me" : `User #${initiatorId}`}
            </span>
            { isExchange && 
                <span className="card-text d-block fw-bolder text-success mb-2">
                    Exchange request
                </span>
            }
            <span className="card-text d-block sub-title my-1">
                <Status status={status} />
            </span>
        </>
    )
}

export default BookingInfo
