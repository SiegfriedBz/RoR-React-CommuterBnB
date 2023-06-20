import React from 'react'
import { Outlet } from 'react-router-dom'
import { FlatsContextProvider } from '../contexts'

const FlatsContextLayout = () => {
  return (
    <FlatsContextProvider>
        <Outlet />
    </FlatsContextProvider>
  )
}

export default FlatsContextLayout
