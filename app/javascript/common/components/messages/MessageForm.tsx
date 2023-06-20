import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAppContext, useUserContext, useFlatsContext } from '../../contexts'
import { useFetch } from '../../hooks'
import { FlashMessage } from '../../components'

interface IProps {
    messageRecipientId?: number,
    messageFlatId?: number,
    messageTransactionRequestId?: number,
    toggleModal: () => void
}

// handle 3 sources of messages
/// /properties/:id/requests/message --- params
/// /my-booking-requests --- props
/// /my-messages --- props

const MessageForm: React.FC<IProps> = ({ toggleModal, ...props }) => {
    //* hooks
    const params = useParams()
    const navigate = useNavigate()
    const { createMessage } = useFetch()

    //* context
    const { flashMessage, setFlashMessage } = useAppContext()
    const { user } = useUserContext()
    const { flats } = useFlatsContext()

    //* state
    const [content, setContent] = useState("")
    const [messageRecipientId, setMessageRecipientId] = useState(null)
    // messageFlatId is set by the 1st author in a conversation, and will remain CONSTANT in 1 conversation
    const [messageFlatId, setMessageFlatId] = useState(null)
    const [messageTransactionRequestId, setMessageTransactionRequestId] = useState(null)

    //* effects
    useEffect(() => {
        if(!flats) return

        if (params?.id) {
            // on /properties/:id/requests/message
            // id === ALWAYS "secondUser".flatId (not the flat of the currentUser if has any)
            const messageFlatId = parseInt(params.id)
            
            const messageFlat = flats.find(flat => flat.flatId === messageFlatId)
            if (!messageFlat) return

            const messageRecipientId = messageFlat?.owner?.userId
            if(!messageRecipientId) return

            setMessageRecipientId(messageRecipientId)
            setMessageFlatId(messageFlatId)
        } else if(props){
            // on /my-booking-requests || /my-messages
            // /my-booking-requests
            /// ALWAYS set the "responderFlatId" as the "messageFlatId"
            // /my-messages
            /// 
            const { messageRecipientId, messageFlatId, messageTransactionRequestId } = props
            if(!messageRecipientId || !messageFlatId) return
            
            setMessageRecipientId(messageRecipientId)
            setMessageFlatId(messageFlatId)
            setMessageTransactionRequestId(messageTransactionRequestId)
        }

    }, [flats, params])

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

        const fetchedData = await createMessage(content, messageRecipientId, messageFlatId, messageTransactionRequestId)

        if(!fetchedData) return

        const [response, data] = fetchedData

        if (response.status === 201) {
            setFlashMessage({ message: data.message, type: "success" })
            toggleModal()
            setContent("")
            setTimeout(() => {
                setFlashMessage({ message: null, type: "success" })
                navigate(`/my-messages`)
            }, 1500)
        } else {
            setFlashMessage({ message: data.error, type: "danger" })
        }
    }

    return (
        <>
        <h3 className="text-info">Send Message</h3>
        <form onSubmit={handleSubmit}>
        {flashMessage.message && <FlashMessage {...flashMessage} />}
            <div className="form-group">
                <textarea 
                    className="form-control"
                    id="content"
                    name="content"
                    value={content}
                    onChange={handleChange}
                    placeholder="Type your message here..."
                />
            </div>
            <button type="submit" className="btn btn-sm btn-outline-primary my-2">Submit</button>
        </form>
        </>
    )
}

export default MessageForm
