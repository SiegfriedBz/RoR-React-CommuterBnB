import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faStar } from '@fortawesome/free-solid-svg-icons'

const FlatRating: React.FC<number> = ({ flatRating }) => {
    const rating = Math.ceil(flatRating)
    
    const iconArray = Array.from({ length: rating }, (_, index) => (
        <FontAwesomeIcon key={index} className="text-warning" icon={faStar} />
      ))
    
    return <>{ iconArray }</>
}

export default FlatRating
