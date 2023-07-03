import React from 'react'
import FlatReviewCard from './FlatReviewCard'

interface IProps {
    flatReviews: any
}

const FlatReviewsList: React.F<IProps> = ({ flatReviews }) => {
    
    return (
        <div className="row mb-3 g-3">
            { flatReviews && flatReviews.map((review) => {
                return <FlatReviewCard review={review} key={review.reviewId} />
            }
            )}
        </div>
    )
}

export default FlatReviewsList
