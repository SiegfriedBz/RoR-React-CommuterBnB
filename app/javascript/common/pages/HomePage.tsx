import React, { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faRectangleList, faEarthEurope } from '@fortawesome/free-solid-svg-icons'
import { FlatsList } from '../components/flats/'
import MapView from '../components/map/MapView'
import ButtonSlide from "../components/ButtonSlide"

const HomePage = () => {
    const [showMap, setShowMap] = useState<boolean>(false)

    return (  
        <div className="home-page--wrapper">
            <div className="container text-center">
                <ButtonSlide 
                    className="btn-slide-sm btn-slide-dark right-slide mx-0 my-2"
                    onClick={() => setShowMap(!showMap)}
                >
                    { showMap ?
                        <><FontAwesomeIcon icon={faRectangleList} />{" "}Show list</>
                        : <><FontAwesomeIcon icon={faEarthEurope} />{" "}Show map</>
                    }
                </ButtonSlide>
                { showMap ? <MapView /> : <FlatsList /> }
            </div>
        </div>
    )
}

export default HomePage
