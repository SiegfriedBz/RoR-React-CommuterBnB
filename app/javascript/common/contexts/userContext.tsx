import React, { useState, useEffect, createContext, useContext } from 'react'
import jwt_decode from 'jwt-decode'
import { useLocalStorage } from '../hooks'
import { IUser, IUserContext } from '../utils/interfaces'

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
    const [user, setUser] = useState<IUser>(initUser)
    const [tokenInStorage, setTokenInStorage] = useLocalStorage('bnbToken', null)

    //* effects
    // set user on mount, athenticate and fetch user if token in storage
    useEffect(() => {
        const decodedToken = decodeToken((tokenInStorage))

        if(!decodedToken?.user_id) {
            return setUser(initUser)
        } else {
            (async () => {
                const userId = decodedToken.user_id
                if(!userId) return

                try{
                    const response = await getUserDetails(userId)
                    if(!response.ok) {
                        const error = await response.json()
                        throw new Error(error)
                    }

                    const data = await response.json()
                    const { user } = data
                    console.log('user: ', user)

                    setUser(user)
                } catch (err) {
                    console.log('err: ', err)
                }
            })()
        }
    }, [tokenInStorage])

    const getUserDetails = async (id: number) => {
        const url = `/api/v1/users/${id}`

        return await fetch(url, {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${JSON.parse(tokenInStorage)}` }
        })
    }

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
