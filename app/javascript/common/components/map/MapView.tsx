import React, { useState, useEffect, useRef, useCallback } from 'react'
import { useParams } from 'react-router-dom'
import Map, { Marker, Popup } from 'react-map-gl'
import { useFlatsContext } from "../../contexts"
import FlatCard from '../flats/FlatCard'
import LoadingSpinners from '../LoadingSpinners'
import { IFlat } from '../../utils/interfaces'

//************************************************ */
//===> TODO: move to secrets
import mapbox_api_token from "./mapbox_api_token"
const MAPBOX_TOKEN = mapbox_api_token
//************************************************ */

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

interface IProps {
    selectedFlatId?: number,
    mapHeight?: number
}

const MapView: React.FC<IProps> = ({ mapSelectedFlatId, mapHeight=600 }) => {
    //* hooks
    const { id: currentFlatIdParam } = useParams()

    //* context
    // const { user } = useUserContext()
    const { flats } = useFlatsContext()

    if(!flats) return <LoadingSpinners />

    //* state
    const mapRef = useRef(null)
    const [selectedFlat, setSelectedFlat] = useState<IFlat | undefined>(undefined)
    const [userMarker, setUserMarker] = useState<IUserMarker>({longitude: 14.44, latitude: 35.89 })
    // const [userFlats, setUserFlats] = useState([])
    const [flatsMarkers, setFlatsMarkers] = useState<IFlatMarker[] | []>([])
    const [showPopup, setShowPopup] = useState(false)

    // set flats markers
    const getflatsMarkers = useCallback(() => {
        if(!flats) return

        const newMarkers = flats.map(flat => {
              const { flatId, longitude, latitude, pricePerNightInCents } = flat
              return { flatId, longitude, latitude, pricePerNightInCents }
          })

        setFlatsMarkers(newMarkers)
    }, [flats])
    
    //* effects
    useEffect(() => {
        (async () => {
            await getflatsMarkers()
        })()
    }, [flats, getflatsMarkers])


    // set selectedFlat from params (FlatDetailsPage)
    useEffect(() => {
        if(!currentFlatIdParam) return

        setSelectedFlat(flats.find(flat => flat.flatId === parseInt(currentFlatIdParam)))
    }, [flats, currentFlatIdParam])


    // set selectedFlat from props
    useEffect(() => {
    const flat = flats.find(flat => flat.flatId === mapSelectedFlatId)
    
    if(!flat) return

    setSelectedFlat(flat)
}, [flats, mapSelectedFlatId])

    // center map on selected flat
    useEffect(() => {
        if(!selectedFlat) return

        const { longitude, latitude } = selectedFlat
        if(!longitude || !latitude) return

        mapRef.current?.flyTo({ center: [ longitude, latitude ] })
    }, [selectedFlat])

    useEffect(() => {
        flatsMarkers?.forEach(marker => flatMarkerBadgeClass(marker.flatIds))
    }, [selectedFlat])

    //* handlers
    // set selectedFlat on marker click & open flat popup & center map on selected flat
    const handleFlatMarkerClick = (flatId) => {
        const flat = flats.find(flat => flat.flatId === flatId)
        
        if(!flat) return
        
        setSelectedFlat(flat)
        setShowPopup(true)
    }

    const handlePopUpClose = () => {
        setSelectedFlat(undefined)
        setShowPopup(false)
    }

    //* helpers
    // flat marker badge classes
    const flatMarkerBadgeClass = (flatId) => {
        // console.log('MapView flatMarkerBadgeClass flatId', flatId);
        return (
            parseInt(flatId) === parseInt(selectedFlat?.flatId) ? 
                "badge rounded-pill text-bg-success text-white fw-bold py-2 px-3"
                : "badge rounded-pill text-bg-info text-white fw-bold py-2 px-3"
        )
    }
    
    return (
        <Map
            ref={mapRef}
            initialViewState={{
                ...userMarker,
                zoom: ZOOMS.LARGE_VIEW
            }}
            style={{ height: mapHeight, width: "auto" }}
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
                            <div onClick={() => handleFlatMarkerClick(flatId)}>
                                <span className={flatMarkerBadgeClass(flatId)}>
                                    ${pricePerNightInCents/100}
                                </span>
                            </div>
                        </Marker>
                    )
            })}

            {/* flat popUp */}
            {showPopup && selectedFlat && selectedFlat?.longitude && selectedFlat?.latitude &&
                <Popup
                        anchor='bottom'
                        longitude={selectedFlat?.longitude}
                        latitude={selectedFlat?.latitude}
                        offset={[0, -15]}
                        onClose={handlePopUpClose}
                        closeButton={true}
                        closeOnClick={false}
                >
                    <FlatCard flat={selectedFlat} />
                </Popup>
                }
            </>
        </Map>
    )
}

export default MapView
