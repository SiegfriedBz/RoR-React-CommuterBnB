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
    const { notificationRef } = useMessagesContext()
    
    //* handlers
    const handleLogout = () => {
        setTokenInStorage("{}")
    }

    const handleBellClick = () => {
        notificationRef.current = null
        navigate('/my-messages')
    }

    const renderNotificationBell = () => {
        return notificationRef.current ?
            (   <span
                    className="nav-link text-danger"
                    onClick={handleBellClick}
                >
                    <FontAwesomeIcon icon={faBell} />
                </span>
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
                                    menu
                                </a>
                                <ul className="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
                                    <li>
                                        <NavLink className="dropdown-item" to='/my-profile'>
                                        <FontAwesomeIcon icon={faUser} />{" "}Profile
                                        </NavLink>
                                    </li>  
                                    <li>
                                        <NavLink className="dropdown-item" to='/my-messages'>
                                            <FontAwesomeIcon icon={faEnvelope} />{" "}Messages
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
