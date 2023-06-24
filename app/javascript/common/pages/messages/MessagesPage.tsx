import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faComments, faComment, faReceipt, faEye } from '@fortawesome/free-solid-svg-icons'
import { faCommentDots } from '@fortawesome/free-regular-svg-icons'
import { useFetch } from '../../hooks'
import { useUserContext, useFlatsContext } from '../../contexts'
import { FlatDescription, FlatCardCarousel } from '../../components/flats'
import { MessageForm } from '../../components/messages'
import { IFlat } from '../../utils/interfaces'

const MessagesPage: React.FC = () => {
  //* hooks
  const { getUserMessages } = useFetch()

  //* context
  const { user } = useUserContext()
  const { flats } = useFlatsContext()

  //* state
  // fetched user messages
  const [messages, setMessages] = useState([])
  // sort messages to set conversations
  const [conversations, setConversations] = useState([])
  // set messages to read on select conversation
  const [messagesToRead, setMessagesToRead] = useState([]) 

  //* NOTE: messageFlatId is always the flat of:
  /// - the user contacted from /properties/:id/requests/message
  /// - the "responder" of a transaction request from /my-booking-requests
  /// - the 1st "recipient" of a conversation on /my-messages

  // set next message recipient user#id
  const [nextMessageRecipientUserId, setNextMessageRecipientUserId] = useState(undefined)
  // select conversation => select message flat#id => show flat description
  const [selectedMessageFlat, setSelectedMessageFlat] = useState(undefined)
  // selected transaction request#id
  const [selectedTransactionRequestId, setSelectedTransactionRequestId] = useState(undefined)
  // modal send message form (used on /my-booking-requests)
  const [modalIsOpen, setModalIsOpen] = useState(false)
  
  // * effects
  // fetch user messages (as author or recipient)
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
      setMessages(messages)
    }
    })()
  }, [])
  
  // sort messages by flat#id - users#id (author and recipient)
  const sortMessages = () => {
    return messages.reduce((acc, message) => {

      const { messageFlatId, authorUserId, recipientUserId } = message

      const minKey = Math.min(authorUserId, recipientUserId)
      const maxKey = Math.max(authorUserId, recipientUserId)

      const flatKey = `flat-${messageFlatId}`

      const flatUsersKey = `${flatKey}-users-${minKey}-${maxKey}`

     return { ...acc, [flatUsersKey]: [ ...(acc[flatUsersKey] || []), message ] }
    }, {})
    }

  // sort messages => set conversations
  useEffect(() => {
    const conversations = sortMessages()
  
    setConversations(conversations)
  }, [messages])

  //* helpers
  const toggleModal = () => {
    setModalIsOpen(prev => !prev)
  }

  //* render
  if(messages?.length === 0) return (
    <div className="row mt-3">
      <span className="">
        You have no messages yet. Start a conversation after
        <Link to="/">selecting a property</Link>
      </span>
    </div>
  )
  
  return (
    <div className="row mt-3">
      {/* left panel */}
      <div className="col-2">
        <h3 className="text-center">
          <FontAwesomeIcon icon={faComments} />{" "}Pick a chat
        </h3>
        { user && flats && conversations && Object.keys(conversations).map(flatUsersKey => {
              const conversationMessages = conversations[flatUsersKey]
              const transactionRequestId = conversationMessages.find(message => message?.transactionRequestId !== null)?.transactionRequestId

              // get 1st message of the conversation
              const { 
                messageFlatId,
                authorUserId: firstMessageAuthorUserId,
                authorEmail: firstMessageAuthorEmail,
                recipientUserId: firstMessageRecipientUserId,
                recipientEmail: firstMessageRecipientEmail
              } = conversationMessages[0]
              
              const messageFlat = flats?.find(flat => flat?.flatId === messageFlatId)
            
              return (
                <div key={flatUsersKey} className="w-100">
                  <button 
                    className="btn btn-outline-dark mb-2 w-100"
                    onClick={() => {
                      setMessagesToRead(conversationMessages)
                      setNextMessageRecipientUserId(user?.userId === firstMessageAuthorUserId ? firstMessageRecipientUserId : firstMessageAuthorUserId)
                      setSelectedMessageFlat(messageFlat)
                      setSelectedTransactionRequestId(transactionRequestId)
                    }}
                  >
                    <span className="d-block w-100">
                      {/* if current user was author of the 1st message, display recipientrecipientEmail */}
                      <>
                        <FontAwesomeIcon icon={faComment} />{" "}
                        { user?.userId === firstMessageAuthorUserId ? firstMessageRecipientEmail.split("@")[0] : firstMessageAuthorEmail.split("@")[0] }
                      </>
                    </span>
                    <span className='d-block'>{(`${messageFlat?.city}, ${messageFlat?.country}`.slice(0, 24))}</span>
                  </button>
                </div>
              )
            })
        }
      </div>
      {/* center panel */}
      <div className="col-6">
        { messagesToRead && selectedMessageFlat && 
          <h3 className="text-center">Messages</h3> 
        }
        <ul className="list-unstyled">
          { messagesToRead && messagesToRead.map(messageToRead => {
              return (
                <li key={messageToRead.messageId}>
                  <p>{ user.email === messageToRead.recipientEmail ? 
                    <><FontAwesomeIcon icon={faComment} />{" "}{ messageToRead.authorEmail.split("@")[0] }</>
                    : <><FontAwesomeIcon icon={faCommentDots} />{" "}Me </>
                  }</p>
                  <p>{ messageToRead.content }</p>
                </li>
              )
            }) 
          }
        </ul>
        {nextMessageRecipientUserId &&
          <MessageForm 
              messageRecipientId={nextMessageRecipientUserId}
              messageFlatId={selectedMessageFlat?.flatId}
              messageTransactionRequestId={selectedTransactionRequestId}
          />
        }
      </div>
      {/* right panel */}
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
                className="btn btn-outline-dark"
              >
                <FontAwesomeIcon icon={faEye} />
                {" "}Visit property
              </Link>
            </div>

            { selectedTransactionRequestId && 
              <div className="my-2">
                <Link 
                  to={`/my-booking-requests`}
                  state={{ selectedBookingRequestId: selectedTransactionRequestId }}
                  className="btn btn-outline-dark"
                ><FontAwesomeIcon icon={faReceipt} />{" "}Check booking request
                </Link>
              </div>
            }
          </>
        }
      </div>
    </div>
  )
}

export default MessagesPage
