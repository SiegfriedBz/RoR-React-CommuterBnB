import React from 'react'
import { IFlashMessage } from '../utils/interfaces'

const FlashMessage: React.FC<IFlashMessage> = ({ message, type }) => {
    console.log("message", message)
    console.log("type", type)

  return <div className={`alert alert-${type}`}>{message}</div>
}

export default FlashMessage
