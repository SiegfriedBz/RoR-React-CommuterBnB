import React, { useState, useEffect, createContext, useContext } from 'react'
import { useLocalStorage } from '../hooks'
import { IUser, IUserContext } from '../utils/interfaces'
import jwt_decode from 'jwt-decode'

interface IDecodedToken {
    user_id?: number,
    email?: string,
    role?: string
}

const initUser = {
    userId: undefined,
    email: undefined,
    role: undefined
}

const UserContext = createContext(null)

export const useUserContext = () => useContext(UserContext)

const decodeToken = (tokenInStorage: string): IDecodedToken => {
    if(typeof tokenInStorage !== 'string' || tokenInStorage === '{}') {
        return { user_id: undefined, email: undefined, role: undefined }
    }

    const deserializedToken = JSON.parse(tokenInStorage)
    return jwt_decode(deserializedToken)
}

export const UserContextProvider = ({ children }) => {
    //* state
    // token in local storage
    const [tokenInStorage, setTokenInStorage] = useLocalStorage('bnbToken', null)
   
    // user 
    const [user, setUser] = useState(() => {
        const decodedToken = decodeToken((tokenInStorage))

        if(!decodedToken?.user_id || !decodedToken?.email || !decodedToken?.role) {
            return initUser
        }

        const { user_id, email, role } = decodedToken
        return { userId: user_id, email, role }
    })

    //* effects
    // set user from token in local storage
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
        <UserContext.Provider value={{
                user,
                tokenInStorage,
                setTokenInStorage
            }}>
            {children}
        </UserContext.Provider>
    )
}
