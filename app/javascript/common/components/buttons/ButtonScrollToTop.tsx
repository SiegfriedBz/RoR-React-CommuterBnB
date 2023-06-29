import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowUpRightDots } from '@fortawesome/free-solid-svg-icons'
import ButtonSlide from "./ButtonSlide"

interface IProps {
    scrollToTop: () => void
}

const ButtonScrollToTop: React.FC<IProps> = (props) => {
    const { scrollToTop } = props

    return (
        <div className='d-flex justify-content-end my-1'>
            <ButtonSlide 
                className="btn-slide-sm btn-slide-primary top-slide"
                type="button"
                onClick={scrollToTop}
            >
                <FontAwesomeIcon icon={faArrowUpRightDots} />
            </ButtonSlide>
        </div>
    )
}

export default ButtonScrollToTop
