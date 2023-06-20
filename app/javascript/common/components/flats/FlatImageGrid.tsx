import React from 'react'

const FlatImageGrid = ({ flat }) => {

    const { images } = flat

    const selectedImages = images.filter((image, index) => index < 4)

    return (
          <div class="row row-cols-2 row-gap-1 gx-1 h-100">
            {selectedImages?.map((url) => {
                return (
                    <div 
                        class="col"
                        key={url}
                        onClick={() => console.log('FlatImageGrid clicked')}
                    >
                        <img src={url} className="d-block w-100 rounded-1" alt="..."/>
                    </div>
                )
            })}
        </div>
    )
}

export default FlatImageGrid
