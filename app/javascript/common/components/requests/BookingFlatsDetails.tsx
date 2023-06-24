import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMapLocationDot } from '@fortawesome/free-solid-svg-icons'
import { IFlat } from '../../utils/interfaces'
import { ITransactionUser } from './BookingRequestCard'

interface IProps {
    currentUser: ITransactionUser,
    secondUser: ITransactionUser,
    responderFlat: IFlat | undefined,
    initiatorFlat: IFlat | undefined,
    setMapSelectedFlatId: React.Dispatch<React.SetStateAction<number>>,
    isExchange: boolean
}

const BookingFlatsDetails: React.FC<IProps> = ({ 
    responderFlat,
    initiatorFlat,
    currentUser,
    secondUser,
    setMapSelectedFlatId,
    isExchange }) => {

    return (
        <div> 
            <div className="d-flex justify-content-between">
                <div className='ms-2'>
                    {/* responder flat */}
                    <span className='d-block text-dark fw-bolder'>{currentUser.isTransactionInitiator ? `User #${secondUser.userId}` : "My property"}</span>
                    <ul className="list-unstyled">
                        <li><span className='d-block'>{`${responderFlat?.city}, ${responderFlat?.country}`}</span></li>
                        <li><span className='d-block'> ${responderFlat?.pricePerNightInCents/100} per night</span></li>
                    </ul>
                </div>
                <button 
                    type='button'
                    className='btn btn-sm btn-outline-primary my-auto me-2 me-md-0'
                    onClick={() => setMapSelectedFlatId(responderFlat?.flatId)}
                >
                    <FontAwesomeIcon icon={faMapLocationDot} />{" "}See on map
                </button>
            </div>
            {/* initiator flat if exchange */}
            { isExchange && 
            <div className="d-flex justify-content-between">
                <div className='ms-2'>
                    <span className='d-block text-dark fw-bolder'>{currentUser?.isTransactionInitiator ? "My property" : `User #${secondUser.userId} 's property`}</span>
                    <ul className="list-unstyled">
                        <li><span className='d-block'>{`${initiatorFlat?.city}, ${initiatorFlat?.country}`}</span></li>
                        <li><span className='d-block'> ${initiatorFlat?.pricePerNightInCents/100} per night</span></li>
                    </ul>
                </div>
                <button 
                    type='button'
                    className='btn btn-sm btn-outline-primary my-auto me-2 me-md-0'
                    onClick={() => setMapSelectedFlatId(initiatorFlat?.flatId)}
                >
                    <FontAwesomeIcon icon={faMapLocationDot} />{" "}See on map
                </button>
            </div>
            }
        </div>
    )
}

export default BookingFlatsDetails
