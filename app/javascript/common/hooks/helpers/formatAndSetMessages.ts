const formatAndSetMessages = (fetchedData) => {
    if(!fetchedData) return

    const [response, data] = fetchedData
    if(!response.ok || !data?.messages) return

    const fetchedMessages = data?.messages
    
    const messages = fetchedMessages?.map(message => {
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

    console.log("formatAndSetMessages messages[0]", messages[0])

    return messages
}

export { formatAndSetMessages }
