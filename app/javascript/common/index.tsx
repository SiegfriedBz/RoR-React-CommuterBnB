import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { AppContextProvider, UserContextProvider } from './contexts'

document.addEventListener("DOMContentLoaded", () => {
    const root = ReactDOM.createRoot(document.getElementById('root'))
    root.render(
        <AppContextProvider>
            <UserContextProvider>
                <App />
            </UserContextProvider>
        </AppContextProvider>
    )
})
