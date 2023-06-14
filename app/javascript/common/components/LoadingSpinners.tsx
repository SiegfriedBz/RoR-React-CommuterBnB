import React from 'react'

const LoadingSpinners: React.FC = () => {
  return (
    <div className='d-flex'>
        <div className="spinner-grow text-secondary" role="status">
            <span className="visually-hidden">Loading...</span>
        </div>
        <div className="spinner-grow text-secondary mx-2" role="status">
            <span className="visually-hidden">Loading...</span>
        </div>
        <div className="spinner-grow text-secondary" role="status">
            <span className="visually-hidden">Loading...</span>
        </div>
    </div>
  )
}

export default LoadingSpinners
