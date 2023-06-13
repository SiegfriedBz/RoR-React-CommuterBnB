import React, { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useFetch } from '../../hooks'
import { useAppContext, useFlatsContext } from '../../contexts'
import { FlashMessage } from '../../components'

interface IFormValues {
    title: string,
    description: string,
    address: string,
    price_per_night: number,
    available: boolean,
    category: "entire place" | "private room",
}

const initFormValues = {
    title: "",
    description: "",
    address: "",
    price_per_night: 75,
    available: true,
    category: "entire place",
}

const FlatForm = () => {
    // hooks
    const navigate = useNavigate()
    const { createFlat } = useFetch()

    // context
    const { flashMessage, setFlashMessage } = useAppContext()
    const { addFlatInContext } = useFlatsContext()

    // component state
    const [formValues, setFormValues] = useState<IFormValues>(initFormValues)
    const imagesRef = useRef();

    const handleChange = (e) => {
        const { type, name, value } = e.target
        if(type === "checkbox") {
            setFormValues(prevState => ({ ...prevState, [name]: !prevState[name] }))
            return
        }
        setFormValues(prevState => ({ ...prevState, [name]: value }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        let formData = new FormData();
        formData.append('flat[title]', formValues.title);
        formData.append('flat[description]', formValues.description);
        formData.append('flat[address]', formValues.address);

        const pricePerNightInCents = formValues.price_per_night * 100
        formData.append('flat[price_per_night_in_cents]', String(pricePerNightInCents))

        const category = formValues.category === "entire place" ? "entire_place" : "private_room"
        formData.append('flat[category]', category)

        formData.append('flat[available]', formValues.available);

        if(imagesRef.current.files.length >= 1) {
            for(let i = 0; i < imagesRef.current.files.length; i++) {
                formData.append('flat[images][]', imagesRef.current.files[i]);
            }
        }
        
        const fetchedFlat = await createFlat(formData)

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
        
        addFlatInContext(flat)
        setFlashMessage({ message, type: "success" })

        setTimeout(() => {
            setFlashMessage({ message: null, type: "success" })
            navigate(`/properties/${flat.flatId}`)
        }, 1500)
    }

    return (
        <form onSubmit={handleSubmit}>
            <>
            {flashMessage.message && <FlashMessage {...flashMessage} />}
            <div className="form-group w-50">
                <label htmlFor="title" className='mt-2'>Title</label>
                <input type="text" className="form-control" id="title" name="title" onChange={handleChange} required/>
                <label htmlFor="description" className='mt-2'>Description</label>
                <input type="text" className="form-control" id="description" name="description" onChange={handleChange} required/>
                <label htmlFor="address" className='mt-2'>Address</label>
                <input type="text" className="form-control" id="address" name="address" onChange={handleChange} required/>
                <label htmlFor="price_per_night" className='mt-2'>Price per night</label>
                <input type="text" className="form-control" id="price_per_night" name="price_per_night" onChange={handleChange} required/>
                
                <div className="d-flex mt-2">
                <input type="checkbox" checked={formValues.available} className="form-check me-2" id="available" name="available" onChange={handleChange} />
                <label htmlFor="available">Available now</label>
                </div>

                <label htmlFor="category" className='mt-2'>Category</label>
                <div className="d-flex">
                    <select className="form-select" aria-label="Default select example" name="category" onChange={handleChange}>
                        <option value="entire place">Entire place</option>
                        <option value="private room">Private room</option>
                    </select>
                </div>

                <label htmlFor="images" className='mt-2'>Images</label>
                <input type="file" multiple ref={imagesRef} className="form-control" id="images" name="images"/>

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

                <button type="submit" className="btn btn-primary mt-2">Submit</button>
            </div>
            </>
        </form>
    )
}

export default FlatForm
