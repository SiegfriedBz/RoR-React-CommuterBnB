import React, { useState } from 'react'
import { useNavigate} from 'react-router-dom'
import { useFetch } from '../../hooks'
import { useAppContext, useUserContext } from '../../contexts'
import {ButtonSlide} from '../../components/buttons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAt, faUnlock, faRightToBracket } from '@fortawesome/free-solid-svg-icons'

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
    //* hooks & context
    const { authenticate } = useFetch()
    const navigate = useNavigate()
    const { setFlashMessage, isLoading } = useAppContext()
    const { setTokenInStorage } = useUserContext()

    //* state
    const [formValues, setFormValues] = useState<IFormData>(initFormValues)
    const [isLoginForm, setIsLoginForm] = useState<boolean>(true)

    //* helpers
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
        setTimeout(() => navigate('/'), 1500)
        } catch (err) {
            setFlashMessage({ message: err.message, type: "danger" })
        }
    }

    return (
        <div className="auth-page--wrapper ">
            <form onSubmit={handleSubmit} className="w-md-50">
                <div className="auth-page--form-input-group">
                    <label 
                        className="text-primary"
                        htmlFor="email">
                        <FontAwesomeIcon icon={faAt} />{" "}email
                    </label>
                    <input 
                        type="email" 
                        name="email"
                        value={formValues.email}
                        onChange={handleChange}
                        autoComplete="email"
                        className="form-control"
                    />
                    <label 
                        className="text-primary mt-2"
                        htmlFor="password">
                        <FontAwesomeIcon icon={faUnlock} />{" "}password
                    </label>
                    <input 
                        type="password" 
                        name="password"
                        value={formValues.password}
                        onChange={handleChange}
                        autoComplete="new-password"
                        className="form-control mb-2"
                    />
                    { !isLoginForm ?
                        <>
                            <label
                                className="text-primary mt-2"
                                htmlFor="password_confirmation">
                                <FontAwesomeIcon icon={faUnlock} />{" "}confirm password
                            </label>
                            <input 
                                type="password" 
                                name="password_confirmation"
                                value={formValues.password_confirmation}
                                onChange={handleChange} 
                                autoComplete="new-password"
                                className="form-control mb-2"
                            />
                        </>
                        : null
                    }
                    <ButtonSlide 
                        type="submit"
                        disabled={isLoading}
                        className={`btn-slide right-slide mt-2 ${isLoading? "btn-slide-blue" : "btn-slide-primary"}`}>
                        { isLoginForm ? 
                            <><FontAwesomeIcon icon={faRightToBracket} />{" "}login</>
                            : <><FontAwesomeIcon icon={faRightToBracket} />{" "}sign up</>
                        }
                    </ButtonSlide>
                    <ButtonSlide
                        type="button"
                        onClick={toggleLoginRegister}
                        className='btn-slide top-slide mt-2 btn-slide-blue'>
                        {!isLoginForm ? 
                            'Already a member, please login'
                            : 'Not yet a member, please signup'
                        }
                    </ButtonSlide>
                </div>
            </form>
        </div>
    )
}

export default AuthPage
