export const formatMessagesAndSetConversations = (fetchedData) => {
    const [response, data] = fetchedData
    if(!response.ok || !data?.messages) return

    const fetchedMessages = data?.messages
    
    const formattedMessages = formatMessages(fetchedMessages)
    console.log("formattedMessages", formattedMessages)
    
    const conversations = setConversations(formattedMessages)
    console.log("conversations", conversations)

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

        const { 
        author: {
            data: {
            attributes: {
                email: authorEmail,
                userId: authorUserId
            }
            } 
        }
        } = author

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
    console.log(formattedMessages);
    
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
