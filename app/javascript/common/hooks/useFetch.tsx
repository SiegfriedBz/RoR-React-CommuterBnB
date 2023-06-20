import React, { useCallback } from 'react'
import { useLocalStorage } from './useLocalStorage'
import { useAppContext, useFlatsContext } from '../contexts'

const BASE_URL = '/api/v1'
const FLATS_URL = `${BASE_URL}/flats`
const TRANSACTION_REQUEST_URL = `${BASE_URL}/transaction_requests`

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

    //* user *//
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

    const updateUser = async (changedUser) => {
        const url = `/api/v1/signup`
        const body = { user: changedUser } 

        return await fetch(url, {
            method: 'PATCH',
            headers: { 
                'Authorization': `Bearer ${JSON.parse(token)}`,
                'Content-Type': 'application/json' },
            body: JSON.stringify(body), 
        })
    }

    //* flats *//
    const getAllFlats = useCallback(async() => {
        return await fetchData(FLATS_URL, {
            headers: { 'Content-Type': 'application/json' } }, 200)
    }, [])

    const getFlatDetails = async (id) => {
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

    const updateFlat = async (id, formData) => {
        return await fetchData(`${FLATS_URL}/${id}`, { 
            method: 'PATCH', 
            headers: { 'Authorization': `Bearer ${JSON.parse(token)}` },
            body: formData 
        }, 200)
    }

    const deleteFlat = async (id) => {
        return await fetchData(`${FLATS_URL}/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${JSON.parse(token)}` } }, 200)
    }
        
    //* transaction/booking requests *//
    const createTransactionRequest = async (flatId, formValues) => {
        const body = { transaction_request: formValues } 
        
        return await fetchData(`${FLATS_URL}/${flatId}/transaction_requests`, { 
            method: 'POST', 
            headers: { 
                'Authorization': `Bearer ${JSON.parse(token)}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body) 
        }, 201)
    }

    // update current user agreement on transaction/booking request
    const updateTransactionRequest = async (transactionRequestId, currentUserIsResponder, currentUserAgreed) => {
        const currentUserAgreedKey = currentUserIsResponder ? "responder_agreed" : "initiator_agreed"

        let body = { transaction_request: {[currentUserAgreedKey]: currentUserAgreed} } 

        return await fetchData(`${TRANSACTION_REQUEST_URL}/${transactionRequestId}`, {
            method: 'PATCH',
            headers: { 
                'Authorization': `Bearer ${JSON.parse(token)}`,
                'Content-Type': 'application/json' },
            body: JSON.stringify(body), 
        }, 200)
    }

    const getUserTransactionRequests = async () => {
        return await fetchData(TRANSACTION_REQUEST_URL, { 
            headers: { 
                'Authorization': `Bearer ${JSON.parse(token)}`,
                'Content-Type': 'application/json'
            }
        }, 200)
    }

    //* messages *//
    const getUserMessages = async () => {
        const url = "api/v1/messages"

        return await fetchData(url, { 
            headers: { 
                'Authorization': `Bearer ${JSON.parse(token)}`
            },
        }, 200)
    }
    
    // messageFlatId must be constant in a "conversation"
    const createMessage = async (content, messageRecipientId, messageFlatId, messageTransactionRequestId) => {
        const url = `/api/v1/messages`
        const body = { message: { 
            content,
            recipient_id: messageRecipientId,
            flat_id: messageFlatId,
            transaction_request_id: messageTransactionRequestId
         } } 

        console.log("====useFetch createMessage url, body", url, body)

        return await fetchData(url, { 
            method: 'POST', 
            headers: { 
                'Authorization': `Bearer ${JSON.parse(token)}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body) 
        }, 201)
    }

    return { 
        authenticate,
        updateUser,
        getAllFlats,
        getFlatDetails,
        createFlat,
        updateFlat,
        deleteFlat,
        createTransactionRequest,
        updateTransactionRequest,
        getUserTransactionRequests,
        getUserMessages,
        createMessage
     }
}
