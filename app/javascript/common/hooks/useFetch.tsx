import React from 'react'
import { useAppContext
    // , useFlatsContext
 } from '../contexts' 
// import { handleFetchedFlats } from './helpers'

const BASE_URL = '/api/v1'

const fetchDefaultOptions = {
    method: 'GET',
}

export const useFetch = () => {

    // context
    // const { setFlashMessage, setLoading } = useAppContext()
    const { setFlashMessage, setIsLoading } = useAppContext()
    // const { setAllFlatsInContext, addFlatInContext, updateFlatInContext } = useFlatsContext()

    // fetch
    const fetchData = async (url: string, options={}, expectedStatus=200) => {
        setIsLoading(true)
        setFlashMessage({ message: null, type: "success" })

        try{
            const response: Response = await fetch(url, { ...fetchDefaultOptions, ...options })
            if (response.status === expectedStatus) {
                const data = await response.json()
                console.log("fetchData response", response)
                console.log("fetchData data", data)
                return [response, data]
            } else {
                const error = await response.json()
                throw new Error(error)
            }
        } catch (err) {
            setFlashMessage({ message: err.message, type: "alert" })
            console.log("err", err);
        } finally {
            setIsLoading(false)
        }
    }

    //* user
    interface IFormData {
        email: string,
        password: string,
        password_confirmation?: string
    }

    const authenticate = async (formData: IFormData, isLoginForm: boolean) => {
        const path = isLoginForm ? '/login' : '/signup'
        const url = `${BASE_URL}${path}`
        const { email, password, password_confirmation } = formData

        //==> TODO add password confirmation server side
        // const body = isLoginForm ? { user: { email, password } } : { user: formData }
        const body = { user: { email, password } } 
        const expectedStatus = isLoginForm ? 200 : 201

        return await fetchData(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body), 
        }, expectedStatus)
    }

    //* flats
    // not protected
    // const getAllFlats = async() => {
    //     const [response, data] = await fetchData(`${BASE_URL}/flats`, {}, 200)
    //     const flats = handleFetchedFlats(data)

    //     setAllFlatsInContext(flats)
    // }

    // not protected
    // const getFlatWithReviews = async(flatId) => {
    //     const [response, data] = await fetchData(`${FLATS_API_URL}/${flatId}`, {}, 200)
        
    //     const [flat] = handleFetchedFlats([data])

    //     // update to add reviews (not fetched from getAllFlats)
    //     updateFlatInContext(flat)
    // }

    // TODO: protected
    // const createFlat = async (formData) => {
    //     const [response, data] = await fetchData(`${BASE_URL}/flats`, { 
    //         method: 'POST', body: formData 
    //     }, 201)
        
    //     const [newFlat] = handleFetchedFlats([data])
        
    //     addFlatInContext(newFlat)

    //     setFlashMessage({ message: 'Flat created successfully!', type: "success" })
    //     setTimeout(() => {
    //         setFlashMessage({ message: null, type: "success" })
    //         navigate(`/flats/${newFlat.flatId}`);
    //     }, 1500)
    // }

    return { 
        authenticate
        // getAllFlats, getFlatWithReviews, createFlat
     }
}
