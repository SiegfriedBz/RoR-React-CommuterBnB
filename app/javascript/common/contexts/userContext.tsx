import React, { useState, useEffect, createContext, useContext } from 'react'
import { useLocalStorage } from '../hooks'
import { IUser, IUserContext } from '../utils/interfaces'

const initUser = {
    userId: undefined,
    email: undefined,
    role: undefined
}

const UserContext = createContext<any>(null)

export const useUserContext = () => useContext<IUserContext>(UserContext)

export const UserContextProvider: React.FC = ({ children }) => {
    const [user, setUser] = useState<IUser>(initUser)

    // onSignUp or onLogin, set token in localStorage => set token in user state
    // onLogout, set token in localStorage to null => set token in user state to null
    const [tokenInStorage, setTokenInStorage] = useLocalStorage('bnbToken', null)
    // tokenInStorage is a STRING OR A JSON STRING ????

    useEffect(() => {
        if (typeof tokenInStorage === 'string') {
            const deserializedToken = JSON.parse(tokenInStorage)

            setUser({
                userId: deserializedToken?.user_id,
                email: deserializedToken?.email,
                role: deserializedToken?.role
            })
        }
    }, [tokenInStorage])

return (
        <UserContext.Provider value={{ user, setTokenInStorage }}>
            {children}
        </UserContext.Provider>
    )
}
