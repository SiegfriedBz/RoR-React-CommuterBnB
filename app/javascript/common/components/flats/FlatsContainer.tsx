import React, { useState } from 'react'
import FlatsList from './FlatsList'
import MapView from '../map/MapView'

const FlatsContainer: React.FC = () => {
    const [showMap, setShowMap] = useState<boolean>(false)

  return (
    <div className="container text-center">
        <button 
          onClick={() => setShowMap(!showMap)}
          className="btn btn-outline-primary my-2"
        >{showMap ? "Show list" : "Show map" }
        </button>
        { showMap ? <MapView /> : <FlatsList /> }
    </div>
  )
}

export default FlatsContainer
