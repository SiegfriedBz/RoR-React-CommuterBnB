import React, { useState, useEffect } from 'react'
import { NavLink, useParams, Outlet, Navigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPaperPlane, faReceipt } from '@fortawesome/free-solid-svg-icons'
import { useFlatsContext } from '../../contexts'
import { FlatDescription, FlatHostedBy } from '../../components/flats'
import { LoadingSpinners } from '../../components'
import { ButtonSlide } from '../../components/buttons/'
import { IFlat } from '../../utils/interfaces'

const BookingFormsPage = () => {
    //* hooks & context
    const { id: selectedFlatId } = useParams()
    const { flats } = useFlatsContext()

    //* state
    const [flat, selectedFlat] = useState<IFlat | undefined>(undefined)

    useEffect(() => {
        if(!flats || !selectedFlatId) return

        const flat = flats.find(flat => flat.flatId === parseInt(selectedFlatId))
        selectedFlat(flat)
    }, [flats, selectedFlatId])


    if(!selectedFlatId || !flat) return <LoadingSpinners />

    if(!flat) return <Navigate to="/" replace={true}/>
    
    return (
        <div className="mb-3">
            <FlatDescription flat={flat} />
        <div className="mt-2 mb-3">
            <FlatHostedBy hostFlat={flat}/>
        </div>
        <div className="d-flex mb-3">
            {/* nav to BookingForm */}
            <NavLink 
                to="booking"
                state={{ selectedFlatId }}
                >
                    <ButtonSlide
                        className="btn-slide btn-slide-primary right-slide me-2"
                    >
                        <FontAwesomeIcon icon={faReceipt} />
                        {" "}Send a booking request
                    </ButtonSlide>
            </NavLink>
            {/* nav to MessageForm */}
            <NavLink
                to="message"
                state={{ selectedFlatId }}
                >   <ButtonSlide
                        className="btn-slide btn-slide-primary right-slide"
                    >
                        <FontAwesomeIcon icon={faPaperPlane} />
                        {" "}Send a message
                    </ButtonSlide>
            </NavLink>
        </div>
        <Outlet />
      </div>
    ) 
}

export default BookingFormsPage
