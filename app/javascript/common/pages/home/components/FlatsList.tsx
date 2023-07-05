import React from 'react'
import { FlatCard } from '../../../components/flats'
import { LoadingSpinners } from '../../../components'
import { IFlat } from '../../../utils/interfaces'

interface IProps {
    flatsForThisPage?: IFlat[]
}

const FlatsList: React.FC<IProps> = ({ flatsForThisPage }) => {

    if(!flatsForThisPage) return <LoadingSpinners />
    
    return (
        <>
            <div className="row row-gap-4 row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4">
                {flatsForThisPage && flatsForThisPage.map((flat: IFlat) => {
                    return (
                        <div className='col' key={flat.flatId}>
                            <FlatCard className="col" flat={flat} />
                        </div>
                    )
                })}
            </div>
        </>
    )
}

export default FlatsList
