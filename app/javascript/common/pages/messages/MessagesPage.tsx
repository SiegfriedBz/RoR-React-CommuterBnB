import React, { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHouse } from '@fortawesome/free-solid-svg-icons'
import { useFetch } from '../../hooks'
import { useUserContext, useMessagesContext } from '../../contexts'
import ChatsList from './components/ChatsList'
import MessagesList from './components/MessagesList'
import MessagesFlat from './components/MessagesFlat'
import { LoadingSpinners } from '../../components'
import MapView from '../../components/map/MapView'
import { formatMessagesAndSetConversations } from '../../contexts/helpers/formatMessagesAndSetConversations'

//* NOTE: flat with messageFlatId always belongs to:
// - the user contacted from /properties/:id/requests/message
// - the "responder" of a transaction request from /my-booking-requests
// - the 1st "recipient" of a conversation on /my-messages
 
const MessagesPage: React.FC = () => {
  //* hooks & context
  const topRef = useRef<HTMLElement>(null)
  const { user } = useUserContext()
  const { conversations, setConversations } = useMessagesContext()
  const { getUserMessages } = useFetch()
  
  //* state
  // after select conversation: set messages to read 
  const [messagesToRead, setMessagesToRead] = useState([]) 
  // set next message recipient user#id
  const [nextMessageRecipientUserId, setNextMessageRecipientUserId] = useState(undefined)
  // select conversation => select message flat#id => show flat description
  const [selectedMessageFlat, setSelectedMessageFlat] = useState(undefined)
  // selected transaction request#id
  const [selectedTransactionRequestId, setSelectedTransactionRequestId] = useState(undefined)

  //* effects
  useEffect(() => {
    (async () => {
      const fetchedData = await getUserMessages()
      if(!fetchedData) return

      const [response, data] = fetchedData
      if(!response.ok || !data?.messages) return
  
      const fetchedMessages = data?.messages

      const conversations = formatMessagesAndSetConversations(fetchedMessages)
      setConversations(conversations)
    })()
  }, [])

  //* helpers
  const scrollToTop = () => {
    topRef.current.scrollIntoView({ behavior: 'smooth' })
  }
  
  if(!conversations) return <LoadingSpinners />

  if(Object.keys(conversations)?.length === 0) {
    return (
      <div className="text-center">
        <Link to="/" replace={true} className="text-primary fs-5 text-decoration-none">
          <FontAwesomeIcon icon={faHouse} />
          {" "}<span className="d-block text-primary fs-5">Start contacting members to rent or swap your property</span>
        </Link>
        <MapView />
      </div>
    )


  }
  
  return (
    <>
      <div 
        ref={topRef}
        className="row mt-3">
        {/* select a conversation */}
          <ChatsList
            user={user}
            conversations={conversations}
            setMessagesToRead={setMessagesToRead}
            setSelectedMessageFlat={setSelectedMessageFlat}
            setNextMessageRecipientUserId={setNextMessageRecipientUserId}
            setSelectedTransactionRequestId={setSelectedTransactionRequestId}
          />
      </div>
      <div className="row mt-3">
        {/* selected conversation messages */}
        <div className="col-12 col-md-5">
          <MessagesList
            user={user}
            messagesToRead={messagesToRead}
            nextMessageRecipientUserId={nextMessageRecipientUserId}
            nextMessageFlatId={selectedMessageFlat?.flatId}
            nextMessageTransactionRequestId={selectedTransactionRequestId}
            scrollToTop={scrollToTop}
          />
        </div>
        {/* selected conversation flat description */}
        <div className="col-12 mt-3 mt-md-0 col-md-7">
          <div className='sticky-md-top'>
            <MessagesFlat
              selectedMessageFlat={selectedMessageFlat}
              selectedTransactionRequestId={selectedTransactionRequestId}
              scrollToTop={scrollToTop}
            />
          </div>
        </div>
      </div>
    </>
  )
}

export default MessagesPage
