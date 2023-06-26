import React from 'react';

export interface IUser {
    userId?: number,
    description?: string,
    email?: string,
    role?: string,
    createdAt?: string,
    image?: string
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

export interface IUserContext extends IUser {
    setUser: React.Dispatch<React.SetStateAction<IUser>>,
    setTokenInStorage: React.Dispatch<React.SetStateAction<string>>
    messages: IMessage[] | undefined,
    setMessages: (messages: IMessage[] | undefined) => void,
    conversations: IConversation[] | undefined,
    setConversations: (conversations: IConversation[] | undefined) => void,
}
