import React from 'react'
import { useLocation } from 'react-router-dom'

interface IProps {
    image?: string
}

const Avatar: React.FC<IProps>= (props) => {
    const { image } = props
    const location = useLocation()

    const imageClass =  location.pathname.includes("/properties") || 
        location.pathname.includes("/my-profile") ? "avatar" : "avatar small"
    
    if (!image) return null

    return (
        <img 
            className={`${imageClass} img-fluid img-thumbnail rounded-circle mb-2`}
            src={image} 
            alt="user avatar"
        />
   )
}

export default Avatar
