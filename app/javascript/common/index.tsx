import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { AppContextProvider, UserContextProvider, FlatsContextProvider } from './contexts'

document.addEventListener("DOMContentLoaded", () => {
    const root = ReactDOM.createRoot(document.getElementById('root'))
    root.render(
        <AppContextProvider>
            <UserContextProvider>
                <FlatsContextProvider>
                <App />
                </FlatsContextProvider>
            </UserContextProvider>
        </AppContextProvider>
    )
})
