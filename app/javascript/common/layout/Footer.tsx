import React from 'react'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
    faGithubAlt, 
    faLinkedin } from '@fortawesome/free-brands-svg-icons'

const Footer = () => {

    return (
        <footer className="footer mt-5">
            <div className="d-flex justify-content-around align-items-center">
            <Link className="navbar-brand fs-4" to='/'>SwapBnb</Link>
            <Link className="navbar-brand" to='/about'>About us</Link>

                <div className="d-flex">
                    <a 
                        className='nav-item text-decoration-none me-3'
                        href="https://github.com"
                    >
                        <FontAwesomeIcon className="iconicon-footer" icon={faGithubAlt} />
                    </a>
                    <a 
                        className='nav-item text-decoration-none'
                        href="https://linkedin.com"
                    >
                        <FontAwesomeIcon className="iconicon-footer" icon={faLinkedin} />
                    </a>
                </div>
            </div>
        </footer>
    )
};

export default Footer
