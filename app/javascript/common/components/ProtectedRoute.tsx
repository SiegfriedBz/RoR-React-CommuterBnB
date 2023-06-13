import React from 'react'
import { Navigate } from 'react-router-dom'
import { useUserContext } from '../contexts'

const ProtectedRoute: React.FC<any, any> = ({ children }) => {
    const { user } = useUserContext()
    
    if (!user?.userId) {
        return (
            <Navigate 
                to="/auth" 
                replace={true} 
                // state={{message: "Please loggin to access this page"}}
            />
        )
    }

    return <>{ children }</>
}

export default ProtectedRoute
