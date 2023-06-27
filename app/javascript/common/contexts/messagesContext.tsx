import React, { useRef, useState, useEffect, createContext, useContext } from "react"
import { v4 as uuid } from 'uuid'
import { useFetch } from "../hooks"
import { useAppContext } from "./appContext"
import { useUserContext } from "./userContext"
import { formatMessagesAndSetConversations } from './helpers/formatMessagesAndSetConversations'
import { 
    IUser,
    IFlashMessage,
    IIncomingMessage,
    IMessage,
    IConversation,
    IMessagesContext,
    IMessagesChannelsKeys
 } from '../utils/interfaces'

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
    const notificationRef = useRef<IIncomingMessage | undefined>(undefined)

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

            const [response, data] = fetchedData
            if(!response.ok || !data?.messages) return
        
            const fetchedMessages = data?.messages

            const conversations = formatMessagesAndSetConversations(fetchedMessages)
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
            
            // if(!!data?.message) return
            const inComingMessage: IIncomingMessage =  data.message.message
            const inComingConversation: IConversation = formatMessagesAndSetConversations([inComingMessage])
            const inComingConversationKey = Object.keys(inComingConversation)[0]
            const inComingConversationValue = inComingConversation[inComingConversationKey]

            // set notification if user is recipient
            if(user?.userId === inComingMessage?.recipient?.userId) {
                notificationRef.current = inComingMessage
            }

            const newConversations = Object.keys(conversations).reduce((acc, key) => {
                return key === inComingConversationKey ?
                { ...acc, [key]: [ ...conversations[key], ...inComingConversationValue] }
                : { ...acc, [key]: conversations[key] }
            }, {})
            
            // set conversations
            setConversations(newConversations)
        }
        
        // return () => {
        //     console.log('===========')
        //     console.log('MessagesContextProvider useEffect  ws.onclose')
        //     ws.close()
        // }

        setWs(ws)
    }, [user, token, messagesChannelsKeys])

    useEffect(() => {
        if(!user?.userId) return
        if(!notificationRef.current?.author) return

        const { author: { email: authorEmail } } = notificationRef.current

        const authorName = authorEmail.split("@")[0]
        const notificationMessage = `New message from ${authorName}`

        setFlashMessage({ message: notificationMessage, type: "success"})
    }, [user, notificationRef.current])

    
    return (
        <MessagesContext.Provider value={{
            notificationRef,
            conversations,
            setConversations,
        }}>
            { children }
        </MessagesContext.Provider>
    )
}
