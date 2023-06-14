import React from 'react'
import { useFlatsContext } from '../../contexts'
import FlatCard from './FlatCard'

const FlatsList = () => {
    const { flats } = useFlatsContext()

  return (
    <div className="row row-gap-4 row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4">
        {flats && flats.map(flat => {
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
