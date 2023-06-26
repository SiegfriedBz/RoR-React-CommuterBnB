import React, { useState, useEffect, createContext, useContext } from "react"
import { v4 as uuid } from 'uuid'
import { useFetch } from "../hooks"
import { useAppContext } from "./appContext"
import { useUserContext } from "./userContext"
import { 
    IFlashMessage,
    IMessage,
    IConversation,
    IMessagesContext,
    IMessagesChannelsKeys
 } from '../utils/interfaces'
import { formatMessagesAndSetConversations } from './helpers/formatMessagesAndSetConversations'

interface INewMessage {
    messageId?: number,
    content?: string,
    authorUserId?: number,
    authorEmail?: string,
    recipientUserId?: number,
    recipientEmail?: string,
    messageFlatId?: number,
    transactionRequestId?: number,
    createdAt?: string,
    updatedAt?: string
}

const initNewMessage = {
    messageId: undefined,
    content: undefined,
    authorUserId: undefined,
    authorEmail: undefined,
    recipientUserId: undefined,
    recipientEmail: undefined,
    messageFlatId: undefined,
    transactionRequestId: undefined,
    createdAt: undefined,
    updatedAt: undefined
}

const MessagesContext = createContext(null)

export const useMessagesContext = () => useContext(MessagesContext)

export const MessagesContextProvider: React.FC = ({ children }) => {
    //# hooks & context
    const { getUserMessages } = useFetch()
    const { setFlashMessage } = useAppContext()
    const { user, tokenInStorage: token } = useUserContext()

    //# state
    // set conversations from fetched messages
    const [conversations, setConversations] = useState<IConversation[] | undefined>(undefined)
    const [newMessage, setNewMessage] = useState<INewMessage>(initNewMessage)

    //# state
    // websocket
    const [ws, setWs] = useState(undefined)
    const [guid, setGuid] = useState<number>(uuid())
    const [messagesChannelsKeys, setMessagesChannelsKeys] = useState<IMessagesChannelsKeys | undefined>(undefined)

    // fetch user messages (as author or recipient)
    useEffect(() => {
        if(typeof token !== 'string' || token === '{}') return
        
        (async () => {
            const fetchedData = await getUserMessages()
            if(!fetchedData) return

            const conversations = formatMessagesAndSetConversations(fetchedData)
            setConversations(conversations)
        })()
    }, [token])

    // set (websocket) messagesChannelsKeys
    useEffect(() => {
        if (!conversations) return
    
        const channelKeys = Object.keys(conversations)
        setMessagesChannelsKeys(channelKeys)
    }, [conversations])

    // set websocket
    useEffect(() => {
        if(typeof token !== 'string' || token === '{}') return
        if(!user?.userId || !messagesChannelsKeys) return

        const ws = new WebSocket(`ws://localhost:3000/cable?token=${encodeURIComponent(token)}`)

        // subscribe to all MessagesChannels
        ws.onopen = () => {
            console.log("connected to websocket")

            messagesChannelsKeys.forEach((channelKey) => {
            ws.send(
                JSON.stringify({
                command: "subscribe",
                identifier: JSON.stringify({
                    id: guid,
                    channel: "MessagesChannel",
                    channelKey: channelKey,
                })})
            )})
        }

        ws.onmessage = (e) => {
            const data = JSON.parse(e.data)
            if(data.type === "ping") return
            if(data.type === "welcome") return
            if(data.type === "confirm_subscription") return
            
            const { message } = data
            if(!message) return

            const { 
                message: {
                    id: messageId,
                    author: { userId: authorUserId, email: authorEmail },
                    recipient: { userId: recipientUserId, email: recipientEmail },
                    content,
                    flatId: messageFlatId,
                    transactionRequestId,
                    createdAt,
                    updatedAt
                }
                } = message


            const newMessage: INewMessage = {
                messageId,
                content,
                authorUserId,
                authorEmail,
                recipientUserId,
                recipientEmail,
                messageFlatId,
                transactionRequestId,
                createdAt,
                updatedAt
            }
            
            // set new message
            setNewMessage(newMessage)
        }
        
        // return () => {
        //     console.log('===========')
        //     console.log('MessagesContextProvider useEffect  ws.onclose')
        //     ws.close()
        // }

        setWs(ws)
    }, [user, token, messagesChannelsKeys])

    // on newMessage: fetch all messages & set conversations
    useEffect(() => {
        if(!newMessage?.messageId) return
        
        //  & set notification to recipient
        (async () => {
            const fetchedData = await getUserMessages()
            
            if(!fetchedData) return

            const conversations = formatMessagesAndSetConversations(fetchedData)

            setConversations(conversations)
        })()
    }, [newMessage])

    // on newMessage: set notification to recipient
    useEffect(() => {
        if(!newMessage?.messageId) return
        
        const { authorEmail, recipientUserId } = newMessage

        if(user?.userId === recipientUserId) {
            const authorName = authorEmail.split("@")[0]
            const notificationMessage = `New message from ${authorName}`
            setFlashMessage({ message: notificationMessage, type: "success"})
        }

        setNewMessage(initNewMessage)
    }, [newMessage])

    return (
        <MessagesContext.Provider value={{
            conversations,
            setConversations,
        }}>
            { children }
        </MessagesContext.Provider>
    )
}
