import React, { useState, forwardRef, useRef, useImperativeHandle } from 'react'
import { Link, NavLink, useNavigate, useLocation} from "react-router-dom"
import clsx from "clsx"
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


const Header: React.FC = (props, forwardedRef: React.Ref) => {
    //* hooks & context
    const location = useLocation()
    const navigate = useNavigate()
    const headerRef = useRef(null)
    const { user, setTokenInStorage } = useUserContext()
    const { notificationConversationKeyRef } = useMessagesContext()

    useImperativeHandle(forwardedRef, () => (
        { goIntoView: () => headerRef.current?.scrollIntoView({ behavior: 'smooth' }) }
        )
    )

    //* state
    const [burgerCollapseVisible, setBurgerCollapseVisible] = useState<boolean>(false)
    const [mySwapBnbCollapseVisible, setMySwapBnbCollapseVisible] = useState<boolean>(false)
    const [mobileSearchBarCollapseVisible, setMobileSearchBarCollapseVisible] = useState<boolean>(false)

    //* handlers
    const handleLogout = () => {
        setTokenInStorage("{}")
    }

    // handlers to push down content on mobile
    const toggleBurgerCollapseVisible = () => {
        setBurgerCollapseVisible(prev => !prev)
        setMySwapBnbCollapseVisible(false)
        setMobileSearchBarCollapseVisible(false)
    }

    const closeCollapse = () => {
        setMySwapBnbCollapseVisible(false)
        setMobileSearchBarCollapseVisible(false)
    }

    const toggleMySwapBnbCollapseVisible = () => {
        setMySwapBnbCollapseVisible(prev => !prev)
        setMobileSearchBarCollapseVisible(false)
    }

    const toggleMobileSearchBarCollapseVisible = () => {
        setMySwapBnbCollapseVisible(false)
        setMobileSearchBarCollapseVisible(prev => !prev)
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

    // check if Home Page
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
                    role="button" data-bs-toggle="dropdown" aria-expanded="false"
                    onClick={toggleMobileSearchBarCollapseVisible}
                    >
                    Search
                </a>
                <div className="dropdown-menu" aria-labelledby="navbarDropdownMenuLink-Search">
                <div className="header--mobile-search-bar">
                    <SearchBar
                        closeCollapse={closeCollapse}
                    />
                </div>
                </div>
            </li>
        )
    }


    // TypeAnimation on home page
    const renderTypeAnimationOnHomePage = () => {
        if (!isHomePage()) return null

        return (
            <div className={burgerCollapseVisible ? "invisible" : "container text-center visible"}>
                <TypeAnimationWrapper customClass={"text-primary fs-3 mt-0 mt-lg-5 mb-1"}/>
            </div>
        )
    }

    const headerWrapperClass = clsx("header--wrapper", {
        "mobile-extended" : burgerCollapseVisible,
        "mobile-extended-xl" : mySwapBnbCollapseVisible,
        "mobile-extended-xxl" : mobileSearchBarCollapseVisible,
        "": !burgerCollapseVisible && !mySwapBnbCollapseVisible && !mobileSearchBarCollapseVisible
    })

    return (
        <>
        <header ref={headerRef} className={headerWrapperClass}>
            <nav className="navbar navbar-expand-lg">
                <div className="container-fluid pt-2">
                    <Link className="navbar-brand fs-2" to='/'>SwapBnb</Link>
                    { renderNotificationBell() }

                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse"
                            data-bs-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false"
                            aria-label="Toggle navigation"
                            onClick={toggleBurgerCollapseVisible}
                    >
                        <FontAwesomeIcon className="text-primary fs-3" icon={faBarsStaggered} />
                    </button>
                    <div className="collapse navbar-collapse" id="navbarNavDropdown">
                        <ul className="navbar-nav">
                            <li className="nav-item dropdown my-auto">
                                <a className="nav-link dropdown-toggle fs-5" href="#" id="navbarDropdownMenuLink"
                                    role="button" data-bs-toggle="dropdown" aria-expanded="false"
                                    onClick={toggleMySwapBnbCollapseVisible}
                                >
                                    My SwapBnb
                                </a>
                                <ul className="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
                                    <li onClick={closeCollapse}>
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
                                    <li onClick={closeCollapse}>
                                        <NavLink className="dropdown-item" to='/my-booking-requests'>
                                            <FontAwesomeIcon icon={faReceipt} />{" "}Booking requests
                                        </NavLink>
                                    </li>
                                    <li onClick={closeCollapse}>
                                        <NavLink className="dropdown-item" to='/my-payments'>
                                            <FontAwesomeIcon icon={faMoneyCheck} />{" "}Payments
                                        </NavLink>
                                    </li>
                                    <li onClick={closeCollapse}>
                                        <NavLink className="dropdown-item" to='/add-property'>
                                            <FontAwesomeIcon icon={faHouseCircleCheck} />{" "}Add property
                                        </NavLink>
                                    </li>
                                    <li onClick={closeCollapse}>
                                        <NavLink className="dropdown-item" to='/my-profile'>
                                            <FontAwesomeIcon icon={faUser} />{" "}Profile
                                        </NavLink>
                                    </li>  
                                </ul>
                            </li>

                            {/* search bar on mobile home page */}
                            { renderSearchBarOnHomePageMobile() }

                            <li onClick={closeCollapse}
                                className="nav-item my-auto"
                            >
                                <NavLink className="nav-link fs-5" to='/about'>About</NavLink>
                            </li>
                            <li onClick={closeCollapse}
                                className="nav-item"
                            >
                                { user?.email ?
                                    <Link
                                        className="nav-link fs-5"
                                        onClick={handleLogout}   
                                    >
                                        { user.email.split("@")[0]}{" "}
                                        <FontAwesomeIcon icon={faRightFromBracket} />
                                    </Link>
                                    :
                                        <Link 
                                            className="nav-link fs-5"
                                            to='/auth'
                                        >
                                            <FontAwesomeIcon icon={faRightToBracket} />
                                        </Link>
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

export default forwardRef(Header)
