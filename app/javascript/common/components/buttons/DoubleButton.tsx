import React from 'react'

const DoubleButton = () => {
  return (
    <span className="double-button">
        <button className="pill-button">Send message</button>
        <button className="round-button">
            <span className="bi-arrow-right"></span>
        </button> 
    </span>
  )
}

export default DoubleButton
