import React, { useReducer, createContext, useContext, useCallback } from 'react'
import { flatsReducer } from '../reducers'
import { flatsActions } from "../actions"
import { IFlat, IFlatsContext } from '../utils/interfaces'

export const initState = {
    flats: [],
}

export const FlatsContext = createContext(null)

export const useFlatsContext = (): IFlatsContext => {
    return useContext(FlatsContext)
}

export const FlatsContextProvider = ({ children }: any ) => {

    const [state, dispatch] = useReducer(flatsReducer, initState)

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
