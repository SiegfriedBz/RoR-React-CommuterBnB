import React from 'react'
import { NavLink, useParams, Outlet, Navigate } from 'react-router-dom'
import { useFlatsContext } from '../../contexts'
import { FlatDescription } from '../../components/flats'
import { HostedBy } from '../../components'
import { LoadingSpinners } from '../../components'

const RequestFormsPage = () => {
    const { id: selectedFlatId } = useParams()
    // contexts
    const { flats } = useFlatsContext()

    if(!selectedFlatId) return <LoadingSpinners />

    const flat = flats.find(flat => flat.flatId === parseInt(selectedFlatId))

    if(!flat) return <Navigate to="/" replace={true}/>
    
    return (
        <div className="mb-3">
            <FlatDescription flat={flat} />
        <div className="mt-2 mb-3">
            <HostedBy />
        </div>
        <div className="d-flex mb-3">
            <NavLink 
                to="booking"
                className="btn btn-outline-primary me-2">
                Send a booking request
            </NavLink>
            <NavLink
                to="message"
                className="btn btn-outline-primary">
                Send a message 
            </NavLink>
        </div>
        <Outlet />
      </div>
    ) 
}

export default RequestFormsPage
