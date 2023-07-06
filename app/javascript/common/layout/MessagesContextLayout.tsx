import React from 'react'
import { Outlet } from 'react-router-dom'
import { MessagesContextProvider } from '../contexts'

const MessagesContextLayout: React.FC = () => {
  return (
    <MessagesContextProvider>
        <Outlet />
    </MessagesContextProvider>
  )
}

export default MessagesContextLayout
