import React from 'react'
import { NavLink, useParams, Outlet, Navigate } from 'react-router-dom'
import { useFlatsContext } from '../../contexts'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPaperPlane, faReceipt } from '@fortawesome/free-solid-svg-icons'
import { FlatDescription } from '../../components/flats'
import { HostedBy } from '../../components'
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
                className="btn btn-outline-dark me-2"
                state={{ selectedFlatId }}
                >
                    <FontAwesomeIcon icon={faReceipt} />{" "}Send a booking request
            </NavLink>
            <NavLink
                to="message"
                className="btn btn-outline-dark"
                state={{ selectedFlatId }}
                >
                    <FontAwesomeIcon icon={faPaperPlane} />{" "}Send a message
            </NavLink>
        </div>
        <Outlet />
      </div>
    ) 
}

export default RequestFormsPage
