import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useFetch } from '../../../hooks'
import { useAppContext } from '../../../contexts'
import {ButtonSlide} from '../../../components/buttons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons'
import StarRating from './StarRating'

interface IProps {
    flatId: number,
    transactionRequestId: number
}

const ReviewForm: React.FC<IProps> = (props) => {
    const { flatId, transactionRequestId } = props

    //* hooks & context
    const navigate = useNavigate()
    const { createReview } = useFetch()
    const { setFlashMessage } = useAppContext()

    //* state
    const [content, setContent] = useState("Awesome")
    const [rating, setRating] = useState(4)

    const handleSubmit = async (e) => {
        e.preventDefault()
        if(!content || !transactionRequestId || !transactionRequestId) return

        const review = { content, rating }
        
        const fetchedData = await createReview(flatId, transactionRequestId, review)

        if (!fetchedData) return

        const [response, data] = fetchedData

        if (!data) {
            return setFlashMessage({ message: "Something went wrong, please try again", type: "warning" })
        }

        if (response.status === 201) {
            navigate(`/properties/${flatId}`)
            setFlashMessage({ message: data.message, type: "success" })
        } 
        else {
            setFlashMessage({ message: data.error, type: "danger" })
        }
    }

    return (
            <form onSubmit={handleSubmit}>
                <div className="form-group w-100">
                    <textarea
                        className='w-100 mb-1'
                        name="content"
                        value={content.content}
                        onChange={(e) => setContent(e.target.value)}
                    />
                    <StarRating
                        rating={rating}
                        setRating={setRating}
                    />
                </div>
                <ButtonSlide 
                    type="submit"
                    className="btn-slide btn-slide-primary right-slide mt-3"
                >
                   <FontAwesomeIcon icon={faPaperPlane} />
                    {" "}Send
                </ButtonSlide>
            </form>
    )
}

export default ReviewForm
