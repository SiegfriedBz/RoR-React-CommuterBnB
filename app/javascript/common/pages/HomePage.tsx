import React, { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faRectangleList, faEarthEurope } from '@fortawesome/free-solid-svg-icons'
import { FlatsList } from '../components/flats/'
import MapView from '../components/map/MapView'

const HomePage = () => {
    const [showMap, setShowMap] = useState<boolean>(false)

    return (
        <div className="home-page--wrapper">
            <div className="container text-center">
                <button 
                    onClick={() => setShowMap(!showMap)}
                    className="btn btn-outline-dark my-2"
                >{showMap ?
                    <><FontAwesomeIcon icon={faRectangleList} />{" "}Show list</>
                    :
                    <><FontAwesomeIcon icon={faEarthEurope} />{" "}Show map</>
                }
                </button>
                { showMap ? <MapView /> : <FlatsList /> }
            </div>
        </div>
    )
}

export default HomePage
