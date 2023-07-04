import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useFetch } from '../../../hooks'
import { useAppContext } from '../../../contexts'
import {ButtonSlide} from '../../../components/buttons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons'

interface IProps {
    flatId: number,
    transactionRequestId: number
}

const initReview = {
    content: 'Awesome',
    rating: 5
}

const ReviewForm: React.FC<IProps> = (props) => {
    const { flatId, transactionRequestId } = props

    //* hooks & context
    const navigate = useNavigate()
    const { createReview } = useFetch()
    const { setFlashMessage } = useAppContext()

    //* state
    const [review, setReview] = useState(initReview)

    //* methods
    const handleChange = (e) => {
        setReview({
            ...review,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if(!review?.content || !transactionRequestId || !transactionRequestId) return
        
        const fetchedData = await createReview(flatId, transactionRequestId, review)

        if (!fetchedData) return

        const [response, data] = fetchedData

        if (!data) {
            return setFlashMessage({ message: "Something went wrong, please try again", type: "warning" })
        }

        if (response.status === 201) {
            navigate(`/properties/${flatId}`)
            setReview(initReview)
            setFlashMessage({ message: data.message, type: "success" })
        } 
        else {
            setFlashMessage({ message: data.error, type: "danger" })
        }
    }

    return (
            <form>
                <div className="d-flex flex-column">
                    <label htmlFor="content">Content</label>
                    <textarea name="content" value={review.content} onChange={handleChange} />
                </div>
                <div className="d-flex flex-column">
                    <label htmlFor="rating">Rating</label>
                    <input type="number" name="rating" value={review.rating} onChange={handleChange} />
                </div>
                <ButtonSlide 
                    type="submit"
                    className="btn-slide btn-slide-info right-slide mt-2"
                    onClick={handleSubmit}
                >
                   <FontAwesomeIcon icon={faPaperPlane} />
                    {" "}Send review
                </ButtonSlide>
            </form>
    )
}

export default ReviewForm
