import React from 'react'
import { useAppContext } from '../contexts'

const BASE_URL = '/api/v1'

const fetchDefaultOptions = {
    method: 'GET',
}

export const useFetch = () => {
    // context
    const { setFlashMessage, setIsLoading } = useAppContext()

    // fetch
    const fetchData = async (url: string, options={}, expectedStatus=200) => {
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
            setFlashMessage({ message: err.message, type: "alert" })
            console.log("err", err);
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

    return { 
        authenticate
     }
}
