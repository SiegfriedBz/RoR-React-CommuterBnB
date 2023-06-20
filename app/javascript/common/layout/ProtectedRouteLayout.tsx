import React from 'react'
import { Outlet } from 'react-router-dom'
import { ProtectedRoute } from '../components'

const ProtectedRouteLayout = () => {
  return (
    <ProtectedRoute>
        <Outlet />
    </ProtectedRoute>
  )
}

export default ProtectedRouteLayout
