import React from 'react'
import { useFlatsContext } from '../../../contexts'
import { FlatCard } from '../../../components/flats'
import { LoadingSpinners } from '../../../components'
import { IFlat } from '../../../utils/interfaces'

const FlatsList: React.FC = () => {
    const { flats } = useFlatsContext()

    if(!flats) return <LoadingSpinners />

    console.log("flats", flats)
    
    return (
        <div className="row row-gap-4 row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4">
            {flats && flats.map((flat: IFlat) => {
                return (
                    <div className='col' key={flat.flatId}>
                        <FlatCard className="col" flat={flat} />
                    </div>
                )
            })}
        </div>
    )
}

export default FlatsList
