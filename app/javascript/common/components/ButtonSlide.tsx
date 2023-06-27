import React from 'react'

interface IProps {
  children: React.ReactNode,
  slideClass: string
}

const ButtonSlide: React.FC<IProps> = (props) => {
  const { children, className, ...rest } = props
  return (
    <button
      className={`btn-slide ${className}`}
      { ...rest }
      >
        { children }
    </button>
  )
}

export default ButtonSlide
