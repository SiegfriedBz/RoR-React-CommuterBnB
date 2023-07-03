import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMapLocationDot } from '@fortawesome/free-solid-svg-icons'

import { ITransactionUser } from './BookingRequestCard'
import { IFlat } from '../../../utils/interfaces'
import {ButtonSlide} from '../../../components/buttons/'

interface IProps {
    currentUser: ITransactionUser,
    secondUser: ITransactionUser,
    responderFlat: IFlat | undefined,
    initiatorFlat: IFlat | undefined,
    setMapSelectedFlatId: React.Dispatch<React.SetStateAction<number>>,
    isExchange: boolean,
    scrollToMap: () => void
}

const BookingFlatsDetails: React.FC<IProps> = ({ 
    responderFlat,
    initiatorFlat,
    currentUser,
    secondUser,
    setMapSelectedFlatId,
    isExchange,
    scrollToMap }) => {

    return (
        <div className="d-flex flex-column justify-content-center my-auto">
            {/* responder flat */}  
            <div className="d-flex justify-content-between">
                <div className="d-flex flex-column justify-content-center">
                    <span className='d-block text-primary fw-bolder'>
                        {currentUser.isTransactionInitiator ?
                            `User #${secondUser.userId}`
                            : "My property"
                        }
                    </span>
                    <ul className="list-unstyled m-0">
                        <li>
                            <span className='d-block'>
                                {`${responderFlat?.city}, ${responderFlat?.country}`}
                            </span>
                        </li>
                        <li>
                            <span className='d-block mb-1'>
                                ${responderFlat?.pricePerNightInCents/100} per night
                            </span>
                        </li>
                    </ul>
                </div>
                <ButtonSlide 
                    type='button'
                    className='btn-slide-sm btn-slide-primary right-slide my-auto me-2 me-md-0'
                    onClick={() => {
                        setMapSelectedFlatId(responderFlat?.flatId)
                        // mobile view
                        scrollToMap()
                    }}
                >
                    <FontAwesomeIcon icon={faMapLocationDot} />{" "}See on map
                </ButtonSlide>
            </div>
            {/* initiator flat if exchange */}
            { isExchange && 
            <div className="d-flex justify-content-between">
                <div className="d-flex flex-column justify-content-center">
                    <span className='d-block text-primary fw-bolder'>{currentUser?.isTransactionInitiator ? "My property" : `User #${secondUser.userId} 's property`}</span>
                    <ul className="list-unstyled m-0">
                        <li>
                            <span className='d-block'>{`${initiatorFlat?.city}, ${initiatorFlat?.country}`}
                            </span>
                        </li>
                        <li>
                            <span className='d-block mb-1'> ${initiatorFlat?.pricePerNightInCents/100} per night
                            </span>
                        </li>
                    </ul>
                </div>
                <ButtonSlide 
                    type='button'
                    className='btn-slide-sm btn-slide-primary right-slide my-auto me-2 me-md-0'
                    onClick={() => {
                        setMapSelectedFlatId(initiatorFlat?.flatId)
                        // scroll down to map on mobile view
                        scrollToMap()
                    }}
                >
                    <FontAwesomeIcon icon={faMapLocationDot} />{" "}See on map
                </ButtonSlide>
            </div>
            }
        </div>
    )
}

export default BookingFlatsDetails
