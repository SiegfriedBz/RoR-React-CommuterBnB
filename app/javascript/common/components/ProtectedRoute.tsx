import React from 'react'
import { Navigate } from 'react-router-dom'
import { useUserContext } from '../contexts'

interface IProps {
    children: React.ReactNode
}

const ProtectedRoute: React.FC<IProps> = ({ children }) => {
    const { user } = useUserContext()
    
    if (!user?.userId) {
        return (
            <Navigate 
                to="/" 
                replace={true} 
            />
        )
    }

    return <>{ children }</>
}

export default ProtectedRoute
