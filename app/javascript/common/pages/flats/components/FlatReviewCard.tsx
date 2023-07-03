import { formatDistanceToNow } from 'date-fns'
import React from 'react'
import { IReview } from '../../../utils/interfaces'
import { formatedDate } from '../../../utils/helpers/formatedDate'

interface IProps {
    review?: IReview
}

const FlatReviewCard: React.FC<IProps> = ({ review }) => {
    const { reviewId, reviewer, content, createdAt } = review

    const name = (user) => {
        const { email } = user
        if(!email) return

        return email.split('@')[0]
    }
    
    return (
        <div className="col-12 col-md-4" key={reviewId}>
            <div className="card h-100">
                <div className="card-body">
                    <h5 className="card-title text-primary">{name(reviewer)}</h5>
                    <p className="card-text subtitle">{content}</p> 
                    <small className="text-body-secondary">
                        On {formatedDate(createdAt)}
                    </small>
                </div>
            </div>
        </div>
    )
}

export default FlatReviewCard
