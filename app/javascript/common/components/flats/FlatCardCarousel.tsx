import React from 'react'
import { IFlat } from '../../utils/interfaces'

const FlatCardCarousel: React.FC<IFlat> = ({ flat }) => {

    const { images } = flat
    
    if(!images) return null

    const carouselIndicators = () => {
        return (
            <>
            <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="0" className="active" aria-current="true" aria-label="Slide 1"></button>
            {images
                .filter((image: string, index: number) => index > 0)
                .map((image: string, index: number) => {
                    return (
                        <button key={index} type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to={index} aria-label={`Slide ${index + 1}`}></button>
                    )
                })
            }
            </>
        )
    }

    const carouselItems = () => {
        return (
            <>
                <div className="carousel-item active">
                    <img src={images[0]} className="d-block w-100" alt="..."/>
                </div>
                {images
                    .filter((image: string, index: number) => index > 0)
                    .map((image: string, index: number) => {
                        return (
                            <div key={index} className="carousel-item">
                                <img src={image} className="d-block w-100" alt="..."/>
                            </div>
                        )
                    })
                }
            </>
        )
    }

    return (
        <div id="carouselExampleIndicators" className="carousel slide">
            <div className="carousel-indicators">
                {carouselIndicators()}
            </div>
            <div className="carousel-inner">
                {carouselItems()}
            </div>
            <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="prev">
                <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                <span className="visually-hidden">Previous</span>
            </button>
            <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="next">
                <span className="carousel-control-next-icon" aria-hidden="true"></span>
                <span className="visually-hidden">Next</span>
            </button>
        </div>
    )
}

export default FlatCardCarousel
