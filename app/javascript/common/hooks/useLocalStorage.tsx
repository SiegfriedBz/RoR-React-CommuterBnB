import React, { useState, useEffect } from 'react'

const getSavedValue = (key: string, initialValue: any) => {
    const savedValue = JSON.parse(localStorage.getItem(key) || '{}')
    if (savedValue) return savedValue

    if (initialValue instanceof Function) return initialValue()
    return initialValue
}

export const useLocalStorage = (key: string, initialValue: any) => {
    const [value, setValue] = useState(() => {
       return getSavedValue(key, initialValue)
    })

    useEffect(() => {
        localStorage.setItem(key, JSON.stringify(value))
    }, [key, value])

    return [value, setValue]
}
