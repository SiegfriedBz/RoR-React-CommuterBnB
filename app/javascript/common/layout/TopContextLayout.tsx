import React from 'react'
import { Outlet } from 'react-router-dom'
import { AppContextProvider, UserContextProvider, MessagesContextProvider } from '../contexts'
import Header from "./Header"
import Footer from "./Footer"

const TopContextLayout: React.FC<any> = () => {
    return (
        <AppContextProvider>
            <UserContextProvider>
                <MessagesContextProvider>
                    <Header />
                    <main className="container container-fluid mt-2">
                        <Outlet />
                    </main>
                    <Footer />
                </MessagesContextProvider>
            </UserContextProvider>
        </AppContextProvider>
    )
}
export default TopContextLayout
