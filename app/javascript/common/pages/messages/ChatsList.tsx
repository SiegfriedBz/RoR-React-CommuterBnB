import React, { useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faComments, faComment, faBell } from '@fortawesome/free-solid-svg-icons'
import { useFlatsContext, useMessagesContext } from '../../contexts'
import ButtonSlide from "../../components/ButtonSlide"
import { IUser, IFlat, IMessage } from '../../utils/interfaces'

interface IProps {
  user?: IUser,
  conversations?: { [key: string]: IMessage[] },
  setMessagesToRead?: IMessage[],
  setNextMessageRecipientUserId?: (id: number) => void,
  setSelectedMessageFlat?: (flat: IFlat) => void,
  setSelectedTransactionRequestId?: (id: number) => void
}

const ChatsList: React.FC<IProps> = (props) => {
  const {
    user,
    conversations,
    setMessagesToRead,
    setNextMessageRecipientUserId,
    setSelectedMessageFlat,
    setSelectedTransactionRequestId
  } = props

  //* context
  const { flats } = useFlatsContext()
  const { notificationConversationKeyRef } = useMessagesContext()

  //* state
  const [selectedFlatUsersKey, setSelectedFlatUsersKey] = useState(undefined)

  //* effects
  // refresh opened-conversation messages on conversations update (incoming from websocket)
  useEffect(() => {
    if(!conversations || !selectedFlatUsersKey) return

    const selectedConversationMessages = Object.entries(conversations)
    .filter(([flatUsersKey, messages]) => flatUsersKey === selectedFlatUsersKey)
    .map(([flatUsersKey, messages]) => messages)[0]

    setMessagesToRead(selectedConversationMessages)
  }, [conversations, selectedFlatUsersKey])


  //* handlers
  const handleSelectConversation = (flatUsersKey, conversationMessages, firstMessageAuthorUserId, firstMessageRecipientUserId, messageFlat, transactionRequestId) => {
    setSelectedFlatUsersKey(flatUsersKey)
    setMessagesToRead(conversationMessages)
    setNextMessageRecipientUserId(user?.userId === firstMessageAuthorUserId ?
      firstMessageRecipientUserId
      : firstMessageAuthorUserId
    )
    setSelectedMessageFlat(messageFlat)
    setSelectedTransactionRequestId(transactionRequestId)
    // reset bell notification
    notificationConversationKeyRef.current = null
  }

  return (
    <>
      <h3 className="text-center">
          <FontAwesomeIcon icon={faComments} />{" "}Pick a chat
        </h3>
        { user && flats && conversations && 
          Object.keys(conversations).map(flatUsersKey => {
              const conversationMessages = conversations[flatUsersKey]

              const transactionRequestId = conversationMessages?.find(message => { 
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
                  <ButtonSlide 
                    className={`btn-slide-sm btn-slide-dark right-slide ${flatUsersKey === selectedFlatUsersKey ? "btn-selected" : ""} mb-1 w-100`}
                    onClick={() => {
                      handleSelectConversation(flatUsersKey,
                        conversationMessages,
                        firstMessageAuthorUserId,
                        firstMessageRecipientUserId,
                        messageFlat,
                        transactionRequestId)
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
                  </ButtonSlide>
                </div>
              )
            })
        }
    </>
  )
}

export default ChatsList
