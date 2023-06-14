import React, { useEffect, useReducer, createContext, useContext, useCallback } from 'react'
import { useFetch } from '../hooks'
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
    const [state, dispatch] = useReducer(flatsReducer, initState)
    const { getAllFlats } = useFetch()

    useEffect(() => {        
        (async () => {
            const fetchedData = await getAllFlats()
            if (!fetchedData) return

            const [response, data] = fetchedData
            if(!data) return

            setFlatsInContext(data.flats)
        })()
    }, [])

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
        console.log("updateFlatInContext flat", flat)
        dispatch({
            type: flatsActions.UPDATE_FLAT,
            payload: flat
        })
    }
    
    return (
        <FlatsContext.Provider value={
            { ...state,
            setFlatsInContext,
            addFlatInContext,
            updateFlatInContext }}
        >
            { children }
        </FlatsContext.Provider>
    )
}
