import React, { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useFetch } from '../../hooks'
import { useAppContext, useFlatsContext } from '../../contexts'
import { FlashMessage } from '../../components'

const FlatForm = () => {
    // hooks
    const navigate = useNavigate()
    const { createFlat } = useFetch()

    // context
    const { flashMessage, setFlashMessage } = useAppContext()
    const { addFlatInContext } = useFlatsContext()

    // component state
    const [formValues, setFormValues] = useState({})
    const imagesRef = useRef();

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormValues(prevState => ({ ...prevState, [name]: value }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        let formData = new FormData();
        formData.append('flat[title]', formValues.title);
        formData.append('flat[description]', formValues.description);
        formData.append('flat[address]', formValues.address);
        formData.append('flat[price_per_night_in_cents]', formValues.price_per_night_in_cents);

        if(imagesRef.current.files.length >= 1) {
            for(let i = 0; i < imagesRef.current.files.length; i++) {
                formData.append('flat[images][]', imagesRef.current.files[i]);
            }
        }

        console.log("handleSubmit formData", formData);
        

        const fetchedFlat = await createFlat(formData)

        if(!fetchedFlat) {
            setFlashMessage({ message: 'Something went wrong, please try again', type: "alert" })
            setTimeout(() => {
                setFormValues({})
                setFlashMessage({ message: null, type: "alert" })
            }, 1500)
            return
        }

        const [response, data] = fetchedFlat
        const { flat, message } = data

        if(!flat) {
            setFlashMessage({ message: 'Something went wrong, please try again', type: "alert" })
            setTimeout(() => {
                setFormValues({})
                setFlashMessage({ message: null, type: "alert" })
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
            <div className="form-group">
                <label htmlFor="title">Title</label>
                <input type="text" className="form-control" id="title" name="title" onChange={handleChange} />
                <label htmlFor="description">Description</label>
                <input type="text" className="form-control" id="description" name="description" onChange={handleChange} />
                <label htmlFor="address">Address</label>
                <input type="text" className="form-control" id="address" name="address" onChange={handleChange} />
                <label htmlFor="price_per_night_in_cents">Price per night in cents</label>
                <input type="text" className="form-control" id="price_per_night_in_cents" name="price_per_night_in_cents" onChange={handleChange} />
                <label htmlFor="images">Images</label>
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

                <button type="submit" className="btn btn-primary">Submit</button>
            </div>
            </>
        </form>
    )
}

export default FlatForm
