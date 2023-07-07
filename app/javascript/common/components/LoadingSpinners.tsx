import React from 'react'

const LoadingSpinners: React.FC = () => {
  return (
    <div className='d-flex'>
        <div className="spinner-grow spinners" role="status">
            <span className="visually-hidden">Loading...</span>
        </div>
        <div className="spinner-grow spinners mx-2" role="status">
            <span className="visually-hidden">Loading...</span>
        </div>
        <div className="spinner-grow spinners" role="status">
            <span className="visually-hidden">Loading...</span>
        </div>
    </div>
  )
}

export default LoadingSpinners
