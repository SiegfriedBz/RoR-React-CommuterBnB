import React from "react"
import { IUser } from "./userInterfaces"

export interface IIncomingMessage {
    id?: number,
    author?: IUser,
    recipient?: IUser,
    content?: string,
    flatId?: number,
    transactionRequestId?: number,
    createdAt?: string,
    updatedAt?: string,
}

export interface IMessage {
    messageId: number,
    content: string,
    authorEmail: string,
    authorUserId: number,
    recipientEmail: string,
    recipientUserId: number,
    messageFlatId: number,
    transactionRequestId: number,
    createdAt: string,
    updatedAt: string
}

export interface IConversation {
    [key: string]: IMessage[]
}

export interface IMessagesContext {
    messages: IMessage[] | undefined,
    setMessages: React.Dispatch<React.SetStateAction<IMessage[]>>,
    conversations: IConversation[] | undefined,
    setConversations: React.Dispatch<React.SetStateAction<IConversation[]>>,
    notificationConversationKeyRef: React.MutableRefObject<string | undefined>,
}

export interface IMessagesChannelsKeys {
    messagesChannelsKeys : string[] | undefined,
    setMessagesChannelsKeys: React.Dispatch<React.SetStateAction<string>>,
}
