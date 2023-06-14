import React, {useEffect} from 'react'
import { useParams } from 'react-router-dom'
import { useFetch } from '../hooks'
import { useFlatsContext } from '../contexts'
import FlatCardCarousel from '../components/flats/FlatCardCarousel'
import MapView from '../components/map/MapView'

const FlatDetailsPage: React.FC = () => {
    const { id } = useParams()
    const { flats } = useFlatsContext()
    const { getAllFlats } = useFetch()

    useEffect(() => {
        (async () => {
            await getAllFlats()
        })()
    }, [getAllFlats])

    if(!flats) return null
    if(!id) return null

    const flat = flats.find(flat => flat.flatId === parseInt(id))
    if(!flat) return null

    const { flatId, ownerId, title, description, address, longitude, latitude } = flat
    // 1. render flat with infos fetched from context (from previous getAllFlats fetch)
    // 2. fetch flat details from backend (getFlatWithOwnerDetailsAndFlatReviews) + update context for this flat
    // 2': render loading spinners for flat details not yet fetched
    // 3. render flat with infos fetched from backend

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

        </div>
    )
}

export default FlatDetailsPage