import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAppContext, useUserContext, useFlatsContext } from '../../contexts'
import { useFetch } from '../../hooks'
import { FlashMessage } from '../../components'

const MessageForm = (props) => {
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
    const [messageRecipientFlatId, setMessageRecipientFlatId] = useState(null)
    const [messageTransactionRequestId, setMessageTransactionRequestId] = useState(null)

    //* effects
    useEffect(() => {
        if(!flats) return

        //**** TODO: on /my-messages */  
        
        if (params?.id) {
            // on /properties/:id/requests/message
            const messageRecipientFlatId = parseInt(params.id)
            
            const messageRecipientFlat = flats.find(flat => flat.flatId === messageRecipientFlatId)
            if (!messageRecipientFlat) return

            const messageRecipientId = messageRecipientFlat?.owner?.userId
            if(!messageRecipientId) return

            setMessageRecipientId(messageRecipientId)
            setMessageRecipientFlatId(messageRecipientFlat.flatId)
        } else if(props){
            // on /my-booking-requests
            const { messageRecipientId, messageRecipientFlatId, messageTransactionRequestId } = props
            if(!messageRecipientId || !messageRecipientFlatId) return
            
            setMessageRecipientId(messageRecipientId)
            setMessageRecipientFlatId(messageRecipientFlatId)
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

        const fetchedData = await createMessage(content, messageRecipientId, messageRecipientFlatId, messageTransactionRequestId)

        if(!fetchedData) return

        const [response, data] = fetchedData

        if (response.status === 201) {
            setFlashMessage({ message: data.message, type: "success" })
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
