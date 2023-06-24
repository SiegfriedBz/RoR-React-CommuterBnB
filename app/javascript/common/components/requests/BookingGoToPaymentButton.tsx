import React from 'react'
import { Link } from 'react-router-dom'
import { ITransactionUser } from './BookingRequestCard'

interface IProps {
    transactionRequestId: number,
    currentUser: ITransactionUser,
    secondUser: ITransactionUser,
    isExchange: boolean,
    isPureExchange: boolean
}

const BookingGoToPaymentButton: React.FC<IProps> = ({
    transactionRequestId,
    currentUser,
    secondUser,
    isExchange,
    isPureExchange
}) => {

        // waiting for both parties to agree
        if(!currentUser.agreedTransaction || !secondUser.agreedTransaction ) return null

        // not exchange scenario
        if(!isExchange) {
            if(currentUser.isTransactionInitiator) {
                // currentUser is transaction initiator: currentUser must pay
                return (
                    <Link 
                        to="/payments"
                        state={ { mustBePaidToUserId: secondUser.userId , transactionRequestId } }
                        className="btn btn-dark mx-auto mt-1"
                        >Proceed to payment
                    </Link>)
            } else {
                // currentUser is transaction responder: currentUser must be paid
                return (
                    <span className="badge fw-bolder bg-dark mx-auto py-3 mt-1"
                    >Waiting for payment
                    </span>)
            }
        } else {
        // exchange scenario
            // pure exchange scenario => "0" value payment
            if(isPureExchange) {
                return (
                    <Link 
                        to="/payments"
                        state={ { zeroPayment: true , transactionRequestId } }
                        className="btn btn-success mx-auto mt-1"
                        >Proceed to "0" value payment
                    </Link>)
            } else {
            // not pure exchange scenario
                // currentUser is Payer
                if(currentUser.isPayer) {
                    return (
                        <Link 
                            to="/payments"
                            state={ { mustBePaidToUserId: secondUser.userId , transactionRequestId } }
                            className="btn btn-dark mx-auto mt-1"
                            >Proceed to payment
                        </Link>) 
                } else {
                // currentUser is not Payer
                    return (
                        <span className="badge fw-bolder bg-dark mx-auto py-3 mt-1"
                        >Waiting for payment
                        </span>)
                }
            }
        }
}

export default BookingGoToPaymentButton
