import React from 'react'
import { useParams } from 'react-router-dom'
import FlatForm from './components/FlatForm'

const CreateFlatPage: React.FC = () => {
    //* hooks
    const { id: editFlatId } = useParams()

    const formTitle = editFlatId ? "Edit property" : "Create new property"

    return (
        <>
            <h2>{formTitle}</h2>
            <div className="row">
                {/* flat form  */}'
                <div className='col col-12 col-lg-6'>
                    <FlatForm editFlatId={editFlatId} />
                </div>
                {/* right panel image from md */}
                <div className='col d-none d-lg-block ms-lg-3 col-lg-5 form-image sticky-top'></div>
            </div>
        </>
    )
}

export default CreateFlatPage
