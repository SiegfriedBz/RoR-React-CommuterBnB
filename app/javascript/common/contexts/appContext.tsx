import React, { useState, useEffect, useRef, createContext, useContext } from 'react'
import { IFlashMessage, IAppContext } from '../utils/interfaces'

export const initFlashMessage = {
    message: null,
    type: "success",
}

const AppContext = createContext(null)

export const useAppContext = (): IAppContext => useContext(AppContext)

interface IProps {
    children: React.ReactNode
}

export const AppContextProvider: React.FC<IProps> = ({ children } ) => {
    const [flashMessage, setFlashMessage] = useState<IFlashMessage>(initFlashMessage)
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const mapboxTokenRef = useRef(null)

    useEffect(() => {
        const root = document.getElementById('root')
        if(!root) return

        const mapboxToken = root.dataset['mapbox']
        if(!mapboxToken) return

        mapboxTokenRef.current = mapboxToken

      }, [])

    return (
        <AppContext.Provider value={{
                mapboxTokenRef,
                flashMessage,
                setFlashMessage,
                isLoading,
                setIsLoading
            }}>
            { children }
        </AppContext.Provider>
    )
}
