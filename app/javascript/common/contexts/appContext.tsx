import React, { useState, createContext, useContext } from 'react'
import { IFlashMessage, IAppContext } from '../utils/interfaces'

export const initFlashMessage = {
    message: null,
    type: "success",
}

const AppContext = createContext(null)

export const useAppContext = (): IAppContext => useContext(AppContext)

export const AppContextProvider: React.FC = ({ children }: any ) => {
    const [flashMessage, setFlashMessage] = useState<IFlashMessage>(initFlashMessage)
    const [isLoading, setIsLoading] = useState<boolean>(false)

    return (
        <AppContext.Provider value={{
                flashMessage,
                setFlashMessage,
                isLoading,
                setIsLoading
            }}>
            { children }
        </AppContext.Provider>
    )
}
