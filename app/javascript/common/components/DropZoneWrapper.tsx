import React from 'react'
import Dropzone from 'react-dropzone'

const DropZoneWrapper: React.FC = (props) =>  {
        const { onDrop, droppedFiles, maxFiles, maxSize, multiple } = props

        return (
            <div className="text-center text-primary text-bg-light rounded py-3 my-2">
            <Dropzone 
                onDrop={onDrop}
                accept={{
                    'image/png': ['.png'],
                    'image/jpg': ['.jpg'],
                    }}
                maxFiles={maxFiles}
                // maxSize={maxSize}
                multiple={multiple}
                
            >
                {({ getRootProps, getInputProps, isDragActive, isDragReject }) => (
                    <div {...getRootProps()}>
                        <input {...getInputProps()} />
                        {!isDragActive && 'Click here or drop a file to upload!'}
                        {isDragActive && !isDragReject && "Drop it like it's hot!"}
                        {isDragReject && "File type not accepted, sorry!"}
                        {droppedFiles?.length >0 && 
                            <ul className="list-group mt-2">
                            { droppedFiles.map(file => {
                                    if(!file?.name) return null

                                    return (
                                        <li
                                            key={file?.name}
                                            className="list-group-item text-center text-primary text-bg-light">
                                            {file.name} is ready to be uploaded
                                        </li>
                                    )
                                })}
                            </ul>
                        }
                    </div>
                )}
        </Dropzone>
        </div>
        )
}

export default DropZoneWrapper
