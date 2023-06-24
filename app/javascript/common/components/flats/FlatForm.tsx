import React, { useState, useRef, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useFetch } from '../../hooks'
import { useAppContext, useFlatsContext } from '../../contexts'
import { FlashMessage } from '../../components'
import FlatCardCarousel from './FlatCardCarousel'
import { IFlat, FlatCategoryType } from '../../utils/interfaces'
import FlatCategoryEnum from '../../utils/constants/flatCategoryEnum'

interface IFormValues {
    title: string,
    description: string,
    street: string,
    city: string,
    country: string,
    price_per_night: number,
    available: boolean,
    category: FlatCategoryType
}

const initFormValues = {
    title: "",
    description: "",
    street: "",
    city: "",
    country: "",
    price_per_night: 85,
    available: true,
    category: FlatCategoryEnum.ENTIRE_PLACE,
}

const FlatForm: React.FC = () => {
    //# hooks
    const { id: editFlatId } = useParams()
    const navigate = useNavigate()
    const { createFlat, updateFlat } = useFetch()

    //# context
    const { isLoading, flashMessage, setFlashMessage } = useAppContext()
    const { flats, addFlatInContext, updateFlatInContext } = useFlatsContext()

    //# state
    const [formValues, setFormValues] = useState<IFormValues>(initFormValues)
    const [flatToEdit, setFlatToEdit] = useState<IFlat | undefined>(undefined)
    const imagesRef = useRef();

    //# effects
    // set form values if editing
    useEffect(() => {
        if(!flats || !editFlatId) return  

        const flatToEdit = flats?.find((flat) => flat.flatId === parseInt(editFlatId))
        if(!flatToEdit) return

        setFlatToEdit(flatToEdit)

        const flatCategory = flatToEdit.category === FlatCategoryEnum.ENTIRE_PLACE_SERVER ? FlatCategoryEnum.ENTIRE_PLACE : FlatCategoryEnum.PRIVATE_ROOM

        setFormValues({
            title: flatToEdit.title,
            description: flatToEdit.description,
            street: flatToEdit.street,
            city: flatToEdit.city,
            country: flatToEdit.country,
            price_per_night: flatToEdit.pricePerNightInCents / 100,
            available: flatToEdit.available,
            category: flatCategory
        })

        return () => {
            setFlatToEdit(undefined)
            setFormValues(initFormValues)
        }
    }, [flats, editFlatId])

    //# helpers
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        const { type, name, value } = e.target
        if(type === "checkbox") {
            setFormValues(prevState => ({ ...prevState, [name]: !prevState[name] }))
            return
        }
        setFormValues(prevState => ({ ...prevState, [name]: value }))
    }

    const handleSubmit = async (e: React.SyntheticEvent<EventTarget>) => {
        e.preventDefault()

        let formData = new FormData();
        formData.append('flat[title]', formValues.title);
        formData.append('flat[description]', formValues.description);
        formData.append('flat[street]', formValues.street)
        formData.append('flat[city]', formValues.city)
        formData.append('flat[country]', formValues.country)

        const pricePerNightInCents = formValues.price_per_night * 100
        formData.append('flat[price_per_night_in_cents]', String(pricePerNightInCents))

        const flatCategory = formValues.category === FlatCategoryEnum.ENTIRE_PLACE ? 
            FlatCategoryEnum.ENTIRE_PLACE_SERVER
             : FlatCategoryEnum.PRIVATE_ROOM_SERVER
        
        formData.append('flat[category]', flatCategory)

        formData.append('flat[available]', formValues.available);

        if(imagesRef.current.files.length >= 1) {
            for(let i = 0; i < imagesRef.current.files.length; i++) {
                formData.append('flat[images][]', imagesRef.current.files[i]);
            }
        }
        
        let fetchedFlat
        if(editFlatId) {
            fetchedFlat = await updateFlat(editFlatId, formData)
        } else {
            fetchedFlat = await createFlat(formData)
        }

        if(!fetchedFlat) {
            setFlashMessage({ message: 'Something went wrong, please try again', type: "warning" })
            setTimeout(() => {
                setFormValues({})
                setFlashMessage({ message: null, type: "success" })
            }, 1500)
            return
        }

        const [response, data] = fetchedFlat
        const { flat, message } = data

        if(!flat) {
            setFlashMessage({ message: 'Something went wrong, please try again', type: "warning" })
            setTimeout(() => {
                setFormValues({})
                setFlashMessage({ message: null, type: "success" })
            }, 1500)
            return
        }
        
        if(editFlatId) {
            updateFlatInContext(flat)
        } else {
            addFlatInContext(flat)
        }
       
        setFlashMessage({ message, type: "success" })

        setTimeout(() => {
            setFlashMessage({ message: null, type: "success" })
            navigate(`/`)
        }, 1500)
    }

    const formTitle = editFlatId ? "Edit property" : "Create new property"
    const FlatToEditImages = () => {
        if(!flatToEdit) return null

        return (
            <div className='mt-3'>  
                <h4>Current flat images</h4>
                <FlatCardCarousel images={flatToEdit?.images} />
            </div>
        )
    }

    if(editFlatId && !flatToEdit) return <div>Loading...</div>
    if(isLoading) return <div>Loading...</div>

    return (
        <>
        <h2>{formTitle}</h2>
        <form onSubmit={handleSubmit}>
            <>
            { flashMessage.message && <FlashMessage {...flashMessage} /> }

            <div className="form-group w-50">
                <label htmlFor="title" className='mt-2'>Title</label>
                <input
                    type="text"
                    className="form-control"
                    id="title"
                    name="title"
                    value={formValues.title}
                    onChange={handleChange}
                    required
                />
                <label htmlFor="description" className='mt-2'>Description</label>
                <input
                    type="text"
                    className="form-control"
                    id="description"
                    name="description"
                    value={formValues.description}
                    onChange={handleChange}
                    required
                />
                <label htmlFor="street" className='mt-2'>Street</label>
                <input
                    type="text"
                    className="form-control"
                    id="street"
                    name="street"
                    value={formValues.street}
                    onChange={handleChange}
                />
                <label htmlFor="city" className='mt-2'>City</label>
                <input
                    type="text"
                    className="form-control"
                    id="city"
                    name="city"
                    value={formValues.city}
                    onChange={handleChange}
                    required
                />
                <label htmlFor="country" className='mt-2'>Country</label>
                <input
                    type="text"
                    className="form-control"
                    id="country"
                    name="country"
                    value={formValues.country}
                    onChange={handleChange}
                    required
                />
                <label htmlFor="price_per_night" className='mt-2'>Price per night</label>
                <input
                    type="text"
                    className="form-control"
                    id="price_per_night"
                    name="price_per_night"
                    value={formValues.price_per_night}
                    onChange={handleChange}
                    required
                />
                <div className="d-flex mt-2">
                <input
                    type="checkbox"
                    checked={formValues.available}
                    className="form-check me-2"
                    id="available"
                    name="available"
                    onChange={handleChange}
                />
                <label htmlFor="available">Available now</label>
                </div>

                <label htmlFor="category" className='mt-2'>Category</label>
                <div className="d-flex">
                    <select 
                        className="form-select" 
                        aria-label="Default select example" 
                        name="category" 
                        value={formValues.category}
                        onChange={handleChange}
                    >
                        <option value="entire place">Entire place</option>
                        <option value="private room">Private room</option>
                    </select>
                </div>

                <label htmlFor="images" className='mt-2'>Images</label>
                <input
                    type="file"
                    multiple ref={imagesRef}
                    required={!editFlatId}
                    className="form-control"
                    id="images"
                    name="images"
                />

                {/* <Dropzone onDrop={onDrop} multiple>
                    {({ getRootProps, getInputProps, isDragActive }) => (
                    <div {...getRootProps()} className={isDragActive ? 'dropzone active' : 'dropzone'}>
                        <input name="image" {...getInputProps()} />
                        {isDragActive ? <p>Drop the files here...</p> : <p>Drag and drop some files here, or click to select files</p>}
                    </div>
                    )}
                </Dropzone> */}
{/* 
                {images.length > 0 && (
                    <div>
                    <h4>Uploaded Images:</h4>
                    {images.map((image, index) => (
                        <div key={index}>
                        <img src={URL.createObjectURL(image)} alt={`Image ${index}`} />
                        </div>
                    ))}
                    </div>
                )} */}

                <button type="submit" className="btn btn-dark mt-2">Submit</button>
            </div>
            </>
        </form>
        <FlatToEditImages />
        </>
    )
}

export default FlatForm
