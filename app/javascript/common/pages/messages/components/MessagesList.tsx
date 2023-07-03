import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faComment } from '@fortawesome/free-solid-svg-icons'
import { faCommentDots } from '@fortawesome/free-regular-svg-icons'
import { MessageForm } from '../../../components/messages'
import {ButtonScrollToTop} from '../../../components/buttons';
import { IUser, IMessage } from '../../../utils/interfaces'

interface IProps {
  user?: IUser,
  messagesToRead?: IMessage[],
  nextMessageRecipientUserId?: number,
  nextMessageFlatId?: number,
  nextMessageTransactionRequestId?: number,
  scrollToTop?: () => void
}

const MessagesList: React.FC<IProps> = (props) => {
  const {
    user,
    messagesToRead,
    nextMessageRecipientUserId,
    nextMessageFlatId,
    nextMessageTransactionRequestId,
    scrollToTop
  } = props

  if(!user || messagesToRead?.length === 0) return null

  return (
    <div>
        <ul className="list-unstyled">
          { messagesToRead?.map(messageToRead => {
              return (
                <li key={messageToRead.messageId}>
                  <p>{ user.email === messageToRead.recipientEmail ? 
                    <><FontAwesomeIcon className="text-dark" icon={faComment} />{" "}{ messageToRead.authorEmail.split("@")[0] }</>
                    : <><FontAwesomeIcon className="text-dark" icon={faCommentDots} />{" "}Me </>
                    }
                  </p>
                  <p className={user.email === messageToRead.recipientEmail ?
                      "p-1 bg-primary-subtle border border-primary-subtle rounded-3"
                      :""}
                  >
                    { messageToRead.content }
                </p>
                </li>
              )
            }) 
          }
        </ul>
        { nextMessageRecipientUserId &&
            <MessageForm
                scrollToTop={scrollToTop}
                messageRecipientId={nextMessageRecipientUserId}
                messageFlatId={nextMessageFlatId}
                messageTransactionRequestId={nextMessageTransactionRequestId}
            >
              <ButtonScrollToTop scrollToTop={scrollToTop} />
            </MessageForm>
        }
    </div>
  )
}

export default MessagesList
