import React, { useState, useEffect} from 'react'
import { useUserContext } from '../../contexts'
import { formatedDate } from '../../utils/helpers/formatedDate'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    faMoneyBill,
    faDollarSign,
    faUser,
    faReceipt,
    faCashRegister,
    faHouse,
    faCalendarDays,
    faPaperPlane
 } from '@fortawesome/free-solid-svg-icons'
import Status from '../../components/Status'
import { ButtonSlide } from '../../components'
import { IUser, IFlat } from '../../utils/interfaces'

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
    // * hooks & context
    const { payment:
        { 
            paymentId,
            transactionRequestId,
            payer,
            payee,
            flats,
            amountInCents,
            status,
            createdAt
        }
     } = props


    const { user } = useUserContext()

    //* state
    const [payerFlat, setPayerFlat] = useState(undefined)
    const [payeeFlat, setPayeeFlat] = useState(undefined)

    //* effects
    useEffect(() => {
        if(!user.userId || !flats || !payer || !payee) return

        const {
            responder_flat: responderFlat,
            initiator_flat: initiatorFlat
        } = flats

        const payerFlat = payer.userId === responderFlat.owner.userId ?
             responderFlat : initiatorFlat

        const payeeFlat = payee.userId === responderFlat.owner.userId ?
                responderFlat : initiatorFlat

        setPayerFlat(payerFlat)
        setPayeeFlat(payeeFlat)
      }, [user, flats, payer, payer])

    //* helpers
    const name = (email: string) => email.split("@")[0]
    const address = (flat: IFlat) => `${flat.city}, ${flat.country}`
  
    return (
        <div  className="card" style={{"width": "15rem"}}>
            <div className="card-body">
                <h4 className="card-title">
                <FontAwesomeIcon icon={faCashRegister} />
                {" "}Payment #{paymentId}
                </h4>
                <h5 className="card-subtitle my-2 text-body-secondary">
                <FontAwesomeIcon icon={faReceipt} />
                {" "}Booking request #{transactionRequestId}
                </h5>
                <div className="my-2">
                    <span className="card-text d-block">
                        <FontAwesomeIcon icon={faUser} />
                        {" "}Payer {name(payer.email)}
                    </span>
                    { payerFlat &&
                        <span className="card-text d-block">
                            <FontAwesomeIcon icon={faHouse} />
                            {" "}{address(payerFlat)}
                        </span>
                    }
                </div>
                <div className="mb-2">
                    <span className="card-text d-block">
                        <FontAwesomeIcon icon={faUser} />
                        {" "}Payee {name(payee.email)}
                    </span>
                    { payeeFlat &&
                        <span className="card-text d-block">
                            <FontAwesomeIcon icon={faHouse} />
                            {" "}{address(payeeFlat)}
                        </span>
                }
                </div>
                <div className="mb-2">
                <span className="card-text d-block">
                    <FontAwesomeIcon icon={faMoneyBill} />
                    {" "}<FontAwesomeIcon icon={faDollarSign} />
                    {amountInCents/100}
                </span>
                </div>
                <span className="card-text d-block my-2">
                    <FontAwesomeIcon icon={faCalendarDays} />
                    {" "}{formatedDate(createdAt)}
                </span>
                <div className="mb-2">
                    <span className="card-text d-block">
                        <Status status={status} />
                    </span>
                </div>
                <ButtonSlide
                    className="btn-slide-sm btn-slide-primary right-slide mt-2 w-100"
                    onClick={() => console.log("post a review")}
                    >
                    <FontAwesomeIcon icon={faPaperPlane} />
                    {" "}POST A REVIEW
                </ButtonSlide>
            </div>
        </div>
    )
}

export default PaymentCard
