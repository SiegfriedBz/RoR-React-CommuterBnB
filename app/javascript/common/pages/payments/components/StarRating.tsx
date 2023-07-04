import React, { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faStar } from '@fortawesome/free-solid-svg-icons'

const StarRating = (props) => {
    const { rating, setRating } = props

    return (
        <div>
            {[...Array(5)].map((star, index) => {
                const newRating = index + 1
                return (
                    <button
                        type="button"
                        key={index}
                        className={`bg-transparent border-0 ${(newRating <= rating)? "text-warning" : "text-primary"}`}
                        onClick={() => setRating(newRating)}
                    >
                        <FontAwesomeIcon icon={faStar} />
                    </button>
                )
            })}
        </div>
    )
}

export default StarRating
