import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useUserContext, useMessagesContext } from '../../contexts'
import ChatsList from './ChatsList'
import MessagesList from './MessagesList'
import MessagesFlat from './MessagesFlat'

//* NOTE: flat with messageFlatId always belongs to:
// - the user contacted from /properties/:id/requests/message
// - the "responder" of a transaction request from /my-booking-requests
// - the 1st "recipient" of a conversation on /my-messages
 
const MessagesPage = () => {
  //* context
  const { user } = useUserContext()
  const { conversations } = useMessagesContext()

  //* state
  // after select conversation: set messages to read 
  const [messagesToRead, setMessagesToRead] = useState([]) 
  // set next message recipient user#id
  const [nextMessageRecipientUserId, setNextMessageRecipientUserId] = useState(undefined)
  // select conversation => select message flat#id => show flat description
  const [selectedMessageFlat, setSelectedMessageFlat] = useState(undefined)
  // selected transaction request#id
  const [selectedTransactionRequestId, setSelectedTransactionRequestId] = useState(undefined)

  //* render
  if(!conversations) return (
    <div className="row mt-3">
      <span className="">
        You have no messages yet. Start a conversation after
        <Link
          to="/"
          className=""
          >selecting a property
        </Link>
      </span>
    </div>
  )
  
  return (
    <div className="row mt-3">
      {/* left panel */}
      <div className="col-2">
        <ChatsList
          user={user}
          conversations={conversations}
          setMessagesToRead={setMessagesToRead}
          setSelectedMessageFlat={setSelectedMessageFlat}
          setNextMessageRecipientUserId={setNextMessageRecipientUserId}
          setSelectedTransactionRequestId={setSelectedTransactionRequestId}
        />
      </div>
      {/* center panel */}
      <div className="col-6">
        <MessagesList
          user={user}
          messagesToRead={messagesToRead}
          nextMessageRecipientUserId={nextMessageRecipientUserId}
          nextMessageFlatId={selectedMessageFlat?.flatId}
          nextMessageTransactionRequestId={selectedTransactionRequestId}
        />
      </div>
      {/* right panel */}
      <div className="col-4">
        <MessagesFlat
          selectedMessageFlat={selectedMessageFlat}
          selectedTransactionRequestId={selectedTransactionRequestId}
        />
      </div>
    </div>
  )
}

export default MessagesPage
