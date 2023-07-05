import React from 'react'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
    faGithubAlt, 
    faLinkedin } from '@fortawesome/free-brands-svg-icons'

const Footer = ({ scrollToHeaderTop }) => {

    return (
        <footer className="footer">
            <div className="d-flex mx-md-5 justify-content-between align-items-center">
            <Link
                onClick={scrollToHeaderTop}
                className="navbar-brand fs-3"
                to='/'
            >SwapBnb
            </Link>
            {/* <Link className="navbar-brand" to='/about'>About us</Link> */}
                <div className="d-flex">
                    <a 
                        className='nav-item text-decoration-none me-3'
                        href="https://github.com"
                    >
                        <FontAwesomeIcon className="icon-footer" icon={faGithubAlt} />
                    </a>
                    <a 
                        className='nav-item text-decoration-none'
                        href="https://linkedin.com"
                    >
                        <FontAwesomeIcon className="icon-footer" icon={faLinkedin} />
                    </a>
                </div>
            </div>
        </footer>
    )
};

export default Footer
