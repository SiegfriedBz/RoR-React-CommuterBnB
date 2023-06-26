import React from 'react'
import { Outlet } from 'react-router-dom'
import { MessagesContextProvider } from '../contexts'

const MessagesContextLayout = () => {
  return (
    <MessagesContextProvider>
        <Outlet />
    </MessagesContextProvider>
  )
}

export default MessagesContextLayout
