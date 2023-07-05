import React from 'react'
import { Outlet } from 'react-router-dom'
import { AppContextProvider, UserContextProvider, FlatsContextProvider, MessagesContextProvider } from '../contexts'
import Header from './header/Header'
import Footer from "./Footer"

const TopContextLayout: React.FC<any> = () => {
    return (
        <AppContextProvider>
            <UserContextProvider>
                <FlatsContextProvider>
                    <MessagesContextProvider>
                        <Header />
                        <main className="container mt-2">
                            <Outlet />
                        </main>
                        <Footer />
                    </MessagesContextProvider>
                </FlatsContextProvider>
            </UserContextProvider>
        </AppContextProvider>
    )
}
export default TopContextLayout
