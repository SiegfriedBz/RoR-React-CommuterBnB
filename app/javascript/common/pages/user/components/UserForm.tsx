import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAt, faMedal, faFaceSmile, faUnlock, faCloudArrowUp } from '@fortawesome/free-solid-svg-icons'
import { useFetch } from '../../../hooks'
import { useAppContext } from '../../../contexts'
import { ButtonSlide } from '../../../components/buttons'
import LoadingSpinners from '../../../components/LoadingSpinners'
import DropZoneWrapper from '../../../components/DropZoneWrapper'
import { IUser, IUserContext } from '../../../utils/interfaces'

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

const UserForm: React.FC<IUserContext> = ({ user, setUser }) => {
    //* hooks & context
    const navigate = useNavigate()
    const { updateUser } = useFetch()
    const { isLoading, setFlashMessage } = useAppContext()

    // Dropzone
    const onDrop = (acceptedFiles) => {
        setDroppedFile(acceptedFiles[0])
    }

    //* state
    const [formValues, setFormValues] = useState<IFormValues>(initFormValues)
    const [droppedFile, setDroppedFile] = useState(undefined)

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

        if(droppedFile) {
            formData.append('user[image]', droppedFile)
        }
        
        const fetchedData = await updateUser(formData)
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

                <DropZoneWrapper 
                    onDrop={onDrop}
                    droppedFiles={[droppedFile]}
                    maxFiles={1}
                    maxSize={15000}
                    multiple={false}
                    className="drop-zone--wrapper"
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
