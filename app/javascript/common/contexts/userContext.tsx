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

const decodeToken = (tokenInStorage: string) => {
    if (typeof tokenInStorage !== 'string' || tokenInStorage === '{}') return

    const deserializedToken = JSON.parse(tokenInStorage)
    return jwt_decode(deserializedToken)
}

export const UserContextProvider: React.FC = ({ children }) => {

    const [tokenInStorage, setTokenInStorage] = useLocalStorage('bnbToken', null)

    const [user, setUser] = useState<IUser>(() => {
        const decodedToken = decodeToken((tokenInStorage))
        if (!decodedToken) return initUser

        const { user_id, email, role } = decodedToken
        return { userId: user_id, email, role }
    })

    useEffect(() => {
        const decodedToken = decodeToken(tokenInStorage)
        if (!decodedToken) {
            // if no user logged in || on log out
            return setUser(initUser)
        }

        const { user_id, email, role } = decodedToken
        setUser({ userId: user_id, email, role })
    }, [tokenInStorage])
    
    return (
        <UserContext.Provider value={{ user, setTokenInStorage }}>
            {children}
        </UserContext.Provider>
    )
}
