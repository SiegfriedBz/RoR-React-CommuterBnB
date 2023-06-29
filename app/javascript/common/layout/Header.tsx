import React from 'react'
import { Link, NavLink, useNavigate } from "react-router-dom"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    faUser,
    faEnvelope,
    faReceipt,
    faMoneyCheck,
    faHouseCircleCheck,
    faRightFromBracket,
    faRightToBracket,
    faBell
} from '@fortawesome/free-solid-svg-icons'
import { useUserContext, useMessagesContext } from '../contexts'

const Header: React.FC = () => {
    //* hooks & context
    const navigate = useNavigate()
    const { user, setTokenInStorage } = useUserContext()
    const { notificationConversationKeyRef } = useMessagesContext()
    
    //* handlers
    const handleLogout = () => {
        setTokenInStorage("{}")
    }

    const handleBellClick = () => {
        notificationConversationKeyRef.current = null
        navigate('/my-messages')
    }

    const renderNotificationBell = () => {
        return notificationConversationKeyRef.current ?
            (   <button
                    className="nav-link text-danger"
                    onClick={handleBellClick}
                >
                    <FontAwesomeIcon icon={faBell} />
                </button>
            ) 
            : null
    }

    return (
        <header>
            <nav className="navbar navbar-expand-lg navbar-light bg-light">
                <div className="container-fluid">
                    <Link className="navbar-brand" to='/'>SwapBnb</Link>

                    { renderNotificationBell() }

                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse"
                            data-bs-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false"
                            aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarNavDropdown">
                        <ul className="navbar-nav">
                        <li className="nav-item dropdown">
                                <a className="nav-link dropdown-toggle" href="#" id="navbarDropdownMenuLink"
                                    role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                    My SwapBnb
                                </a>
                                <ul className="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
                                    <li>
                                        <NavLink className="dropdown-item" to='/my-messages'>
                                            <span className="d-flex justify-content-between align-items-center">
                                                <span>
                                                    <FontAwesomeIcon icon={faEnvelope} />{" "}Messages
                                                </span>
                                                <span>
                                                    { renderNotificationBell() }
                                                </span>
                                            </span>
                                        </NavLink>
                                    </li>
                                    <li>
                                        <NavLink className="dropdown-item" to='/my-booking-requests'>
                                            <FontAwesomeIcon icon={faReceipt} />{" "}Booking requests
                                        </NavLink>
                                    </li>
                                    <li>
                                        <NavLink className="dropdown-item" to='/my-payments'>
                                            <FontAwesomeIcon icon={faMoneyCheck} />{" "}Payments
                                        </NavLink>
                                    </li>
                                    <li>
                                        <NavLink className="dropdown-item" to='/add-property'>
                                            <FontAwesomeIcon icon={faHouseCircleCheck} />{" "}Add property
                                        </NavLink>
                                    </li>
                                    <li>
                                        <NavLink className="dropdown-item" to='/my-profile'>
                                        <FontAwesomeIcon icon={faUser} />{" "}Profile
                                        </NavLink>
                                    </li>  
                                </ul>
                            </li>
                            <li className="nav-item">
                                <NavLink className="nav-link" to='/about'>about</NavLink>
                            </li>
                            <li className="nav-item">
                                {user?.email ?
                                    <div className='d-flex'>
                                        <span className="nav-link me-1">{user.email.split("@")[0]}</span>
                                        <span 
                                            className="nav-link"
                                            onClick={handleLogout}   
                                        ><FontAwesomeIcon icon={faRightFromBracket} />
                                        </span>
                                    </div>
                                    :
                                    <NavLink 
                                        className="nav-link"
                                        to='/auth'
                                    ><FontAwesomeIcon icon={faRightToBracket} />
                                    </NavLink>
                                }
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        </header>
    )
};

export default Header
