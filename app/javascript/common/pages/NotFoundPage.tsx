import React from 'react'
import { Link } from "react-router-dom"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAnglesLeft } from '@fortawesome/free-solid-svg-icons'

const NotFoundPage: React.FC = () => {
  return (
    <div>
      <h1>404 - Not Found</h1>
      <p>The page you are looking for does not exist.</p>
      <Link to="/" replace={true} className="text-decoration-none">
        <FontAwesomeIcon icon={faAnglesLeft} />
        {" "}Back</Link>
    </div>
  )
}

export default NotFoundPage
