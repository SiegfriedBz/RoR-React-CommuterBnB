import React from 'react'
import { Link, NavLink } from "react-router-dom"
import { useUserContext } from '../contexts'

const Header = () => {
    const { user, setTokenInStorage } = useUserContext()
    
    const handleLogout = () => {
        setTokenInStorage("{}")
    }

    return (
        <header>
            <nav className="navbar navbar-expand-lg navbar-light bg-light">
                <div className="container-fluid">
                    <Link className="navbar-brand" to='/'>logo</Link>
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
                                    <li><NavLink className="dropdown-item" to='/my-profile'>Profile</NavLink></li>  
                                    <li><NavLink className="dropdown-item" to='/my-messages'>Messages</NavLink></li>
                                    <li><NavLink className="dropdown-item" to='/my-booking-requests'>Booking requests</NavLink></li>
                                    <li><NavLink className="dropdown-item" to='/my-payments'>Payments</NavLink></li>
                                    <li><NavLink className="dropdown-item" to='/add-property'>Add a Property</NavLink></li>
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
                                        >Logout
                                        </span>
                                    </div>
                                    :
                                    <NavLink 
                                        className="nav-link"
                                        to='/auth'
                                    >signup/login
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
