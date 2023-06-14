import React, { useState, useEffect, createContext, useContext } from 'react'
import { useLocalStorage } from '../hooks'
import { IUser, IUserContext } from '../utils/interfaces'
import jwt_decode from 'jwt-decode'

const initUser = {
    userId: undefined,
    email: undefined,
    role: undefined
}

const UserContext = createContext<any>(null)

export const useUserContext = () => useContext<IUserContext>(UserContext)

export const UserContextProvider: React.FC = ({ children }) => {
    const [user, setUser] = useState<IUser>(initUser)

    const [tokenInStorage, setTokenInStorage] = useLocalStorage('bnbToken', null)

    useEffect(() => {
        if (typeof tokenInStorage !== 'string' || tokenInStorage === '{}') {
            setUser(initUser)
            return
        }
        const deserializedToken = JSON.parse(tokenInStorage)
        const decodedToken = jwt_decode(deserializedToken)

        if(!decodedToken) return 

        const { user_id, email, role } = decodedToken

        setUser({
            userId: user_id || undefined,
            email: email || undefined,
            role: role || undefined
        })
    }, [tokenInStorage])

return (
        <UserContext.Provider value={{ user, setTokenInStorage }}>
            {children}
        </UserContext.Provider>
    )
}
