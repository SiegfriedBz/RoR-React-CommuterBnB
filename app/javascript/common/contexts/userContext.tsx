import React, { useState, useEffect, createContext, useContext } from 'react'
import { useLocalStorage } from '../hooks'
import { IUser, IUserContext, IMessage, IConversation } from '../utils/interfaces'
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
    //* state
    // token in local storage
    const [tokenInStorage, setTokenInStorage] = useLocalStorage('bnbToken', null)
    // fetched user messages
    const [messages, setMessages] = useState<IMessage[] | undefined>(undefined)
    // sort messages to set conversations
    const [conversations, setConversations] = useState<IConversation[] | undefined>(undefined)
    // user 
    const [user, setUser] = useState<IUser>(() => {
        const decodedToken = decodeToken((tokenInStorage))
        if (!decodedToken) return initUser

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
                setTokenInStorage,
                messages,
                setMessages,
                conversations,
                setConversations,
            }}>
            {children}
        </UserContext.Provider>
    )
}
