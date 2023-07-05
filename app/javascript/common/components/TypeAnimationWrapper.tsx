import React from 'react'
import { TypeAnimation } from 'react-type-animation'

interface IProps {
    customClass?: string;
}

const TypeAnimationWrapper: React.FC<IProps> = (props) => {
    const { customClass } = props
    
    return (
        <TypeAnimation
            sequence={[
                // Same substring at the start will only be typed out once, initially
                'Swap or Rent',
                1000, 
                'Welcome to SwapBnb! ',
                1000, 
                'Unforgettable Stays',
                1000,
                'Limitless Adventures',
                1000,
                'Discover Renting and Swapping',
                1000
            ]}
            wrapper="span"
            speed={50}
            repeat={Infinity}
            className={`d-block ${customClass}`}
        />
    );
}

export default TypeAnimationWrapper
