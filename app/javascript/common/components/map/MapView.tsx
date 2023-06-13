import React, { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import Map, { Marker, Popup } from 'react-map-gl'
import { useFlatsContext } from "../../contexts"
import { IFlat } from '../../utils/interfaces'
import FlatCard from '../flats/FlatCard'

//===> TODO: move to secrets
import mapbox_api_token from "./mapbox_api_token"
const MAPBOX_TOKEN = mapbox_api_token
const mapStyle = 'mapbox://styles/mapbox/streets-v9'

const ZOOMS = {
    LARGE_VIEW: 9,
    CLOSE_VIEW: 12
}

interface IUserMarker {
    longitude: number,
    latitude: number,
}

interface IFlatMarker {
    flatId: number,
    longitude: number,
    latitude: number,
    pricePerNightInCents: number,
}

export interface IPopUpInfo {
    selectedFlat: IFlat | {},
    isVisible: boolean,
}

const MapView = () => {
    // * hooks
    const navigate = useNavigate()
    
    // * context
    // const { user } = useUserContext()
    const { flats } = useFlatsContext()

    if(!flats) return null

    const initPopupInfo = {
        selectedFlat: flats[0] || {},
        isVisible: false,
    }

    // * local state
    const mapRef = useRef(null)
    const [userMarker, setUserMarker] = useState<IUserMarker>({longitude: 14.44, latitude: 35.89 })
    const [flatsMarkers, setFlatsMarkers] = useState<IFlatMarker[] | []>([])
    const [popUpInfo, setPopUpInfo] = useState<IPopUpInfo>(initPopupInfo)

    // set flats markers
    const getflatsMarkers = useCallback(() => {
        if(!flats) return

        const newMarkers = flats
          .map(flat => {
              const { flatId, longitude, latitude, pricePerNightInCents } = flat
              return { flatId, longitude, latitude, pricePerNightInCents }
          })

        setFlatsMarkers(newMarkers)
    }, [flats])

    useEffect(() => {
        getflatsMarkers()
    }, [getflatsMarkers])

    // set and open flat popup + center map on flat
    const handleFlatMarkerClick = (flatId) => {
        const flat = flats.find(flat => flat.flatId === flatId)
        if(!flat) return
        
        setPopUpInfo({
            selectedFlat: flat,
            isVisible: true,
        })
        
        mapRef.current?.flyTo({ center: [ flat.longitude, flat.latitude + 2 ] })
    }

    const handlePopUpClose = () => {
        setPopUpInfo({ selectedFlat: {}, isVisible: false })
    }

    return (
            <Map
                ref={mapRef}
                initialViewState={{
                    ...userMarker,
                    zoom: ZOOMS.LARGE_VIEW
                }}
                style={{height: 600}}
                mapStyle={mapStyle}
                mapboxAccessToken={MAPBOX_TOKEN}
                onMove={() => { getflatsMarkers() }}
            >
                <>
                {/* flatsMarkers */}
                {flats && flatsMarkers?.map(marker => {
                    const { flatId, longitude, latitude, pricePerNightInCents } = marker
                        return (
                            <Marker key={flatId} longitude={longitude} latitude={latitude} >
                                <div
                                    onClick={() => handleFlatMarkerClick(flatId)}
                                >
                                    <span className="badge rounded-pill text-bg-info text-white fw-bold py-2 px-3">${pricePerNightInCents/100}</span>
                                    </div>
                            </Marker>
                        )
                })}

                {/* flat popUp */}
                {popUpInfo?.isVisible && popUpInfo?.selectedFlat?.longitude &&
                    <Popup
                            anchor='bottom'
                            longitude={popUpInfo.selectedFlat?.longitude}
                            latitude={popUpInfo.selectedFlat?.latitude}
                            offset={[0, -15]}
                            onClose={handlePopUpClose}
                            closeButton={true}
                            closeOnClick={false}
                        >
                            <FlatCard flat={popUpInfo.selectedFlat} />
                    </Popup>
                 }
                </>
            </Map>
    )
}

export default MapView
