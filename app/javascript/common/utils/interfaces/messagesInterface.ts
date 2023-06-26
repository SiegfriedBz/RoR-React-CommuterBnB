import React from "react"

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
    setMessages: (messages: IMessage[] | undefined) => void,
    conversations: IConversation[] | undefined,
    setConversations: (conversations: IConversation[] | undefined) => void
}

export interface IMessagesChannelsKeys {
    messagesChannelsKeys : string[] | undefined,
    setMessagesChannelsKeys: (messagesChannelsKeys: string[] | undefined) => void
}
