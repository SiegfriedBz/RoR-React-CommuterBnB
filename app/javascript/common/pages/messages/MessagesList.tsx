import React, { useRef } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faComment } from '@fortawesome/free-solid-svg-icons'
import { faCommentDots } from '@fortawesome/free-regular-svg-icons'
import { MessageForm } from '../../components/messages'
import { ScrollToTopButton } from '../../components'
import { IUser, IMessage } from '../../utils/interfaces'

interface IProps {
  user?: IUser,
  messagesToRead?: IMessage[],
  nextMessageRecipientUserId?: number,
  nextMessageFlatId?: number,
  nextMessageTransactionRequestId?: number
}

const MessagesList: React.FC<IProps> = (props) => {
  const {
    user,
    messagesToRead,
    nextMessageRecipientUserId,
    nextMessageFlatId,
    nextMessageTransactionRequestId
  } = props

  const topRef = useRef<HTMLDivElement>(null)

  const scrollToTop = () => {
    topRef.current.scrollIntoView({ behavior: 'smooth' })
  }

  if(!user || messagesToRead?.length === 0) return null

  return (
    <div ref={topRef}>
        <h3 className="text-center">Messages</h3> 
        <ul className="list-unstyled">
          { messagesToRead?.map(messageToRead => {
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
        { nextMessageRecipientUserId &&
            <MessageForm 
                messageRecipientId={nextMessageRecipientUserId}
                messageFlatId={nextMessageFlatId}
                messageTransactionRequestId={nextMessageTransactionRequestId}
            />
        }
        <ScrollToTopButton scrollToTop={scrollToTop} />
    </div>
  )
}

export default MessagesList
