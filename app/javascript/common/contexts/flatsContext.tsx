import React, { useEffect, useReducer, createContext, useContext, useCallback } from 'react'
import { useFetch } from '../hooks'
import { useUserContext } from '../contexts'
import { flatsReducer } from '../reducers'
import { flatsActions } from "../actions"
import { IFlatsContext } from '../utils/interfaces'

export const initState = {
    flats: [],
}

export const FlatsContext = createContext(null)

export const useFlatsContext = (): IFlatsContext => {
    return useContext(FlatsContext)
}

export const FlatsContextProvider = ({ children }: any ) => {
    const { user } = useUserContext()
    const [state, dispatch] = useReducer(flatsReducer, initState)
    const { getAllFlats, getAllFlatsWithUserFavorites } = useFetch()

    useEffect(() => {        
        (async () => {
            const fetchedData = await getAllFlats()
            if (!fetchedData) return

            const [response, data] = fetchedData
            if(!data) return

            setFlatsInContext(data.flats)
        })()
    }, [])

    useEffect(() => {     
        if(!user?.userId) return

        (async () => {
            const fetchedData = await getAllFlatsWithUserFavorites()
            if (!fetchedData) return

            const [response, data] = fetchedData
            if(!data) return

            setFlatsInContext(data.flats)
        })()
    }, [user])

    const setFlatsInContext: IFlatsContext["setFlatsInContext"] = useCallback((flats) => {
        dispatch({
            type: flatsActions.SET_ALL_FLATS,
            payload: flats
        })
    }, [dispatch])

    const addFlatInContext: IFlatsContext["addFlatInContext"] = (flat) => {
        dispatch({
            type: flatsActions.ADD_FLAT,
            payload: flat
        })
    }

    const updateFlatInContext: IFlatsContext["updateFlatInContext"] = (flat) => {
        dispatch({
            type: flatsActions.UPDATE_FLAT,
            payload: flat
        })
    }

    const deleteFlatInContext: IFlatsContext["deleteFlatInContext"] = (flatId) => {
        dispatch({
            type: flatsActions.DELETE_FLAT,
            payload: flatId
        })
    }
    
    return (
        <FlatsContext.Provider value={
            { ...state,
            setFlatsInContext,
            addFlatInContext,
            updateFlatInContext,
            deleteFlatInContext
         }}
        >
            { children }
        </FlatsContext.Provider>
    )
}
