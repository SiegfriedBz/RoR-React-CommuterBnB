import React, { useState, useEffect, createContext, useContext } from 'react'
import jwt_decode from 'jwt-decode'
import { useLocalStorage } from '../hooks'
import { IUserContext } from '../utils/interfaces'

interface IDecodedToken {
    user_id?: number,
    email?: string,
    description?: string,
    role?: string,
    image?: string
}

const initUser = {
    userId: undefined,
    email: undefined,
    description: undefined,
    role: undefined,
    image: undefined
}

const UserContext = createContext(null)

export const useUserContext = (): IUserContext => useContext(UserContext)

const decodeToken = (tokenInStorage: string): IDecodedToken => {
    if(typeof tokenInStorage !== 'string' || tokenInStorage === '{}') {
        return initUser
    }

    const deserializedToken = JSON.parse(tokenInStorage)
    return jwt_decode(deserializedToken)
}

interface IProps {
    children: React.ReactNode
}

export const UserContextProvider: React.FC<IProps> = ({ children }) => {
    const [tokenInStorage, setTokenInStorage] = useLocalStorage('bnbToken', null)
    const [user, setUser] = useState(() => {
        const decodedToken = decodeToken((tokenInStorage))

        if(!decodedToken?.user_id || !decodedToken?.email || !decodedToken?.role) {
            return initUser
        }

        const { user_id, email, description, role, image } = decodedToken
        return { userId: user_id, email, description, role, image }
    })

    //* effects
    // set user from token in local storage
    useEffect(() => {
        const decodedToken = decodeToken(tokenInStorage)
        if (!decodedToken) {
            // if no user logged in / on log out
            return setUser(initUser)
        }

        const { user_id, email, description, role, image } = decodedToken
        setUser({ userId: user_id, email, description, role, image })
    }, [tokenInStorage])

    return (
        <UserContext.Provider value={{
                user,
                setUser,
                tokenInStorage,
                setTokenInStorage
            }}>
            {children}
        </UserContext.Provider>
    )
}
