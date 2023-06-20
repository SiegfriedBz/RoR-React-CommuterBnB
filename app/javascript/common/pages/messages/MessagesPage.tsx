import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useFetch } from '../../hooks'
import { useAppContext, useUserContext, useFlatsContext } from '../../contexts'
import { FlatDescription, FlatCardCarousel } from '../../components/flats'

const MessagesPage = () => {
  //* hooks
  const { getUserMessages } = useFetch()

  //* context
  const { flashMessage } = useAppContext()
  const { user } = useUserContext()
  const { flats } = useFlatsContext()

  //* state
  const [messages, setMessages] = useState([])
  const [selectedRecipientUserId, setSelectedRecipientUserId] = useState(undefined)
  const [selectedRecipientFlat, setSelectedRecipientFlat] = useState(undefined)
  // msgs grouped by recipient#id-flat#id
  const [groupedMessages, setGroupedMessages] = useState([])
  const [filteredMessages, setFilteredMessages] = useState([])

  // * effects
  // fetch user messages (as author and recipient)
  useEffect(() => {
    (async () => {
    const fetchedData = await getUserMessages()

    if(!fetchedData) return

    const [response, data] = fetchedData
    if(response.ok) {
      const messages = data?.messages?.map(message => {
        
        const { 
          id: messageId,
          author,
          recipient,
          content,
          flatId: recipientFlatId,
          transactionRequestId,
          createdAt,
          updatedAt } = message

        const { 
          author: {
            data: {
              attributes: {
              email: authorEmail,
              userId:
              authorUserId
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
          recipientFlatId,
          transactionRequestId,
          createdAt,
          updatedAt 
        }
        }
      )
      setMessages(messages)
    }
    })()
  }, [])

  // group messages by recipient#id-flat#id
  useEffect(() => {
    if(!messages) return

    const groupedMessages = getGroupedMessages()
    setGroupedMessages(groupedMessages)
  }, [messages])

  const getGroupedMessages = () => {
    return messages.reduce((acc, message) => {
      const { authorUserId, recipientUserId, recipientFlatId } = message

      const userKey = user.userId === authorUserId ? recipientUserId : authorUserId
      
      const key = `user${userKey}-flat${recipientFlatId}`

      if (!acc[key]) {
        acc[key] = []
      }
  
      acc[key] = [ ...acc[key], message ]
      return acc;
    }, {})
  }

  // filter messages on selected flat
  useEffect(() => {
    if(!groupedMessages) return

    const filteredMessages = Object.keys(groupedMessages)?.map(key => {
      return groupedMessages[key].filter(message =>  {
        return message?.recipientFlatId === selectedRecipientFlat?.flatId
        })}
      )
      .filter(message => message.length > 0)

    setFilteredMessages(...filteredMessages)

  }, [groupedMessages, selectedRecipientFlat])
  
  return (
    <>
    <div className="row mt-3">
      <div className="col-2">
        <h3 className="text-center text-info">Chat with </h3>
        {Object.keys(groupedMessages)?.map(key => {

          const { authorUserId, authorEmail, recipientUserId, recipientEmail, recipientFlatId } = groupedMessages[key][0]
          const recipientFlat = flats.find(flat => flat.flatId === recipientFlatId)
        
          return (
            <div key={key} className="w-100">
              <button 
                className="btn btn-outline-primary mb-2 w-100"
                onClick={() => {
                  setSelectedRecipientUserId(recipientUserId)
                  setSelectedRecipientFlat(recipientFlat)
                }}
              >
                <span className="d-block w-100">
                  {user?.userId === authorUserId ?
                    recipientEmail.split("@")[0]
                  :
                    authorEmail.split("@")[0]
                  }
                </span>
                <span className="d-block w-100">{recipientFlat?.address.slice(0, 24)}</span>
              </button>
            </div>
          )
        })}
      </div>
      <div className="col-6">
        <h3 className="text-center text-info">Messages</h3>
        <ul>
          { filteredMessages && filteredMessages.map(filteredMessage => {
              return (
                <li key={filteredMessage.messageId}>
                  <p>{filteredMessage.recipientEmail}</p>
                  <p>{filteredMessage.content}</p>
                </li>
              )
            }) 
          }
        </ul>
      </div>
      <div className="col-4">
        {selectedRecipientFlat && 
          <>
            <FlatDescription flat={selectedRecipientFlat}/>

            <div className="my-2">
              <FlatCardCarousel flat={selectedRecipientFlat}/>
            </div>

            <div>
              <Link 
                to={`/properties/${selectedRecipientFlat.flatId}`}
                className="btn btn-outline-primary"
              >Visit flat
              </Link>
            </div>

            <div className="my-2">
              <Link 
                to={`/my-booking-requests`}
                className="btn btn-outline-primary"
              >Check booking request
              </Link>
            </div>
          </>
        }
      </div>
    </div>
    </>
  )
}

export default MessagesPage
