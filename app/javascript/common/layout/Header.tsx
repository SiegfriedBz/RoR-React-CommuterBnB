import React from 'react'
import { Link } from "react-router-dom"
import { useUserContext } from '../contexts'

const Header = () => {
    const { user, setTokenInStorage } = useUserContext()

    const handleLogout = () => {
        setTokenInStorage("{}")
    }

    return (
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
                        <li className="nav-item">
                            <Link className="nav-link" to='/about'>about</Link>
                        </li>
                        <li className="nav-item">
                            {user?.email ?
                                <span 
                                    className="nav-link"
                                    onClick={handleLogout}   
                                >Logout
                                </span>
                                :
                                <Link 
                                    className="nav-link"
                                    to='/auth'
                                >signup/login
                                </Link>
                            }
                        </li>
                        <li className="nav-item dropdown">
                            <a className="nav-link dropdown-toggle" href="#" id="navbarDropdownMenuLink"
                                role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                dropdown
                            </a>
                            <ul className="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
                                <li><Link className="nav-link" to='/add-flat'>Add a Property</Link></li>
                                <li><Link className="dropdown-item nav-link" to='/messages'>My Messages</Link></li>
                                <li><Link className="dropdown-item" to='/add-flat'>Add a Property</Link></li>
                            </ul>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    )
};

export default Header
