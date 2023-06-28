import React from 'react'
import { NavLink, useParams, Outlet, Navigate } from 'react-router-dom'
import { useFlatsContext } from '../../contexts'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPaperPlane, faReceipt } from '@fortawesome/free-solid-svg-icons'
import { FlatDescription } from '../../components/flats'
import { HostedBy, ButtonSlide } from '../../components'
import { LoadingSpinners } from '../../components'

const RequestFormsPage = () => {
    //* hooks
    const { id: selectedFlatId } = useParams()
    
    //* context
    const { flats } = useFlatsContext()

    if(!selectedFlatId) return <LoadingSpinners />

    const flat = flats.find(flat => flat.flatId === parseInt(selectedFlatId))

    if(!flat) return <Navigate to="/" replace={true}/>
    
    return (
        <div className="mb-3">
            <FlatDescription flat={flat} />
        <div className="mt-2 mb-3">
            <HostedBy selectedFlatId={selectedFlatId}/>
        </div>
        <div className="d-flex mb-3">
            <NavLink 
                to="booking"
                state={{ selectedFlatId }}
                >
                    <ButtonSlide
                        className="btn-slide btn-slide-dark right-slide me-2"
                    >
                        <FontAwesomeIcon icon={faReceipt} />{" "}Send a booking request
                    </ButtonSlide>
            </NavLink>
            <NavLink
                to="message"
                state={{ selectedFlatId }}
                >   <ButtonSlide
                        className="btn-slide btn-slide-dark right-slide"
                    >
                        <FontAwesomeIcon icon={faPaperPlane} />{" "}Send a message
                    </ButtonSlide>
            </NavLink>
        </div>
        <Outlet />
      </div>
    ) 
}

export default RequestFormsPage
