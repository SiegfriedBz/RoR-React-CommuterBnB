import React, { useState } from 'react'
import { useNavigate} from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAt, faUnlock, faRightToBracket } from '@fortawesome/free-solid-svg-icons'
import { useFetch } from '../hooks'
import { useAppContext, useUserContext } from '../contexts'
import { FlashMessage } from '../components'

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
    //# hooks
    const { authenticate } = useFetch()
    const navigate = useNavigate()

    //# context
    const { flashMessage, setFlashMessage, isLoading } = useAppContext()
    const { setTokenInStorage } = useUserContext()

    //# state
    const [formValues, setFormValues] = useState<IFormData>(initFormValues)
    const [isLoginForm, setIsLoginForm] = useState<boolean>(true)

    //# helpers
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
            setFlashMessage({ message: err.message, type: "danger" })
        }
    }

    return (
        <div className="auth-page--wrapper ">
            <form onSubmit={handleSubmit} className="mb-5 w-50">
                <div className="auth-page--form-input-group">
                    { flashMessage.message && <FlashMessage {...flashMessage} /> }

                    <label htmlFor="email">
                        <FontAwesomeIcon icon={faAt} />{" "}email
                    </label>
                    <input 
                        type="email" 
                        name="email"
                        value={formValues.email}
                        onChange={handleChange}
                        autoComplete="email"
                    />
                    <label htmlFor="password">
                        <FontAwesomeIcon icon={faUnlock} />{" "}password
                    </label>
                    <input 
                        type="password" 
                        name="password"
                        value={formValues.password}
                        onChange={handleChange}
                        autoComplete="new-password"
                    />
                    { !formValues?.isLoginForm ?
                        <>
                            <label htmlFor="password_confirmation">
                                <FontAwesomeIcon icon={faUnlock} />{" "}confirm password
                            </label>
                            <input 
                                type="password" 
                                name="password_confirmation"
                                value={formValues.password_confirmation}
                                onChange={handleChange} 
                                autoComplete="new-password"
                            />
                        </>
                        : null
                    }
                    <button 
                        type="submit"
                        disabled={isLoading}
                        className={isLoading? `btn btn-secondary my-2` : `btn btn-outline-dark my-2`}>
                        { isLoginForm ? 
                            <><FontAwesomeIcon icon={faRightToBracket} />{" "}login</>
                            : <><FontAwesomeIcon icon={faRightToBracket} />{" "}sign up</>
                        }
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
        </div>
    )
}

export default AuthPage
