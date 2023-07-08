import React, { useCallback } from 'react'
import { useAppContext, useUserContext } from '../contexts'

const BASE_URL = '/api/v1'
const FLATS_URL = `${BASE_URL}/flats`
const BOOKING_REQUEST_URL = `${BASE_URL}/transaction_requests`
const MESSAGES_URL = `${BASE_URL}/messages`
const FAVORITES_URL = `${BASE_URL}/favorites`

const fetchDefaultOptions = {
    method: 'GET',
}

export const useFetch = () => {
    //* context
    const { setFlashMessage, setIsLoading } = useAppContext()
    const { setTokenInStorage, tokenInStorage: token } = useUserContext()
    //* fetch
    const fetchData = async (url: string, options={}, expectedStatus: number) => {
        setIsLoading(true)
        setFlashMessage({ message: null, type: "success" })

        try{
            const response: Response = await fetch(url, { ...fetchDefaultOptions, ...options })
            
            if (response.status === 422) {
                // if unprocessable entity (e.g. flat already booked)
                const message = await response.json()
                setFlashMessage({ message: message.message, type: "warning" })

            } else if (response.status === expectedStatus) {
                // if status is expected
                const data = await response.json()
                return [response, data]

            } else {
                const error = await response.json()
                throw new Error(error)
            }

        } catch (err) {
            // logout user
            setTokenInStorage("{}")
            console.log('err: ', err)
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

    const updateUser = async (formData) => {
        const url = `${BASE_URL}/signup`

        return await fetchData(url, {
            method: 'PATCH',
            headers: { 'Authorization': `Bearer ${JSON.parse(token)}` },
            body: formData
        }, 200)
    }

    //* flats *//
    const getFlats = useCallback(async(queryParams) => {
        const url = queryParams ? `${FLATS_URL}/search?${queryParams}` : FLATS_URL
        
        return await fetchData(url, {
            headers: { 'Content-Type': 'application/json' },
        }, 200)
    }, [])


    const getFlatDetails = async (id) => {
        return await fetchData(`${FLATS_URL}/${id}`, {
            headers: { 'Content-Type': 'application/json' },
        }, 200)
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
    
    //* favorites *//
    const getFlatsWithUserFavorites = async () => {
        return await fetchData(`${FAVORITES_URL}`, {
            headers: { 'Authorization': `Bearer ${JSON.parse(token)}` } }, 200)
    }

    const addFlatToUserFavorites = async (flatId) => {
        return await fetchData(`${FLATS_URL}/${flatId}/favorites`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${JSON.parse(token)}` } }, 201)
    }

    const removeFlatFromUserFavorites = async (flatId) => {        
        return await fetchData(`${FLATS_URL}/${flatId}/favorites`, {
            method: "DELETE",
            headers: { 'Authorization': `Bearer ${JSON.parse(token)}` } }, 200)
    }

    //* transaction (booking) requests *//
    const getUserBookingRequests = async () => {
        return await fetchData(BOOKING_REQUEST_URL, { 
            headers: { 
                'Authorization': `Bearer ${JSON.parse(token)}`,
                'Content-Type': 'application/json'
            }
        }, 200)
    }

    const createBookingRequest = async (flatId, formValues) => {
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

    // update current user agreement on booking request
    const updateBookingRequest = async (args) => {
        const { transactionRequestId, status, currentUserIsTransactionInitiator, currentUserAgreed } = args
        
        let body = {}

         if(status) {
            // update booking request status (rejected)
            body = { transaction_request: { status } }
        } else {
            // update current user agreement
            const currentUserAgreedKey = currentUserIsTransactionInitiator ? "initiator_agreed" : "responder_agreed" 
            body = { transaction_request: {
                [currentUserAgreedKey]: currentUserAgreed
            } } 
        }
        return await fetchData(`${BOOKING_REQUEST_URL}/${transactionRequestId}`, {
            method: 'PATCH',
            headers: { 
                'Authorization': `Bearer ${JSON.parse(token)}`,
                'Content-Type': 'application/json' },
            body: JSON.stringify(body), 
        }, 200)
    }

    //* payments *//
    const getUserPayments = async () => {
        return await fetchData("/api/v1/payments", {
            headers: { 'Authorization': `Bearer ${JSON.parse(token)}` } }, 200)
    }

    const createPayment = async (transactionRequestId, payerId, payeeId, amountInCents) => {
        const url = `${BASE_URL}/transaction_requests/${transactionRequestId}/payments`
        
        const body = { payment: {
            transaction_request_id: parseInt(transactionRequestId),
            payer_id: parseInt(payerId),
            payee_id: parseInt(payeeId),
            amount_in_cents: parseInt(amountInCents)
        } }

        return await fetchData(url, { 
            method: 'POST', 
            headers: { 
                'Authorization': `Bearer ${JSON.parse(token)}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body) 
        }, 201)
    }

    //* reviews *//
    const createReview = async (flatId, transactionRequestId, review) => {
        const url = `/api/v1/flats/${flatId}/transaction_requests/${transactionRequestId}/reviews`
        const body = { review: { ...review,
            transaction_request_id: transactionRequestId,
            flat_id: flatId
         } }
        
        return await fetchData(url, { 
            method: 'POST', 
            headers: { 
                'Authorization': `Bearer ${JSON.parse(token)}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body) 
        }, 201)
    }

    //* messages *//
    const getUserMessages = async () => {
        return await fetchData(MESSAGES_URL, { 
            headers: { 
                'Authorization': `Bearer ${JSON.parse(token)}`
            },
        }, 200)
    }
    
    // messageFlatId must be constant in a "conversation"
    const createMessage = async (content, messageRecipientId, messageFlatId, messageTransactionRequestId) => {
        const body = { message: { 
            content,
            recipient_id: parseInt(messageRecipientId),
            flat_id: parseInt(messageFlatId),
            transaction_request_id: parseInt(messageTransactionRequestId)
         } } 

        return await fetchData(MESSAGES_URL, { 
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
        getFlats,
        getFlatDetails,
        createFlat,
        updateFlat,
        deleteFlat,
        getUserBookingRequests,
        createBookingRequest,
        updateBookingRequest,
        getUserPayments,
        createPayment,
        getUserMessages,
        createMessage,
        getFlatsWithUserFavorites,
        addFlatToUserFavorites,
        removeFlatFromUserFavorites,
        createReview
    }
}
