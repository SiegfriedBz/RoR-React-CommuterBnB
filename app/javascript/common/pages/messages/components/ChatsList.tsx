import React, { useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faComments, faHandPointLeft } from '@fortawesome/free-solid-svg-icons'
import { useFlatsContext, useMessagesContext } from '../../../contexts'
import ChatListElement from './ChatListElement'
import { IUser, IFlat, IMessage } from '../../../utils/interfaces'

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

  const handleDeselectConversation = () => {
    setSelectedFlatUsersKey(undefined)
    setMessagesToRead(undefined)
    setNextMessageRecipientUserId(undefined)
    setSelectedMessageFlat(undefined)
    setSelectedTransactionRequestId(undefined)
  }

  return (
    <>
    <div className={selectedFlatUsersKey && "col-md-5"}>
      <div className="d-flex justify-content-center">
        <h3 
          className='cursor-pointer' 
          onClick={handleDeselectConversation}
        >
          <div className="d-flex align-items-center">
            <FontAwesomeIcon className="text-primary" icon={faComments} />
            {" "}<span className="mx-3">Pick a chat</span>
            { selectedFlatUsersKey &&
                <><span>{" "}</span><FontAwesomeIcon className="text-success" icon={faHandPointLeft} /></>
            }
          </div>
        </h3>
      </div>
    </div>

    <div className={selectedFlatUsersKey && "col-md-7"}>
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
              <div 
                key={flatUsersKey}
                className={`${selectedFlatUsersKey ? "w-100 col-6" : "col-6 col-md-4 d-flex mx-auto"}`}
              >
                <ChatListElement 
                  user={user}
                  flatUsersKey={flatUsersKey}
                  handleSelectConversation={handleSelectConversation}
                  selectedFlatUsersKey={selectedFlatUsersKey}
                  conversationMessages={conversationMessages}
                  firstMessageAuthorUserId={firstMessageAuthorUserId}
                  firstMessageAuthorEmail={firstMessageAuthorEmail}
                  firstMessageRecipientUserId={firstMessageRecipientUserId}
                  firstMessageRecipientEmail={firstMessageRecipientEmail}
                  messageFlat={messageFlat}
                  transactionRequestId={transactionRequestId}
                />
              </div>
            )
          })
      }
      </div>
    </>
  )
}

export default ChatsList
