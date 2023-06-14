import React, {useEffect, useCallback} from 'react'
import { useParams, Navigate } from 'react-router-dom'
import { useFetch } from '../hooks'
import { useAppContext, useFlatsContext } from '../contexts'
import FlatCardCarousel from '../components/flats/FlatCardCarousel'
import MapView from '../components/map/MapView'
import { HostedBy, LoadingSpinners } from '../components'

const FlatDetailsPage: React.FC = () => {
    const { id } = useParams()
    const { isLoading } = useAppContext()
    const { flats, updateFlatInContext } = useFlatsContext()
    const { getFlat } = useFetch()
    
    const flat = flats.find(flat => flat.flatId === parseInt(id))

    // fetch flat from server & update it in context
    useEffect(() => {
        (async () => {
            const fetchedData = await getFlat(id)
            if (!fetchedData) return

            const [response, data] = fetchedData
            if(!data) return

            updateFlatInContext(data.flat)
        })()
    }, [id])

    if(!flat) return <LoadingSpinners />

    const { flatId, ownerId, title, description, address, longitude, latitude } = flat

    return (
        <div>
            <h2>{title}</h2>
            <p>{description}</p>
            <p>{address}</p>
            <br />
            <div className="row row-gap-1">
                <div className="col-6">
                    <FlatCardCarousel flat={flat} />
                </div>
                <div className="col-6">
                    <FlatCardCarousel flat={flat} />
                </div>
            </div>
            <br />
            <MapView selectedFlatId={flatId} mapHeight={400}/>
            {isLoading ? <LoadingSpinners /> : <HostedBy />}
        </div>
    )
}

export default FlatDetailsPage