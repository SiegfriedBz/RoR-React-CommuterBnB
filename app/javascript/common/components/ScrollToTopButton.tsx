import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowUpRightDots } from '@fortawesome/free-solid-svg-icons'

interface IProps {
    scrollToTop: () => void
}

const ScrollToTopButton: React.FC<IProps> = (props) => {
    const { scrollToTop } = props

    return (
        <div className='d-flex justify-content-end my-1'>
            <button 
                className="btn text-white fw-bolder btn-dark"
                onClick={scrollToTop}
            >
                <FontAwesomeIcon icon={faArrowUpRightDots} />
            </button>
        </div>
    )
}

export default ScrollToTopButton
