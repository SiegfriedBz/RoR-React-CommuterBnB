import React, { useCallback, useState, useEffect } from 'react'
import { v4 as uuid } from 'uuid'
import { useAppContext, useUserContext } from '../contexts'
import { formatAndSetMessages } from './helpers/formatAndSetMessages'

interface IMessagesChannelsKeys {
    messagesChannelsKeys : string[] | undefined,
    setMessagesChannelsKeys: (messagesChannelsKeys: string[] | undefined) => void
}

const BASE_URL = '/api/v1'
const FLATS_URL = `${BASE_URL}/flats`
const TRANSACTION_REQUEST_URL = `${BASE_URL}/transaction_requests`

const fetchDefaultOptions = {
    method: 'GET',
}

export const useFetch = () => {
    console.log('===========')
    console.log('===========')
    console.log('useFetch')
    
    //# context
    const { setFlashMessage, setIsLoading } = useAppContext()
    const { user, tokenInStorage: token, messages, setMessages, setConversations } = useUserContext()

    //# state
    // websocket
    const [ws, setWs] = useState(undefined)
    const [guid, setGuid] = useState<number>(uuid())
    const [messagesChannelsKeys, setMessagesChannelsKeys] = useState<string[] | undefined>(undefined)

    // ************************************************************

        // fetch user messages (as author or recipient)
        useEffect(() => {
            if (token === "{}") return
            
            (async () => {
                console.log('===========')
                console.log('useFetch useEffect getUserMessages')
                const fetchedData = await getUserMessages()
                const messages = formatAndSetMessages(fetchedData)
                setMessages(messages)
            })()
        }, [token])
        
        // sort messages by flat#id - users#id (author and recipient)
        const sortMessages = () => {
            return messages?.reduce((acc, message) => {
    
            const { messageFlatId, authorUserId, recipientUserId } = message
    
            const minKey = Math.min(authorUserId, recipientUserId)
            const maxKey = Math.max(authorUserId, recipientUserId)
    
            const flatKey = `flat-${messageFlatId}`
    
            const flatUsersKey = `${flatKey}-users-${minKey}-${maxKey}`
    
            return { ...acc, [flatUsersKey]: [ ...(acc[flatUsersKey] || []), message ] }
            }, {})
            }
    
        // set conversations & websocket messagesChannelsKeys
        useEffect(() => {
            if (!messages) return

            console.log('===========')
            console.log('useFetch useEffect sortMessages')
            const conversations = sortMessages()
            if(!conversations) return
        
            const channelKeys = Object.keys(conversations)
            setConversations(conversations)
            setMessagesChannelsKeys(channelKeys)
        }, [messages])
    
        // set websocket
        useEffect(() => {
            if (token === "{}") return

            console.log('===========')
            console.log('useFetch useEffect new WebSocket')
    
            const ws = new WebSocket(`ws://localhost:3000/cable?token=${encodeURIComponent(token)}`)
            setWs(ws)
        }, [token])
    
        // subscribe to all MessagesChannels
        useEffect(() => {
            if (!ws || !messagesChannelsKeys) return

            ws.onopen = () => {
                console.log('===========')
                console.log('useFetch useEffect  ws.onopen ')
                console.log("connected to websocket")
    
                messagesChannelsKeys.forEach((channelKey) => {
                ws.send(
                    JSON.stringify({
                    command: "subscribe",
                    identifier: JSON.stringify({
                        id: guid,
                        channel: "MessagesChannel",
                        channelKey: channelKey,
                    })
                    })
                )
                })
            }

            ws.onmessage = (e) => {
                const data = JSON.parse(e.data)

                if(data.type === "ping") return
                if(data.type === "welcome") return
                if(data.type === "confirm_subscription") return
                
                const { message } = data

                if(!message) return

                console.log('===========')
                console.log('useFetch useEffect  ws.onmessage', message)

                const { 
                    message: {
                        id,
                        author,
                        recipient,
                        content,
                        flatId,
                        transactionRequestId,
                        createdAt,
                        updatedAt
                    }
                    } = message

                // notfication to recipient
                let notificationMessage: string | null = null
                if(user?.userId === recipient?.userId) {
                    const authorName = author.email.split("@")[0]
                    notificationMessage = `New message from ${authorName}`
                }

                // fetch all messages
                (async () => {
                    const fetchedData = await getUserMessages()
                    
                    const messages = formatAndSetMessages(fetchedData)

                    setFlashMessage({ message: notificationMessage, type: "success" })
                    setMessages(messages)
                })()
       
            }
        }, [user, ws, messagesChannelsKeys])


    // ************************************************************

    //# fetch
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
        console.log('===========')
        console.log('useFetch authenticate')
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
        console.log('===========')
        console.log('useFetch updateUser')
        const url = `${BASE_URL}/signup`
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
        console.log('===========')
        console.log('useFetch getAllFlats')
        return await fetchData(FLATS_URL, {
            headers: { 'Content-Type': 'application/json' } }, 200)
    }, [])

    const getFlatDetails = async (id) => {
        console.log('===========')
        console.log('useFetch getFlatDetails id', id)
        return await fetchData(`${FLATS_URL}/${id}`, {
            headers: { 'Content-Type': 'application/json' } }, 200)
    }

    const createFlat = async (formData) => {
        console.log('===========')
        console.log('useFetch createFlat')
        return await fetchData(FLATS_URL, { 
            method: 'POST', 
            headers: { 'Authorization': `Bearer ${JSON.parse(token)}` },
            body: formData 
        }, 201)
    }

    const updateFlat = async (id, formData) => {
        console.log('===========')
        console.log('useFetch updateFlat')
        return await fetchData(`${FLATS_URL}/${id}`, { 
            method: 'PATCH', 
            headers: { 'Authorization': `Bearer ${JSON.parse(token)}` },
            body: formData 
        }, 200)
    }

    const deleteFlat = async (id) => {
        console.log('===========')
        console.log('useFetch deleteFlat')
        return await fetchData(`${FLATS_URL}/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${JSON.parse(token)}` } }, 200)
    }
        
    //* transaction (booking) requests *//
    const getUserTransactionRequests = async () => {
        console.log('===========')
        console.log('useFetch getUserTransactionRequests')
        return await fetchData(TRANSACTION_REQUEST_URL, { 
            headers: { 
                'Authorization': `Bearer ${JSON.parse(token)}`,
                'Content-Type': 'application/json'
            }
        }, 200)
    }

    const createTransactionRequest = async (flatId, formValues) => {
        console.log('===========')
        console.log('useFetch createTransactionRequest')
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
    const updateTransactionRequest = async (transactionRequestId, currentUserIsTransactionInitiator, currentUserAgreed) => {
        console.log('===========')
        console.log('useFetch updateTransactionRequest')
        const currentUserAgreedKey = currentUserIsTransactionInitiator ? "initiator_agreed" : "responder_agreed" 

        let body = { transaction_request: {[currentUserAgreedKey]: currentUserAgreed} } 

        return await fetchData(`${TRANSACTION_REQUEST_URL}/${transactionRequestId}`, {
            method: 'PATCH',
            headers: { 
                'Authorization': `Bearer ${JSON.parse(token)}`,
                'Content-Type': 'application/json' },
            body: JSON.stringify(body), 
        }, 200)
    }

    const deleteTransactionRequest = async (transactionRequestId) => {
        console.log('===========')
        console.log('useFetch deleteTransactionRequest')
        return await fetchData(`${TRANSACTION_REQUEST_URL}/${transactionRequestId}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${JSON.parse(token)}` } }, 200) 
    }

    //* messages *//
    const getUserMessages = async () => {
        console.log('===========')
        console.log('useFetch getUserMessages')
        const url = `${BASE_URL}/messages`

        return await fetchData(url, { 
            headers: { 
                'Authorization': `Bearer ${JSON.parse(token)}`
            },
        }, 200)
    }
    
    // messageFlatId must be constant in a "conversation"
    const createMessage = async (content, messageRecipientId, messageFlatId, messageTransactionRequestId) => {
        console.log('===========')
        console.log('useFetch createMessage')
        const url = `${BASE_URL}/messages`
        const body = { message: { 
            content,
            recipient_id: parseInt(messageRecipientId),
            flat_id: parseInt(messageFlatId),
            transaction_request_id: parseInt(messageTransactionRequestId)
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

    return { 
        authenticate,
        updateUser,
        getAllFlats,
        getFlatDetails,
        createFlat,
        updateFlat,
        deleteFlat,
        getUserTransactionRequests,
        createTransactionRequest,
        updateTransactionRequest,
        deleteTransactionRequest,
        getUserMessages,
        createMessage
     }
}
