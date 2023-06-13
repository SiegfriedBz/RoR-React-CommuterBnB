import React, { useState } from 'react'
import { useNavigate} from 'react-router-dom'
import { useFetch } from '../hooks'
import { useAppContext, useUserContext } from '../contexts'
import { FlashMessage } from '../components'
import jwt_decode from 'jwt-decode'

interface IFormData {
    email: string,
    password: string,
    password_confirmation?: string
}

const initFormValues = {
    email: '',
    password: '',
    password_confirmation: ''
}

const AuthPage: React.FC = () => {
    // hooks
    const { authenticate } = useFetch()
    const navigate = useNavigate()

    // context
    const { flashMessage, setFlashMessage, isLoading } = useAppContext()
    const { setTokenInStorage } = useUserContext()

    // state
    const [formValues, setFormValues] = useState<IFormData>(initFormValues)
    const [isLoginForm, setIsLoginForm] = useState<boolean>(true)

    // functions
    const toggleLoginRegister = () => {
        setIsLoginForm(prev => !prev)
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => { 
        const { name, value } = e.target
        setFormValues(prevState => ({ ...prevState, [name]: value }))
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        const fetchedData = await authenticate(formValues, isLoginForm)
        if (!fetchedData) return

        const [response, data] = fetchedData
        let token = response.headers.get('Authorization')
        token = token?.split(' ')[1]
        
        try {

        const serializedToken = JSON.stringify(token)
        setTokenInStorage(serializedToken)

        setFlashMessage({ message: data.message, type: "success" })
        setTimeout(() => {
            setFlashMessage({ message: null, type: "success" })
            navigate('/')
            }, 1500)
        } catch (err) {
            setFlashMessage({ message: err.message, type: "alert" })
        }
    }

    return (
        <>
            <h2>{isLoginForm ? 'Login' : 'Signup'}</h2>
            <form onSubmit={handleSubmit} className="mb-5">
                {flashMessage.message && <FlashMessage {...flashMessage} />}
                <div className="d-flex flex-column w-25">
                    <label htmlFor="email">Email</label>
                    <input 
                        type="email" 
                        name="email"
                        value={formValues.email}
                        onChange={handleChange}
                        autoComplete="email"
                    />
                    <label htmlFor="password">Password</label>
                    <input 
                        type="password" 
                        name="password"
                        value={formValues.password}
                        onChange={handleChange}
                        autoComplete="new-password"
                    />
                    {!formValues.isLoginForm &&
                    <>
                        <label htmlFor="password_confirmation">Confirm Password</label>
                        <input 
                            type="password" 
                            name="password_confirmation"
                            value={formValues.password_confirmation}
                            onChange={handleChange} 
                            autoComplete="new-password"
                        />
                    </>
                    }
                    <button 
                        type="submit"
                        disabled={isLoading}
                        className={isLoading? `btn btn-secondary my-2` : `btn btn-outline-primary my-2`}>
                        {isLoginForm ? 'Login' : 'Signup'}
                    </button>
                    <button
                        type="button"
                        onClick={toggleLoginRegister}
                        className='btn btn-outline-secondary my-2'>
                        {!isLoginForm ? 
                            'Already a member, please login'
                            : 'Not yet a member, please signup'
                        }
                    </button>
                </div>
            </form>
        </>
    )
}

export default AuthPage
