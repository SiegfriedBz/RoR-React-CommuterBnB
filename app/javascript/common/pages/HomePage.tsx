import React, { useEffect } from 'react'
import { useFetch } from '../hooks'
import { FlatsContainer } from '../components'

const HomePage = () => {
    const { getAllFlats } = useFetch()

    useEffect(() => {
        console.log("HomePage");
        (async () => {
            await getAllFlats()
        })()
    }, [])

    return (
        <>
            <h2>HomePage</h2>
            <FlatsContainer />
        </>
    )
}

export default HomePage
