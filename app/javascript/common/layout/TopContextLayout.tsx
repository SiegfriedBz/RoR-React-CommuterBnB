import React, { useRef } from 'react'
import { Outlet } from 'react-router-dom'
import { AppContextProvider, UserContextProvider, FlatsContextProvider, MessagesContextProvider } from '../contexts'
import Header from './header/Header'
import Footer from "./Footer"

const TopContextLayout: React.FC<any> = () => {
    const headerRef = useRef(null)

    const scrollToHeaderTop = () => {
        headerRef.current.goIntoView()
    }

    return (
        <AppContextProvider>
            <UserContextProvider>
                <FlatsContextProvider>
                    <MessagesContextProvider>
                        <Header ref={headerRef} />
                        <main className="container mt-2">
                            <Outlet />
                        </main>
                        <Footer scrollToHeaderTop={scrollToHeaderTop} />
                    </MessagesContextProvider>
                </FlatsContextProvider>
            </UserContextProvider>
        </AppContextProvider>
    )
}
export default TopContextLayout
