import React, { useCallback } from 'react'
import { useLocalStorage } from './useLocalStorage'
import { useAppContext, useFlatsContext } from '../contexts'

const BASE_URL = '/api/v1'
const FLATS_URL = `${BASE_URL}/flats`

const fetchDefaultOptions = {
    method: 'GET',
}

export const useFetch = () => {
    // hooks 
    const [token, setToken] = useLocalStorage('bnbToken', null)
    // context
    const { setFlashMessage, setIsLoading } = useAppContext()

    // fetch
    const fetchData = async (url: string, options={}, expectedStatus: number) => {
        setIsLoading(true)
        setFlashMessage({ message: null, type: "success" })

        try{
            const response: Response = await fetch(url, { ...fetchDefaultOptions, ...options })
            if (response.status === expectedStatus) {
                const data = await response.json()
                
                return [response, data]
            } else {
                const error = await response.json()
                throw new Error(error)
            }
        } catch (err) {
            setFlashMessage({ message: err.message, type: "danger" })
        } finally {
            setIsLoading(false)
        }
    }

    //* user
    interface IFormData {
        email: string,
        password: string,
        password_confirmation?: string
    }

    const authenticate = async (formData: IFormData, isLoginForm: boolean) => {
        const path = isLoginForm ? '/login' : '/signup'
        const url = `${BASE_URL}${path}`
        const { email, password, password_confirmation } = formData

        const body = { user: { email, password } } 
        const expectedStatus = isLoginForm ? 200 : 201

        return await fetchData(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body), 
        }, expectedStatus)
    }

    //* flats
    const getAllFlats = useCallback(async() => {
        return await fetchData(FLATS_URL, {
            headers: { 'Content-Type': 'application/json' } }, 200)
    }, [])

    const getFlat = async (id) => {
        return await fetchData(`${FLATS_URL}/${id}`, {
            headers: { 'Content-Type': 'application/json' } }, 200)
    }

    const createFlat = async (formData) => {
        return await fetchData(FLATS_URL, { 
            method: 'POST', 
            headers: { 'Authorization': `Bearer ${JSON.parse(token)}` },
            body: formData 
        }, 201)
    }

    return { 
        authenticate,
        getAllFlats,
        getFlat,
        createFlat
     }
}
