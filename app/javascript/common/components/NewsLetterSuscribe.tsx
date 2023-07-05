import React, { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEnvelopeOpenText } from '@fortawesome/free-solid-svg-icons'
import {ButtonSlide} from './buttons'

const NewsLetterSuscribe = () => {
  const [email, setEmail] = useState('')

  const handleChange = (e) => {
    setEmail(e.target.value)
  };

  const handleSubmit = (e) => {
    e.preventDefault()
    // Here you can perform any necessary actions with the email (e.g., send it to a backend API)
    console.log("NewsLetterSuscribe handleSubmit Email")
    
    // Reset the email input field
    setEmail('')
  };

  return (
    <div className="my-5">
        <h3>
            <FontAwesomeIcon icon={faEnvelopeOpenText} />
            {" "}<span>Subscribe to our Newsletter</span>
        </h3>
        <form onSubmit={handleSubmit}>
            <div className="d-flex justify-content-center align-items-center">
              <input
                type="email"
                placeholder="Your email"
                value={email}
                onChange={handleChange}
                required
                className="form-control w-25"
              />
              <ButtonSlide type="submit"
                  className="btn-slide btn-slide-primary right-slide ms-2"
              >
                Subscribe
              </ButtonSlide>
            </div>
        </form>
    </div>
  )
}

export default NewsLetterSuscribe
