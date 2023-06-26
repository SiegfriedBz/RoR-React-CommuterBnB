import React, { useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faComments, faComment, faBell } from '@fortawesome/free-solid-svg-icons'
import { useUserContext, useFlatsContext } from '../../contexts'
import { IUser, IFlat, IMessage } from '../../utils/interfaces'

interface IProps {
  user?: IUser,
  setMessagesToRead?: IMessage[],
  setNextMessageRecipientUserId?: (id: number) => void,
  setSelectedMessageFlat?: (flat: IFlat) => void,
  setSelectedTransactionRequestId?: (id: number) => void
}

const ChatsList: React.FC<IProps> = (props) => {
  const {
    user,
    setMessagesToRead,
    setNextMessageRecipientUserId,
    setSelectedMessageFlat,
    setSelectedTransactionRequestId
  } = props

  //* context
  const { conversations } = useUserContext()
  const { flats } = useFlatsContext()

  //* state
  // handle bell notification
  const [selectedFlatUsersKey, setSelectedFlatUsersKey] = useState(undefined)

  //* effects
  // refresh opened-conversation messages on conversations update (websocket)
  useEffect(() => {
    if(!conversations || !selectedFlatUsersKey) return

    const selectedConversationMessages = Object.entries(conversations)
    .filter(([flatUsersKey, messages]) => flatUsersKey === selectedFlatUsersKey)
    .map(([flatUsersKey, messages]) => messages)[0]

    setMessagesToRead(selectedConversationMessages)
  }, [conversations, selectedFlatUsersKey])

  return (
    <>
      <h3 className="text-center">
          <FontAwesomeIcon icon={faComments} />{" "}Pick a chat
        </h3>
        { user && flats && conversations && 
          Object.keys(conversations).map(flatUsersKey => {
              const conversationMessages = conversations[flatUsersKey]
              const transactionRequestId = conversationMessages.find(message => { 
                return message?.transactionRequestId !== null })?.transactionRequestId

              // get 1st message of the conversation (all messages have same flat#id)
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
                      setSelectedFlatUsersKey(flatUsersKey)
                      setMessagesToRead(conversationMessages)
                      setNextMessageRecipientUserId(user?.userId === firstMessageAuthorUserId ?
                        firstMessageRecipientUserId
                        : firstMessageAuthorUserId
                      )
                      setSelectedMessageFlat(messageFlat)
                      setSelectedTransactionRequestId(transactionRequestId)
                    }}
                  >
                    <span className="d-block w-100">
                      {/* if current user was author of the 1st message, display recipientrecipientEmail */}
                      <>
                        <FontAwesomeIcon icon={faComment} />{" "}
                        { user?.userId === firstMessageAuthorUserId ?
                          firstMessageRecipientEmail.split("@")[0]
                          : firstMessageAuthorEmail.split("@")[0]
                        }
                      </>
                    </span>
                    <span className='d-block'>
                      { (`${messageFlat?.city}, ${messageFlat?.country}`.slice(0, 24)) }
                  </span>
                  </button>
                </div>
              )
            })
        }
    </>
  )
}

export default ChatsList
