import React, { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useFetch } from '../../../hooks'
import { useAppContext, useUserContext } from '../../../contexts'
import { IUser } from '../../../utils/interfaces'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAt, faMedal, faFaceSmile, faUnlock, faCloudArrowUp } from '@fortawesome/free-solid-svg-icons'
import { ButtonSlide } from '../../../components/buttons'
import LoadingSpinners from '../../../components/LoadingSpinners';

interface IFormValues extends IUser {
    password: string,
    password_confirmation?: string
}

const initFormValues = {
    description: '',
    email: '',
    password: '',
    password_confirmation: '',
    image: '',
}

const UserForm: React.FC = (props) => {
    //* props
    const { user,
        setUser,
        tokenInStorage,
        setTokenInStorage 
    } = props
    //* hooks & context
    const navigate = useNavigate()
    const { updateUser } = useFetch()
    const { isLoading, setFlashMessage } = useAppContext()

    //* state
    const [formValues, setFormValues] = useState<IFormValues>(initFormValues)
    const imageRef = useRef();

    //* effects
    useEffect(() => {
        if(!user) return
        setFormValues(prevState => ({ ...prevState, ...user }))
    }, [user])

    //* helpers
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        const { name, value } = e.target
        setFormValues(prevState => ({ ...prevState, [name]: value }))
    }

    const handleSubmit = async (e: React.SyntheticEvent<EventTarget>) => {
        e.preventDefault()

        if(formValues.password && formValues.password !== formValues.password_confirmation) {
            setFlashMessage({ message: 'Passwords do not match', type: "warning" })
            return
        }

        if(!formValues.email) {
            setFlashMessage({ message: 'Email is required', type: "warning" })
            return
        }

        let formData = new FormData();
        formData.append('user[email]', formValues.email);
        formData.append('user[description]', formValues.description);
        formData.append('user[password]', formValues.password)

        if(imageRef.current.files.length >= 1) {
            formData.append('user[image]', imageRef.current.files[0])
        }
        
        const fetchedData = await updateUser(formData)
        console.log("UserForm fetchedData", fetchedData)
        

        if(!fetchedData) {
            setFlashMessage({ message: 'Something went wrong, please try again', type: "warning" })
            return
        }

        const response = fetchedData[0]
        const data = fetchedData[1]

        if(!response || response.status !== 200 || !data) {
            setFlashMessage({ message: 'Something went wrong, please try again', type: "warning" })
            return
        }

        // TRANSIENT FIX 
        setUser({ ...user, email: formValues.email, description: formValues.description })
        try {
        // TODO: GET NEW TOKEN FROM SERVER (like authenticate page POST /login||/signup)
        // let token = response.headers.get('Authorization')
        // token = token?.split(' ')[1]
        // const serializedToken = JSON.stringify(token)
        // setTokenInStorage(serializedToken)

        setFlashMessage({ message: data.message, type: "success" })
        setTimeout(() => navigate('/'), 1500)
        } catch (err) {
            setFlashMessage({ message: err.message, type: "danger" })
        }
    }

    if(isLoading) return <LoadingSpinners />
    
    return (
        <form onSubmit={handleSubmit}>
            <div className="form-group">
                <label 
                    className='text-primary'
                    htmlFor="email"
                >
                    <FontAwesomeIcon icon={faAt} />
                    {" "}email</label>
                <input  
                    type="email"
                    className="form-control"
                    id="email"
                    name="email"
                    value={formValues.email}
                    onChange={handleChange}
                    required
                    autoComplete='off'
                />

                <label 
                    className='text-primary mt-2'
                    htmlFor="description"
                >
                    <FontAwesomeIcon icon={faMedal} />
                    {" "}description
                </label>
                <textarea 
                    className="form-control"
                    id="description"
                    name="description"
                    value={formValues.description}
                    onChange={handleChange}
                />

                <label 
                    className='text-primary mt-2'
                    htmlFor="password"
                >
                    <FontAwesomeIcon icon={faUnlock} />
                    {" "}password
                </label>
                <input  
                    type="password"
                    className="form-control"
                    id="password"
                    name="password"
                    value={formValues.password}
                    onChange={handleChange}
                    required
                    autoComplete='off'
                />
                <label 
                    className='text-primary mt-2'
                    htmlFor="password_confirmation"
                >
                    <FontAwesomeIcon icon={faUnlock} />
                    {" "}password confirmation
                </label>
                <input  
                    type="password"
                    className="form-control"
                    id="password_confirmation"
                    name="password_confirmation"
                    value={formValues.password_confirmation}
                    onChange={handleChange}
                    required
                    autoComplete='off'
                />

                <label
                    className='text-primary mt-2'
                    htmlFor="image"
                >
                    <FontAwesomeIcon icon={faFaceSmile} />
                    {" "}Image
                </label>
                <input
                    type="file"
                    ref={imageRef}
                    className="form-control"
                    id="image"
                    name="image"
                />

                <ButtonSlide 
                    type="submit"
                    disabled={isLoading}
                    className="btn-slide btn-slide-primary top-slide mt-2"
                    >
                        <FontAwesomeIcon icon={faCloudArrowUp} />
                        {" "}Update my profile
                </ButtonSlide>
            </div>
        </form>
    )
}

export default UserForm
