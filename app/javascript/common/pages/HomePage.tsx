import React, { useEffect, useCallback } from 'react'
import { useFlatsContext } from '../contexts'
import { FlatsContainer } from '../components/flats'

const HomePage = () => {
    // useEffect fetch flats from server & set context
    useFlatsContext()

    return (
        <div className="home-page--wrapper">
            <FlatsContainer />
        </div>
    )
}

export default HomePage
