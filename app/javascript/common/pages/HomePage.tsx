import React, { useEffect } from 'react'
import { useFetch } from '../hooks'
import { FlatsContainer } from '../components'

const HomePage = () => {
    const { getAllFlats } = useFetch()

    useEffect(() => {
        (async () => {
            await getAllFlats()
        })()
    }, [])

    return (
        <>
            <FlatsContainer />
        </>
    )
}

export default HomePage
