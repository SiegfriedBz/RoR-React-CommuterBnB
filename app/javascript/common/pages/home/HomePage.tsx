import React, { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faRectangleList, faEarthEurope } from '@fortawesome/free-solid-svg-icons'
import FlatsList from './components/FlatsList'
import MapView from '../../components/map/MapView'
import { NewsLetterSuscribe } from '../../components'
import {ButtonSlide} from '../../components/buttons'

const HomePage = () => {
    const [showMap, setShowMap] = useState<boolean>(false)

    return (  
        <div className="home-page--wrapper">
            <div className="container text-center">
                <ButtonSlide 
                    className="btn-slide btn-slide-primary bottom-slide mx-0 mt-3 mt-lg-5 mb-3"
                    onClick={() => setShowMap(!showMap)}
                >
                    { showMap ?
                        <><FontAwesomeIcon icon={faRectangleList} />{" "}Show list</>
                        : <><FontAwesomeIcon icon={faEarthEurope} />{" "}Show map</>
                    }
                </ButtonSlide>
                { showMap ? <MapView /> : <FlatsList /> }
                <NewsLetterSuscribe />
            </div>
        </div>
    )
}

export default HomePage
