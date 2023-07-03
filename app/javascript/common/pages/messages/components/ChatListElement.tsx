import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faComments, faComment, faBell, faHandPointer } from '@fortawesome/free-solid-svg-icons'
import { ButtonSlide } from "../../../components/buttons"
import { IUser, IFlat, IMessage } from '../../../utils/interfaces'

type handleSelectConversationType = (flatUsersKey: number, conversationMessages: IMessage[], firstMessageAuthorUserId: number, firstMessageRecipientUserId: number, messageFlat: IFlat, transactionRequestId: number) => void

interface IProps {
    user?: IUser,
    flatUsersKey?: number,
    handleSelectConversation?: handleSelectConversationType,
    selectedFlatUsersKey?: number,
    conversationMessages?: IMessage[],
    firstMessageAuthorUserId?: number,
    firstMessageAuthorEmail?: string,
    firstMessageRecipientUserId?: number,
    firstMessageRecipientEmail?: string,
    messageFlat?: number,
    transactionRequestId?: number
}

const ChatListElement = (props) => {
    const {
        user,
        flatUsersKey,
        handleSelectConversation,
        selectedFlatUsersKey,
        conversationMessages,
        firstMessageAuthorUserId,
        firstMessageAuthorEmail,
        firstMessageRecipientUserId,
        firstMessageRecipientEmail,
        messageFlat,
        transactionRequestId
    } = props

    const ButtonSlideClass = () => {
        return `btn-slide-sm btn-slide-primary right-slide mb-1 w-100 ${
            !selectedFlatUsersKey ?
            "d-block"
            : flatUsersKey === selectedFlatUsersKey ?
            "btn-selected d-block"
            : "d-none"
        }`
    }

    return (
            <ButtonSlide 
                className={ButtonSlideClass()}
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
                    {/* if current user was author of the 1st message, display recipientEmail */}
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
    )
}

export default ChatListElement
