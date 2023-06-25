import React, { useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify'
import { useAppContext } from '../contexts'

const ToastLayout = () => {
    const { flashMessage } = useAppContext()

    useEffect(() => {
        if(!flashMessage) return

        toast(flashMessage?.message)

    }, [flashMessage])

  return (
    <>
        <ToastContainer />
        <Outlet />
    </>
  )
}

export default ToastLayout
