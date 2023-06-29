import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faReceipt } from '@fortawesome/free-solid-svg-icons'
import { ITransactionUser } from "./BookingRequestCard"
import Status from '../Status'

interface IProps {
    transactionRequestId: number,
    status: string,
    currentUser: ITransactionUser,
    initiatorId: number,
    isExchange: boolean
}



const BookingBy: React.FC<IProps> = ({ transactionRequestId, status, currentUser, initiatorId, isExchange }) => {
    return(
        <>
            <h5 className="card-title"><FontAwesomeIcon icon={faReceipt} />{" "}Booking request #{transactionRequestId}</h5>
            <span className="card-text text-dark fw-bolder d-block mb-1">
                <small className="text-body-secondary">
                    <Status status={status} />
                </small>
            </span>
            <span className="card-text text-dark fw-bolder d-block">
                Created by {currentUser?.isTransactionInitiator ? "Me" : `User #${initiatorId}`}
            </span>
            { isExchange && 
                <span className="card-text text-info d-block fw-bolder mb-2">
                    Exchange request
                </span>
            }
        </>
    )
}

export default BookingBy
