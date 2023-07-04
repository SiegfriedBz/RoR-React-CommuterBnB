import React, { useState } from 'react'
import { Link, NavLink, useNavigate, useLocation} from "react-router-dom"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    faUser,
    faEnvelope,
    faReceipt,
    faMoneyCheck,
    faHouseCircleCheck,
    faRightFromBracket,
    faRightToBracket,
    faBell,
    faBarsStaggered
} from '@fortawesome/free-solid-svg-icons'
import { useMessagesContext, useUserContext } from '../../contexts'
import SearchBar from './SearchBar'
import { TypeAnimationWrapper } from '../../components'

const Header: React.FC = () => {
    //* hooks & context
    const location = useLocation()
    const navigate = useNavigate()
    const { user, setTokenInStorage } = useUserContext()
    const { notificationConversationKeyRef } = useMessagesContext()

    //* state
    const [animationIsVisible, setAnimationIsVisible] = useState<boolean>(true)

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
                    className="nav-link"
                    onClick={handleBellClick}
                >
                    <FontAwesomeIcon className="text-danger" icon={faBell} />
                </button>
            ) 
            : null
    }

    const isHomePage = () => {
        return location.pathname === '/'
    }

    // SearchBar on home page
    const renderSearchBarOnHomePage = () => {
        if (!isHomePage()) return null

        return (
            <div className="header--main-search-bar">
                <SearchBar />
            </div>
        )
    }

    // SearchBar on mobile home page
    const renderSearchBarOnHomePageMobile = () => {
        if (!isHomePage()) return null

        return (
            <li className="nav-item dropdown my-auto d-block d-lg-none">
                <a className="nav-link dropdown-toggle fs-5" href="#" id="navbarDropdownMenuLink-Search"
                    role="button" data-bs-toggle="dropdown" aria-expanded="false">
                    Search
                </a>
                
                <div className="dropdown-menu" aria-labelledby="navbarDropdownMenuLink-Search">
                <div className="header--mobile-search-bar">
                    <SearchBar />
                </div>
                </div>
            </li>
        )
    }

    // TypeAnimation on home page
    const toggleTypeAnimationIsVisible = () => {
        setAnimationIsVisible(prev => !prev)
    }

    const renderTypeAnimationOnHomePage = () => {
        if (!isHomePage()) return null

        return (
            <div className={animationIsVisible ? "container text-center visible" : "invisible"}>
                <TypeAnimationWrapper customClass={"text-primary fs-3 mt-0 mt-lg-5 mb-1"}/>
            </div>
        )
    }

    return (
        <>
        <header className="header--wrapper">
            <nav className="navbar navbar-expand-lg">
                <div className="container-fluid">
                    <Link className="navbar-brand fs-2" to='/'>SwapBnb</Link>
                    { renderNotificationBell() }

                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse"
                            data-bs-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false"
                            aria-label="Toggle navigation"
                            onClick={toggleTypeAnimationIsVisible}
                    >
                        <FontAwesomeIcon className="text-primary fs-3" icon={faBarsStaggered} />
                    </button>
                    <div className="collapse navbar-collapse" id="navbarNavDropdown">
                        <ul className="navbar-nav">
                            <li className="nav-item dropdown my-auto">
                                <a className="nav-link dropdown-toggle fs-5" href="#" id="navbarDropdownMenuLink"
                                    role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                    My SwapBnb
                                </a>
                                <ul className="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
                                    <li>
                                        <NavLink className="dropdown-item" to='/my-messages'>
                                            <span className="d-flex justify-content-between align-items-center">
                                                <span>
                                                    <FontAwesomeIcon className="text-primary" icon={faEnvelope} />{" "}Messages
                                                </span>
                                                <span>
                                                    { renderNotificationBell() }
                                                </span>
                                            </span>
                                        </NavLink>
                                    </li>
                                    <li>
                                        <NavLink className="dropdown-item" to='/my-booking-requests'>
                                            <FontAwesomeIcon className="text-primary" icon={faReceipt} />{" "}Booking requests
                                        </NavLink>
                                    </li>
                                    <li>
                                        <NavLink className="dropdown-item" to='/my-payments'>
                                            <FontAwesomeIcon className="text-primary" icon={faMoneyCheck} />{" "}Payments
                                        </NavLink>
                                    </li>
                                    <li>
                                        <NavLink className="dropdown-item" to='/add-property'>
                                            <FontAwesomeIcon className="text-primary" icon={faHouseCircleCheck} />{" "}Add property
                                        </NavLink>
                                    </li>
                                    <li>
                                        <NavLink className="dropdown-item" to='/my-profile'>
                                        <FontAwesomeIcon className="text-primary" icon={faUser} />{" "}Profile
                                        </NavLink>
                                    </li>  
                                </ul>
                            </li>

                            {/* search bar on mobile home page */}
                            { renderSearchBarOnHomePageMobile() }

                            <li className="nav-item my-auto">
                                <NavLink className="nav-link fs-5" to='/about'>About</NavLink>
                            </li>
                            <li className="nav-item">
                                { user?.email ?
                                    <NavLink
                                        className="nav-link text-primary fs-5"
                                        onClick={handleLogout}   
                                    >
                                        { user.email.split("@")[0]}{" "}
                                        <FontAwesomeIcon icon={faRightFromBracket} />
                                    </NavLink>
                                    :
                                        <NavLink 
                                            className="nav-link text-primary fs-5"
                                            to='/auth'
                                        >
                                            <FontAwesomeIcon icon={faRightToBracket} />
                                        </NavLink>
                                }
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
            {/* search bar on lg-up home page */}
            { renderSearchBarOnHomePage() }
        </header>
        { renderTypeAnimationOnHomePage() }
        </>
    )
};

export default Header
