import { 
    IUser,
    IFlashMessage,
    IIncomingMessage,
    IMessage,
    IConversation,
    IMessagesContext,
    IMessagesChannelsKeys
 } from '../../utils/interfaces'


export const formatMessagesAndSetConversations = (fetchedMessages) => {

    const formattedMessages = formatMessages(fetchedMessages)    
    const conversations = setConversations(formattedMessages)

    return conversations
}

const formatMessages = (messages) => {
    if(!messages) return

    const formattedMessages = messages?.map(message => {
        const { 
        id: messageId,
        author,
        recipient,
        content,
        flatId: messageFlatId,
        transactionRequestId,
        createdAt,
        updatedAt } = message

        const { email: authorEmail, userId: authorUserId } = author
        const { email: recipientEmail, userId: recipientUserId } = recipient

        return {
        messageId,
        content,
        authorEmail,
        authorUserId,
        recipientEmail,
        recipientUserId,
        messageFlatId,
        transactionRequestId,
        createdAt,
        updatedAt 
        }
        }
    )
    return formattedMessages
}

// sort messages by flat#id - users#id (author and recipient)
const setConversations = (messages) => {
    if(!messages) return

    return messages?.reduce((acc, message) => {

    const { messageFlatId, authorUserId, recipientUserId } = message

    const minKey = Math.min(authorUserId, recipientUserId)
    const maxKey = Math.max(authorUserId, recipientUserId)

    const flatKey = `flat-${messageFlatId}`

    const flatUsersKey = `${flatKey}-users-${minKey}-${maxKey}`

    return { ...acc, [flatUsersKey]: [ ...(acc[flatUsersKey] || []), message ] }
    }, {})
}
