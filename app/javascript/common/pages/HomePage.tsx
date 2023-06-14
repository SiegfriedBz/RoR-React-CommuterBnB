import React, { useEffect, useCallback } from 'react'
import { useFlatsContext } from '../contexts'
import { FlatsContainer } from '../components'

const HomePage = () => {
    // useEffect fetch flats from server & set context
    useFlatsContext()

    return (
        <>
            <FlatsContainer />
        </>
    )
}

export default HomePage
