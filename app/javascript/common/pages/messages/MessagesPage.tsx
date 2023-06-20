import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useFetch } from '../../hooks'
import { useAppContext, useUserContext, useFlatsContext } from '../../contexts'
import { FlatDescription, FlatCardCarousel } from '../../components/flats'
import { MessageFormModalWrapper } from '../../components/messages'
import { IFlat } from '../../utils/interfaces'

const MessagesPage: React.FC = () => {
  //* hooks
  const { getUserMessages } = useFetch()

  //* context
  const { flashMessage } = useAppContext()
  const { user } = useUserContext()
  const { flats } = useFlatsContext()

  //* state
  // fetched user messages
  const [messages, setMessages] = useState([])
  // messages grouped by flat#id-users(author and recipient)#id
  const [sortedMessages, setSortedMessages] = useState([])
  // selected messages to read
  const [messagesToRead, setMessagesToRead] = useState([]) 
  // selected recipient user#id
  const [selectedRecipientUserId, setSelectedRecipientUserId] = useState(undefined)
  // selected message flat#id => show flat description
  const [selectedMessageFlat, setSelectedMessageFlat] = useState(undefined)
  // selected transaction request#id
  const [selectedTransactionRequestId, setSelectedTransactionRequestId] = useState(undefined)
  // modal send message form
  const [modalIsOpen, setModalIsOpen] = useState(false)
  
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
          flatId: messageFlatId,
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
          messageFlatId,
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

  // sort messages by flat#id
  const sortMessagesByFlatId = () => {
    return messages.reduce((acc, message) => {
      const { messageFlatId } = message

      const flatKey = `flat-${messageFlatId}`

      if (!acc[flatKey]) {
        acc[flatKey] = []
      }
  
      acc[flatKey] = [ ...acc[flatKey], message ]
      return acc;
    }, {})
    }

  // sort flat#id sorted messages by users#id (author and recipient)
  const sortflatIdSortedMessagesByUsers = () => {
    const flatIdSortedMessages = sortMessagesByFlatId()

    return Object.keys(flatIdSortedMessages).map(flatKey => {
      return flatIdSortedMessages[flatKey].reduce((acc, message) => {
        const { authorUserId, recipientUserId } = message

        const minKey = Math.min(authorUserId, recipientUserId)
        const maxKey = Math.max(authorUserId, recipientUserId)

        const userKey = `${flatKey}-users-${minKey}-${maxKey}`
        
        if (!acc[userKey]) {
          acc[userKey] = []
        }
    
        acc[userKey] = [ ...acc[userKey], message ]
        return acc;
      }, {})
    })
  }

  useEffect(() => {
    const sortedMessages = sortflatIdSortedMessagesByUsers()
    setSortedMessages(sortedMessages)
  }, [messages])

  const toggleModal = () => {
    setModalIsOpen(prev => !prev)
  }
  
  return (
    <>
    {selectedRecipientUserId &&
      <MessageFormModalWrapper 
        modalIsOpen={modalIsOpen}
        toggleModal={toggleModal}
        messageRecipientId={selectedRecipientUserId}
        messageFlatId={selectedMessageFlat?.flatId}
        messageTransactionRequestId={selectedTransactionRequestId}
      /> 
    }
    
    <div className="row mt-3">
      <div className="col-2">
        <h3 className="text-center text-info">Chat with </h3>
        {user && flats && sortedMessages && sortedMessages?.map(messageGroup => {

          return Object.keys(messageGroup).map(key => {

          const transactionRequestId = messageGroup[key].find(message => message?.transactionRequestId)?.transactionRequestId || null

          const { messageFlatId, authorUserId, authorEmail, recipientUserId, recipientEmail } = messageGroup[key][0]
          const messageFlat = flats?.find(flat => flat?.flatId === messageFlatId)
        
          return (
            <div key={key} className="w-100">
              <button 
                className="btn btn-outline-primary mb-2 w-100"
                onClick={() => {
                  setMessagesToRead(messageGroup[key])
                  setSelectedRecipientUserId(recipientUserId)
                  setSelectedMessageFlat(messageFlat)
                  setSelectedTransactionRequestId(transactionRequestId)
                }}
              >
                <span className="d-block w-100">
                  {user?.userId === authorUserId ?
                    recipientEmail.split("@")[0]
                  :
                    authorEmail.split("@")[0]
                  }
                </span>
                <span className='d-block'>{(`${messageFlat?.city}, ${messageFlat?.country}`.slice(0, 24))}</span>
              </button>
              <div className="d-none d-md-block ms-2">
            </div>
            </div>
          )
        })
        })}
      </div>
      <div className="col-6">
        <h3 className="text-center text-info">Messages</h3>
        {selectedRecipientUserId && 
          <div className="d-flex justify-content-around">
              <button 
                className="btn btn-sm btn-outline-primary mt-1 w-50"
                onClick={toggleModal}
              >Send a message
              </button>
          </div>
        }
        <ul>
          { messagesToRead && messagesToRead.map(messageToRead => {
              return (
                <li key={messageToRead.messageId}>
                  <p>{user.email === messageToRead.recipientEmail ? messageToRead.authorEmail : "Me" }</p>
                  <p>{messageToRead.content}</p>
                </li>
              )
            }) 
          }
        </ul>
      </div>
      <div className="col-4">
        {selectedMessageFlat && 
          <>
            <FlatDescription flat={selectedMessageFlat}/>

            <div className="my-2">
              <FlatCardCarousel images={selectedMessageFlat?.images} />
            </div>

            <div>
              <Link 
                to={`/properties/${selectedMessageFlat.flatId}`}
                className="btn btn-outline-primary"
              >Visit flat
              </Link>
            </div>

            <div className="my-2">
              <Link 
                to={`/my-booking-requests`}
                className="btn btn-outline-primary"
              >Check booking request (#TODO)
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
