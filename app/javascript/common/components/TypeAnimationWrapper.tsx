import React from 'react'
import { TypeAnimation } from 'react-type-animation'

interface IProps {
    content01?: string;
    content02?: string;
    content03?: string;
    content04?: string;
    customClass?: string;
}

const TypeAnimationWrapper: React.FC<IProps> = (props) => {
    const { content01, content02, content03, content04, customClass } = props
    
    return (
        <TypeAnimation
            sequence={[
                // Same substring at the start will only be typed out once, initially
                'Swap or Rent: Welcome to SwapBnb! ',
                1000, // wait 1s before replacing "Mice" with "Hamsters"
                'Extraordinary Home Exchange Journey',
                1000,
                'Unforgettable Stays, Limitless Adventures',
                1000,
                'Discover Renting and Swapping',
                1000
            ]}
            wrapper="span"
            speed={50}
            // style={{ fontSize: '2em', display: 'inline-block' }}
            repeat={Infinity}
            className={`d-block ${customClass}`}
        />
    );
}

export default TypeAnimationWrapper
