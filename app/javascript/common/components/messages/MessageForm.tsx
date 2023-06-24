import React, { useState, useEffect, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAppContext, useUserContext, useFlatsContext } from '../../contexts'
import { useFetch } from '../../hooks'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons'
import { FlashMessage } from '../../components'

interface IProps {
    messageRecipientId?: number,
    messageFlatId?: number,
    messageTransactionRequestId?: number,
    toggleModal: () => void
}

// handle 3 sources of messages
/// /properties/:id/requests/message --- params => selectedFlatId passed through NavLink state - useLocation()
/// /my-booking-requests --- props
/// /my-messages --- props

const MessageForm: React.FC<IProps> = ({ messageRecipientId, messageFlatId, messageTransactionRequestId, toggleModal }) => {

    //* hooks
    const inputRef = useRef()
    const location = useLocation()
    const navigate = useNavigate()
    const { createMessage } = useFetch()

    //* context
    const { flashMessage, setFlashMessage } = useAppContext()
    const { user } = useUserContext()
    const { flats } = useFlatsContext()

    //* state
    const [content, setContent] = useState("")
    const [messageRecipientIdValue, setMessageRecipientIdValue] = useState(null)
    // messageFlatId is set by the 1st author in a conversation, and will remain CONSTANT in 1 conversation
    const [messageFlatIdValue, setMessageFlatIdValue] = useState(null)
    const [messageTransactionRequestIdValue, setMessageTransactionRequestIdValue] = useState(null)

    //* effects
    /// set messageRecipientIdValue & messageFlatIdValue & messageTransactionRequestIdValue 
    useEffect(() => {
        if(!flats) return

        if(location.pathname.includes("/requests/message")) {
            //* get selectedFlatId, passed from RequestFormsPage NavLink state
            const { state: { selectedFlatId }} = location
            const selectedFlat = flats.find(flat => flat.flatId === parseInt(selectedFlatId))
            if(!selectedFlat) return

            const selectedFlatOwnerId = selectedFlat?.owner?.userId
            if(!selectedFlatOwnerId) return

            setMessageRecipientIdValue(selectedFlatOwnerId)
            setMessageFlatIdValue(selectedFlatId)

        } else if(location.pathname.includes("/my-booking-requests") || location.pathname.includes("/my-messages")) {
            //* get recipientId, flatId, transactionRequestId from props, passed from BookingRequestCard
            setMessageRecipientIdValue(messageRecipientId)
            setMessageFlatIdValue(messageFlatId)
            setMessageTransactionRequestIdValue(messageTransactionRequestId)
        } 
    }, [flats, location?.pathname, messageRecipientId, messageFlatId, messageTransactionRequestId])

    // focus on message input
    useEffect(() => {
        if(!messageFlatIdValue) return

        inputRef?.current?.focus()

    }, [messageFlatIdValue])

    //* handlers
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target
        setContent(value)
    }

    const handleSubmit = async(e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault() 
        if(content?.trim() === "") {
            setFlashMessage({ message: "content can't be blank", type: "warning" })
            setTimeout(() => {
                return setFlashMessage({ message: "content can't be blank", type: "warning" }), 1500}
                )
        }

        const fetchedData = await createMessage(content, messageRecipientIdValue, messageFlatIdValue, messageTransactionRequestIdValue)

        if(!fetchedData) return

        const [response, data] = fetchedData

        if (!fetchedData) {
            setFlashMessage({ message: "Something went wrong, please try again", type: "warning" })
        }

        if (response.status === 201) {
            setFlashMessage({ message: data.message, type: "success" })
            setContent("")
            setTimeout(() => {
                setFlashMessage({ message: null, type: "success" })
                navigate(`/my-messages`)
            }, 1500)
        } 

        setTimeout(() => {
            setFlashMessage({ message: null, type: "success" })
            navigate(`/my-messages`)
        }, 1500)

        if (location.pathname.includes("/my-booking-requests")) {
            // close modal
            toggleModal()
        }
        
        else {
            setFlashMessage({ message: data.error, type: "danger" })
        }
    }

    return (
        <form onSubmit={handleSubmit}>
        { flashMessage.message && <FlashMessage {...flashMessage} /> }

            <div className="form-group">
                <textarea 
                    className="form-control"
                    id="content"
                    ref={inputRef}
                    name="content"
                    value={content}
                    onChange={handleChange}
                    placeholder="Type your message here..."
                />
            </div>
            <button 
                type="submit"
                className="btn btn-sm btn-outline-dark my-2">
                    <FontAwesomeIcon icon={faPaperPlane} />{" "}Send
                </button>
        </form>
    )
}

export default MessageForm
